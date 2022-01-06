import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import {
  useGlobalState,
  fetchMultisig,
  explorerLink,
  publicKey,
  connection,
  formatPublicKey,
  formatNumber,
} from "../../utils";
import { tokenProgramId } from "../../data";

export default function Balances() {
  const router = useRouter();
  const state = useGlobalState();
  const [balances, setBalances] = useState();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!router.query.key) return;
    (async () => {
      try {
        fetchMultisig(router.query.key);
        const balances = await connection.getParsedTokenAccountsByOwner(
          publicKey(router.query.key),
          { programId: tokenProgramId }
        );
        console.log(balances);
        setBalances(balances.value);
        const tokensRes = await fetch(
          "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
        ).then((r) => r.json());
        setTokens(tokensRes.tokens);
      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      }
    })();
  }, [router.query.key]);

  return (
    <Layout title="Transactions">
      <div className="box">
        <h1 className="title">Balances</h1>
        {balances ? (
          <>
            <table className="table">
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Mint</th>
                <th className="text-right">Balance</th>
              </tr>
              {balances.map((b) => {
                const mint = b.account.data.parsed.info.mint.toString();
                const token = tokens.find((t) => t.address === mint);
                return (
                  <tr key={b.pubkey.toString()}>
                    <td>
                      {token ? (
                        <img
                          src={token.logoURI}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "100%",
                            marginRight: 6,
                            position: "relative",
                            top: 1,
                            marginBottom: -4,
                          }}
                        />
                      ) : null}
                      {token ? token.name : "N/A"}
                    </td>
                    <td>{token ? token.symbol : "N/A"}</td>
                    <td>
                      <a href={explorerLink(mint)}>{formatPublicKey(mint)}</a>
                    </td>
                    <td className="text-right">
                      {formatNumber(
                        b.account.data.parsed.info.tokenAmount.uiAmount
                      )}
                    </td>
                  </tr>
                );
              })}
            </table>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </Layout>
  );
}
