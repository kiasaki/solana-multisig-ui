import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import {
  useGlobalState,
  walletConnect,
  fetchMultisig,
  explorerLink,
} from "../../utils";

export default function Staking() {
  const router = useRouter();
  const state = useGlobalState();

  useEffect(() => {
    if (!router.query.key) return;
    (async () => {
      try {
        await fetchMultisig(router.query.key);
      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      }
    })();
  }, [router.query.key]);

  async function onSubmit() {
    if (!state.connected) {
      walletConnect();
      return;
    }

    try {
      setLoading(true);

      await state.program.rpc.stakingWithdraw(parsedAmount, {
        accounts: {
          signer: state.publicKey,
          multisig: multisigKey,
        },
      });

      setAmount("");
      await fetchMultisig(state.multisigKey);
    } catch (err) {
      console.error("submit", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Transactions">
      <div className="box">
        <h1 className="title">Settings</h1>
        {state.multisig ? (
          <>
            <div className="mb-2">
              <strong>Multisig Address</strong>
            </div>
            <div className="mb-4 text-mono">
              {state.multisigKey.toString()}{" "}
              <a href={explorerLink(state.multisigKey)} target="_blank">
                🔗
              </a>
            </div>
            <div className="mb-2">
              <strong>Threshold</strong>
            </div>
            <div className="mb-4">
              {state.multisig.threshold.toString()} /{" "}
              {state.multisig.owners.length}
            </div>
            <div className="mb-2">
              <strong>Delay</strong>
            </div>
            <div className="mb-4">
              {state.multisig.delay.toString()} seconds
            </div>
            <div className="mb-2">
              <strong>Owners</strong>
            </div>
            {state.multisig.owners.map((o) => (
              <div className="text-mono" key={o.toString()}>
                {o.toString()}{" "}
                <a href={explorerLink(o)} target="_blank">
                  🔗
                </a>
              </div>
            ))}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </Layout>
  );
}
