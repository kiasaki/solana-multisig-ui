import { useState, useEffect } from "react";
import * as anchor from "@project-serum/anchor";
import {
  IDL,
  tokenProgramId,
  associatedTokenProgramId,
  programId,
} from "./data";

const { BN } = anchor;
const { PublicKey } = anchor.web3;

export const publicKey = (s) => new PublicKey(s);

// Get all tokens accounts of treasury
// https://hopp.sh/r/rbOgCjrZZ5Pc
// {
//   "jsonrpc": "2.0",
//   "id": 1,
//   "method": "getTokenAccountsByOwner",
//   "params": [
//     "HEGabBshuXkh62EPxVFoG23gMLcDcALDRa5bo4Z5J62i",
//     {
//       "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//     },
//     {
//       "encoding": "jsonParsed"
//     }
//   ]
// }

export const ONE = new BN(1000000000);

const url = `https://api.${
  typeof window !== "undefined" && window.location.search === "?cluster=devnet"
    ? "devnet"
    : "mainnet-beta"
}.solana.com`;
const preflightCommitment = "recent";
const connection = new anchor.web3.Connection(url, preflightCommitment);

let listeners = [];
let state = {
  connected: false,
  publicKey: PublicKey.default,
};
if (global?.window?.DOMError) {
  // debug exports
  window.getState = () => state;
  window.anchor = anchor;
  window.fn = formatNumber;

  // init provider
  const wallet = anchor.web3.Keypair.generate();
  anchor.setProvider(
    new anchor.Provider(connection, wallet, {
      preflightCommitment,
      commitment: preflightCommitment,
    })
  );
  setGlobalState({ program: new anchor.Program(IDL, programId.toString()) });

  // connect to wallet if returning user
  const initHandle = setInterval(() => {
    if (!window.solana && !window.solflare) return;
    clearInterval(initHandle);

    if (window.localStorage.getItem("walletConnected")) {
      walletConnect();
    }
  }, 50);
}

export function useGlobalState() {
  const [lastState, setLastState] = useState(state);

  useEffect(() => {
    const handler = () => {
      setLastState(state);
    };
    listeners.push(handler);
    return () => listeners.splice(listeners.indexOf(handler), 1);
  }, []);

  return lastState;
}

export function setGlobalState(newState) {
  state = Object.assign(Object.assign({}, state), newState);
  listeners.forEach((l) => l());
}

export async function walletConnect() {
  if (state.connected) return;
  let wallet;
  let publicKey;
  if (window.solflare) {
    await window.solflare.connect();
    wallet = window.solflare;
    publicKey = new PublicKey(window.solflare.publicKey.toBytes());
    window.solflare.on('disconnect', () => {
      setGlobalState({ connected: false, publicKey: PublicKey.default, program: null });
    });
  } else {
    if (!window.solana /* || !window.solana.isPhantom */) {
      return alert("Can't find a Solana wallet! Is it installed?");
    }
    const handleDisconnect = window.solana._handleDisconnect;
    try {
      await new Promise((resolve, reject) => {
        window.solana._handleDisconnect = () => {
          reject(new Error("Wallet closed"));
          return handleDisconnect.apply(window.solana, args);
        };
        const onConnect = () => {
          window.solana.off("connect", onConnect);
          resolve();
        };
        window.solana.on("connect", onConnect);
        window.solana.connect().catch((err) => {
          window.solana.off("connect", onConnect);
          reject(err);
        });
      });
    } finally {
      window.solana._handleDisconnect = handleDisconnect;
    }
    window.solana.on("disconnect", () => {
      setGlobalState({ connected: false, publicKey: PublicKey.default, program: null });
    });
    wallet = window.solana;
    publicKey = new PublicKey(window.solana.publicKey.toBytes());
  }
  setGlobalState({
    connected: true,
    publicKey,
  });
  anchor.setProvider(
    new anchor.Provider(connection, wallet, {
      preflightCommitment,
      commitment: preflightCommitment,
    })
  );
  setGlobalState({
    program: new anchor.Program(IDL, new PublicKey(programId)),
  });
}

export async function walletDisconnect() {
  await window.solana.disconnect();
  state = { connected: false };
}

export async function fetchMultisig(multisigKey) {
  const updates = { multisigKey: publicKey(multisigKey) };
  updates.multisig = await state.program.account.multisig.fetch(multisigKey);
  setGlobalState(updates);
  return updates.multisig;
}

