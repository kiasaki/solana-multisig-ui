import Head from "next/head";
import Link from "next/link";
import { useGlobalState, formatPublicKey, walletConnect, walletDisconnect } from "../utils";

export default function Layout({ title, children }) {
  const state = useGlobalState();

  async function onConnect() {
    if (state.connected) {
      await walletDisconnect();
    } else {
      await walletConnect();
      window.localStorage.setItem("walletConnected", "true");
    }
  }

  return (
    <div className="container">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <title>Multisig - {title}</title>
      </Head>

      <div className="header">
        <h1>Multisig</h1>
        <div>
          <button className="button2" onClick={onConnect}>
            {state.connected
              ? formatPublicKey(state.publicKey)
              : "Connect Wallet"}
          </button>
        </div>
      </div>

      {state.multisig ? (
        <div className="navigation">
          <Link href={`/${state.multisigKey}/transactions${window.location.search||''}`}>Transactions</Link>
          <Link href={`/${state.multisigKey}/settings${window.location.search||''}`}>Settings</Link>
        </div>
      ) : null}

      {children}
    </div>
  );
}
