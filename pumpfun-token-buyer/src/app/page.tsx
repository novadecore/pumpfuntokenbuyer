'use client';

import { useState } from 'react';

export default function PumpBuyPage() {
  const [mint, setMint] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [txSig, setTxSig] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTxSig('');
    try {
      const lamports = Math.floor(parseFloat(solAmount) * 1_000_000_000);
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mint, lamports, privateKey }),
      });
      const data = await res.json();
      if (data.txSig) {
        setTxSig(data.txSig);
      } else {
        alert('交易失败: ' + (data.error || '未知错误'));
      }
    } catch (err) {
      alert('请求失败: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Pump.fun 一键买币</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">代币地址（mint）</label>
          <input
            type="text"
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">购买金额（SOL）</label>
          <input
            type="number"
            step="0.0001"
            value={solAmount}
            onChange={(e) => setSolAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">钱包私钥（base58）</label>
          <input
            type="text"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? '交易中...' : '一键购买'}
        </button>
      </form>

      {txSig && (
        <p className="mt-4 text-green-700">交易成功，tx: <a
          href={`https://solscan.io/tx/${txSig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{txSig}</a></p>
      )}
    </main>
  );
}
