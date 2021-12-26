import { useState } from 'react';
import Link from 'next/link';
import Layout from "../components/layout";

export default function Index() {
  const [address, setAddress] = useState('');

  return (
    <Layout title="Open">
      <div className="flex box" style={{maxWidth: 400, margin: '10vh auto'}}>
        <div className="flex-1 mr-2">
          <input className="input w-full" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div>
          <Link href={`/${address}/transactions`}><a className="button">Open</a></Link>
        </div>
      </div>
    </Layout>
  );
}
