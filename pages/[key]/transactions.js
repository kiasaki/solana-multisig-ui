import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as anchor from "@project-serum/anchor";
import Layout from "../../components/layout";
import {
  bn,
  useGlobalState,
  walletConnect,
  fetchMultisig,
  computePda,
  publicKey,
  formatDateTime,
  formatPublicKey,
  explorerLink,
  getAssociatedTokenAccountKey,
} from "../../utils";
import { tokenProgramId } from "../../data";

export default function Transactions() {
  const router = useRouter();
  const state = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState();
  const [transactions, setTransactions] = useState();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");

  async function fetchData() {
    try {
      const multisig = await fetchMultisig(router.query.key);
      const transactions = [];
      const lastTx = multisig.numTransactions.toNumber();
      for (let i = lastTx - 1; i >= 0 && i > lastTx - 10; i--) {
        const [key] = await computePda([
          "transaction",
          publicKey(router.query.key),
          i,
        ]);
        transactions.push({
          key: key,
          index: i,
          data: await state.program.account.transaction.fetch(key),
        });
      }
      setTransactions(transactions);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  useEffect(() => {
    if (!router.query.key || !state.program) return;
    fetchData();
  }, [router.query.key, state.program]);

  async function onApprove() {
    if (!state.connected) {
      walletConnect();
      return;
    }
    try {
      setLoading(true);
      await state.program.rpc.approve({
        accounts: {
          signer: state.publicKey,
          multisig: state.multisigKey,
          transaction: modal.transaction.key,
        },
      });
      setModal();
      fetchData();
    } catch (err) {
      console.error("approve", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onExecute() {
    if (!state.connected) {
      walletConnect();
      return;
    }
    try {
      setLoading(true);
      let remainingAccounts = [];
      for (let i of modal.transaction.data.instructions) {
        remainingAccounts = remainingAccounts.concat(
          i.keys
            .map((k) => Object.assign(k, { isSigner: false }))
            .concat([
              {
                pubkey: i.programId,
                isSigner: false,
                isWritable: false,
              },
            ])
        );
      }
      await state.program.rpc.executeTransaction({
        accounts: {
          signer: state.publicKey,
          multisig: state.multisigKey,
          transaction: modal.transaction.key,
        },
        remainingAccounts,
      });
      setModal();
      fetchData();
    } catch (err) {
      console.error("execute", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate() {
    if (!state.connected) {
      walletConnect();
      return;
    }
    try {
      setLoading(true);
      const [key, bump] = await computePda([
        "transaction",
        state.multisigKey,
        state.multisig.numTransactions.toNumber(),
      ]);
      const instructions = [];
      if (modal.step === "raw") {
        instructions.push({
          programId: publicKey(input1),
          keys: JSON.parse(input2).map((k) => {
            k.pubkey = publicKey(k.pubkey);
            return k;
          }),
          data: Buffer.from(JSON.parse(input3)),
        });
      }
      if (modal.step === "idl") {
      }
      if (modal.step === "token") {
        const mintKey = publicKey(input1);
        const targetKey = publicKey(input2);
        const amount = bn(input3, 0);
        const source = await getAssociatedTokenAccountKey(
          mintKey,
          state.multisigKey
        );
        const target = await getAssociatedTokenAccountKey(mintKey, targetKey);
        instructions.push({
          programId: tokenProgramId,
          keys: [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: target, isSigner: false, isWritable: true },
            { pubkey: state.multisigKey, isSigner: true, isWritable: false },
          ],
          data: Buffer.from([3, ...Array.from(bnToBytes(amount))]),
        });
      }
      if (modal.step === "upgrade") {
        instructions.push({
          programId: publicKey("BPFLoaderUpgradeab1e11111111111111111111111"),
          keys: [
            {
              pubkey: (
                await computePda(
                  [publicKey(input1)],
                  publicKey("BPFLoaderUpgradeab1e11111111111111111111111")
                )
              )[0],
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: publicKey(input1),
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: publicKey(input2),
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: state.publicKey,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: publicKey("SysvarRent111111111111111111111111111111111"),
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: publicKey("SysvarC1ock11111111111111111111111111111111"),
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: state.multisigKey,
              isSigner: true,
              isWritable: false,
            },
          ],
          data: Buffer.from([3, 0, 0, 0]),
        });
      }
      if (modal.step === "delay") {
        instructions.push(
          state.program.instruction.changeDelay(bn(parseInt(input1), 0), {
            accounts: { multisig: state.multisigKey },
          })
        );
      }
      if (modal.step === "threshold") {
        instructions.push(
          state.program.instruction.changeThreshold(bn(parseInt(input1), 0), {
            accounts: { multisig: state.multisigKey },
          })
        );
      }
      if (modal.step === "owners") {
        instructions.push(
          state.program.instruction.setOwners(
            input1.split(",").map((k) => publicKey(k.trim())),
            {
              accounts: { multisig: state.multisigKey },
            }
          )
        );
      }
      await state.program.rpc.createTransaction(instructions, bump, {
        accounts: {
          signer: state.publicKey,
          multisig: state.multisigKey,
          transaction: key,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });
      setInput1("");
      setInput2("");
      setInput3("");
      setModal();
      fetchData();
    } catch (err) {
      console.error("create", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderTransactionModalButton() {
    if (modal.transaction.data.executedAt.toNumber() > 0) {
      return "Executed";
    }
    const index = state.multisig.owners.findIndex(
      (o) => o.toString() === state.publicKey.toString()
    );
    if (
      modal.transaction.data.signers.filter((s) => s).length <
      state.multisig.threshold.toNumber()
    ) {
      if (index >= 0 && !modal.transaction.data.signers[index]) {
        return (
          <button className="button" onClick={onApprove} disabled={loading}>
            {loading ? "Loading..." : "Approve"}
          </button>
        );
      }
      return "Not enough signatures";
    }
    if (
      Date.now() / 1000 >
      modal.transaction.data.eta.toNumber() +
        state.multisig.gracePeriod.toNumber()
    ) {
      return "Past grace period";
    }
    if (index >= 0) {
      return (
        <button className="button" onClick={onExecute} disabled={loading}>
          {loading ? "Loading..." : "Execute"}
        </button>
      );
    }
    return null;
  }

  function renderTransaction(t, i) {
    const executedAt = t.data.executedAt.toNumber();
    return (
      <tr key={t.key.toString()}>
        <td>
          <strong>{t.index}</strong>
        </td>
        <td>{formatDateTime(executedAt || t.data.eta.toNumber())}</td>
        <td>
          {t.data.signers.filter((s) => s).length} / {t.data.signers.length}
        </td>
        <td className="text-right">
          <button
            className="button"
            onClick={() =>
              setModal({ type: "view", transaction: t, index: t.index })
            }
          >
            View
          </button>
        </td>
      </tr>
    );
  }

  return (
    <Layout title="Transactions">
      <div className="box">
        <h1 className="title flex">
          <div className="flex-1">Transactions</div>
          <button
            className="button"
            onClick={() => setModal({ type: "new", step: "type" })}
          >
            New Transaction
          </button>
        </h1>
        {transactions ? (
          <>
            <strong>Queue</strong>

            <table className="table mb-4">
              <tr>
                <th>#</th>
                <th>ETA</th>
                <th>Signatures</th>
                <th></th>
              </tr>
              {transactions
                .filter((t) => t.data.executedAt.toNumber() == 0)
                .map(renderTransaction)}
            </table>

            <strong>History</strong>

            <table className="table mb-4">
              <tr>
                <th>#</th>
                <th>Executed At</th>
                <th>Signatures</th>
                <th></th>
              </tr>
              {transactions
                .filter((t) => t.data.executedAt.toNumber() > 0)
                .map(renderTransaction)}
            </table>
          </>
        ) : (
          <div className="mb-4">Loading...</div>
        )}
        {state.multisig
          ? "Total transactions: " + state.multisig.numTransactions.toString()
          : null}
      </div>

      {modal && modal.type === "new" ? (
        <div className="modal-container" onClick={() => setModal()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h1 className="title">New Transaction</h1>
            {modal.step === "type" ? (
              <div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "raw" })}
                >
                  Raw Instruction
                </div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "idl" })}
                >
                  IDL Instruction
                </div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "token" })}
                >
                  Token Transfer
                </div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "upgrade" })}
                >
                  Program Upgrade
                </div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "delay" })}
                >
                  Multisig: Set Delay
                </div>
                <div
                  className="box pointer mb-2"
                  onClick={() => setModal({ type: "new", step: "threshold" })}
                >
                  Multisig: Set Threshold
                </div>
                <div
                  className="box pointer"
                  onClick={() => setModal({ type: "new", step: "owners" })}
                >
                  Multisig: Set Owners
                </div>
              </div>
            ) : null}
            {modal.step === "raw" ? (
              <div>
                <label className="label">Program Id</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <label className="label">
                  Keys (JSON array of Account Meta)
                </label>
                <div className="mb-2">
                  <textarea
                    rows={2}
                    className="input w-full"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                  />
                </div>
                <label className="label">Data (JSON array of bytes)</label>
                <div className="mb-2">
                  <textarea
                    rows={2}
                    className="input w-full"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
            {modal.step === "token" ? (
              <div>
                <label className="label">Token Mint</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <label className="label">To Address</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                  />
                </div>
                <label className="label">Amount</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
            {modal.step === "upgrade" ? (
              <div>
                <label className="label">Program Address</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <label className="label">Upgrade Buffer Address</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                  />
                </div>
                <p className="text-sm">
                  Make sure the upgrade authority on the buffer is the multisig
                  address: {state.multisigKey.toString()}
                </p>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
            {modal.step === "delay" ? (
              <div>
                <label className="label">New Delay (in seconds)</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
            {modal.step === "threshold" ? (
              <div>
                <label className="label">New Threshold</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
            {modal.step === "owners" ? (
              <div>
                <label className="label">New Owners (comma separated)</label>
                <div className="mb-2">
                  <input
                    className="input w-full"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    className="button"
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Transaction"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {modal && modal.type === "view" ? (
        <div className="modal-container" onClick={() => setModal()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h1 className="title flex items-center">
              <div className="flex-1">Transaction #{modal.index}</div>
              <div className="text-sm">{renderTransactionModalButton()}</div>
            </h1>

            <div className="mb-4">
              <table className="table">
                <tr>
                  <td><strong>Proposer</strong></td>
                  <td>
                    <a
                      href={explorerLink(modal.transaction.data.proposer)}
                      target="_blank"
                    >
                      {formatPublicKey(modal.transaction.data.proposer)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td><strong>ETA</strong></td>
                  <td>
                    {formatDateTime(modal.transaction.data.eta.toNumber())}
                  </td>
                </tr>
              </table>
            </div>

            <div className="mb-4">
              <strong>Signers</strong>
            </div>
            <table className="table mb-4">
              <tr>
                <th>Signer</th>
                {state.multisig.ownersSeqNo.toString() ===
                modal.transaction.data.ownersSeqNo.toString() ? (
                  <th>Address</th>
                ) : null}
                <th>State</th>
              </tr>
              {modal.transaction.data.signers.map((s, i) => (
                <tr key={i}>
                  <td>#{i + 1}</td>
                  {state.multisig.ownersSeqNo.toString() ===
                  modal.transaction.data.ownersSeqNo.toString() ? (
                    <td>{formatPublicKey(state.multisig.owners[i])}</td>
                  ) : null}
                  <td>{s ? "Approved" : "-"}</td>
                </tr>
              ))}
            </table>

            <div className="mb-4">
              <strong>Instructions</strong>
            </div>
            {modal.transaction.data.instructions.map((i, ii) => (
              <div
                className="box text-mono text-sm mb-2"
                style={{ border: "1px solid #333" }}
                key={ii}
              >
                <div>
                  Program ID:{" "}
                  <a href={explorerLink(i.programId)} target="_blank">
                    {i.programId.toString()}
                  </a>
                </div>
                <div>
                  Data:{" "}
                  {Array.from(i.data)
                    .map((b) => ("00" + b.toString(16)).slice(-2))
                    .join(" ")}
                </div>
                {i.keys.map((k, i) => (
                  <div key="i">
                    {`${("0" + (i + 1)).slice(-2)} ${k.isSigner ? "S" : "-"} ${
                      k.isWritable ? "W" : "-"
                    } `}
                    <a href={explorerLink(k.pubkey)} target="_blank">
                      {k.pubkey.toString()}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