export async function fetchMint(key) {
  const connection = anchor.getProvider().connection;
  const info = await connection.getAccountInfo(key);
  const supply = bnFromBytes(info.data.slice(36, 44));
  return { supply, decimals: info.data[45] };
}

export async function fetchTokenAccount(key) {
  const connection = anchor.getProvider().connection;
  const info = await connection.getAccountInfo(key);
  if (!info) throw new Error("No account for key");
  const amount = bnFromBytes(info.data.slice(64, 72));
  return { amount };
}

export async function getAssociatedTokenAccountKey(mint, owner) {
  return (
    await computePda([owner, tokenProgramId, mint], associatedTokenProgramId)
  )[0];
}

export function getCreateAtaInstruction(mintKey, ownerKey, tokenAccountKey) {
  return new anchor.web3.TransactionInstruction({
    keys: [
      { pubkey: state.publicKey, isSigner: true, isWritable: true },
      { pubkey: tokenAccountKey, isSigner: false, isWritable: true },
      { pubkey: ownerKey, isSigner: false, isWritable: false },
      { pubkey: mintKey, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: associatedTokenProgramId,
    data: new Uint8Array(),
  });
}

export async function computePda(seeds, pid = programId) {
  for (let i = 0; i < seeds.length; i++) {
    if (typeof seeds[i] == "string") {
      seeds[i] = new TextEncoder("utf-8").encode(seeds[i]);
    }
    if (typeof seeds[i].toBuffer == "function") {
      seeds[i] = seeds[i].toBuffer();
    }
    if (typeof seeds[i] === "number") {
      seeds[i] = bnToBytes(new BN(seeds[i]));
    }
  }
  return await PublicKey.findProgramAddress(seeds, pid);
}

export function explorerLink(address) {
  const suffix =
    typeof window !== "undefined" &&
    window.location.search === "?cluster=devnet"
      ? "?cluster=devnet"
      : '';
  return `https://explorer.solana.com/address/${address.toString()}${suffix}`;
}

export function formatPublicKey(k) {
  const s = k.toString();
  return s.slice(0, 4) + "…" + s.slice(-4);
}

export function bn(n, decimals = 9) {
  return new BN(n).mul(new BN(10).pow(new BN(decimals)));
}

export function bnMin(a, b) {
  return a.lt(b) ? a : b;
}

export function bnMax(a, b) {
  return a.gt(b) ? a : b;
}

export function bnToBytes(n) {
  const b = n.toArray();
  b.reverse();
  while (b.length < 8) b.push(0);
  return Uint8Array.from(b);
}

export function formatDateTime(d) {
  if (typeof d === "number") d = d * 1000;
  d = new Date(d);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = (s) => (String(s).length === 1 ? "0" + s : s);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function bytesArrayToString(a) {
  return new TextDecoder("utf-8").decode(new Uint8Array(a)).trim();
}

export function bnFromBytes(buffer) {
  return new BN(
    [...buffer]
      .reverse()
      .map((i) => `00${i.toString(16)}`.slice(-2))
      .join(""),
    16
  );
}

export function bnToFloat(n, units = 9) {
  const s = n.toString();
  if (s.length < units)
    return parseFloat("." + "0".repeat(units - s.length) + s);
  const dot = s.length - units;
  return parseFloat(s.slice(0, dot) + "." + s.slice(dot));
}

export function parseBn(s, decimals = 9) {
  s = s.replace(/[^0-9\.]/g, "");
  let i = Math.max(0, Math.min(decimals, s.split("").reverse().indexOf(".")));
  return new BN(s.replace(/\./g, "") + "0".repeat(decimals - i));
}

export function formatNumber(n, decimals = 2, units = 9) {
  if (n && n.words) {
    n = bnToFloat(n, units);
  }
  n = n || 0;

  let suffix = "";
  if (n > 1000000000) {
    suffix = "B";
    n = n / 1000000000;
  } else if (n > 1000000) {
    suffix = "M";
    n = n / 1000000;
  }

  n = n.toFixed(decimals);
  if (n.endsWith((0).toFixed(decimals).slice(1))) {
    n = n.split(".")[0];
  }
  let start = n.indexOf(".");
  if (start === -1) start = n.length;
  for (let i = start - 3; i > 0; i -= 3) {
    n = n.slice(0, i) + "," + n.slice(i);
  }
  return n + suffix;
}

export function formatNumberPlain(n, decimals = 9) {
  const s = n.toString();
  return (
    (
      s.slice(0, s.length - decimals) +
      "." +
      s.slice(s.length - decimals)
    ).replace(/\.?0*$/g, "") || "0"
  );
}
