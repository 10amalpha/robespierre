import { Connection, PublicKey } from "@solana/web3.js";

// Force dynamic — never cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC = "https://mainnet.helius-rpc.com/?api-key=d4d1c413-f308-4627-acf4-be837d854089";
const BURN = "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG";
const MINT = "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky";
const COST = 10000;
const DECIMALS = 9;
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const AUDIT_DATE = new Date("2026-04-07T00:00:00Z");
const TIMER_DAYS = 10;

let cache = { data: null, ts: 0 };
const CACHE_TTL = 60_000;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const debug = url.searchParams.get("debug") === "1";

    const now = Date.now();
    if (!debug && cache.data && now - cache.ts < CACHE_TTL) {
      return Response.json(cache.data);
    }

    const conn = new Connection(RPC, "confirmed");
    const burnPk = new PublicKey(BURN);
    const mintPk = new PublicKey(MINT);

    const tokenAccounts = await conn.getParsedTokenAccountsByOwner(burnPk, { mint: mintPk });

    if (!tokenAccounts.value.length) {
      const result = { saves: [], checkedAt: new Date().toISOString(), txCount: 0 };
      cache = { data: result, ts: now };
      return Response.json(result);
    }

    const tokenAccountPk = tokenAccounts.value[0].pubkey;
    const sigs = await conn.getSignaturesForAddress(tokenAccountPk, { limit: 100 });

    const auditTs = AUDIT_DATE.getTime() / 1000;
    const relevantSigs = sigs.filter(s => s.blockTime && s.blockTime >= auditTs && !s.err);

    const saves = [];
    const debugInfo = [];

    for (let i = 0; i < relevantSigs.length; i += 10) {
      const batch = relevantSigs.slice(i, i + 10);
      const txs = await Promise.all(
        batch.map(s => conn.getParsedTransaction(s.signature, { maxSupportedTransactionVersion: 0 }))
      );

      for (let j = 0; j < txs.length; j++) {
        const tx = txs[j];
        if (!tx) continue;

        const sig = batch[j].signature;
        const blockTime = batch[j].blockTime;

        // Gather ALL instructions (top-level + inner)
        const allIx = [
          ...tx.transaction.message.instructions,
          ...(tx.meta?.innerInstructions || []).flatMap(ii => ii.instructions),
        ];

        // Find SPL transfer
        let transferAmount = 0;
        let senderWallet = null;

        for (const ix of allIx) {
          if (ix.program === "spl-token" && ix.parsed) {
            const t = ix.parsed.type;
            const info = ix.parsed.info;
            let amt = 0;
            if (t === "transferChecked") {
              amt = parseFloat(info.tokenAmount?.uiAmount || 0);
            } else if (t === "transfer") {
              amt = parseInt(info.amount || 0) / Math.pow(10, DECIMALS);
            }
            if (amt > transferAmount) {
              transferAmount = amt;
              senderWallet = tx.transaction.message.accountKeys.find(k => k.signer)?.pubkey;
            }
          }
        }

        // Find memo
        let memo = null;
        for (const ix of allIx) {
          const pid = ix.programId?.toString?.() || "";
          if (ix.program === "spl-memo" || pid === MEMO_PROGRAM) {
            memo = ix.parsed || null;
          }
        }

        if (debug) {
          debugInfo.push({
            sig: sig.slice(0, 24),
            amount: transferAmount,
            memo,
            sender: senderWallet?.toString?.()?.slice(0, 8),
            ixPrograms: allIx.map(ix => ix.program || ix.programId?.toString?.()?.slice(0, 12) || "?"),
          });
        }

        if (transferAmount <= 0) continue;

        const deadline = new Date(AUDIT_DATE);
        deadline.setDate(deadline.getDate() + TIMER_DAYS);

        if (memo) {
          const memoStr = typeof memo === "string" ? memo : JSON.stringify(memo);
          const memberName = memoStr.startsWith("SAVE:") ? memoStr.slice(5).trim() : memoStr.trim();

          saves.push({
            member: memberName,
            savedBy: senderWallet?.toString() || "unknown",
            signature: sig,
            amount: transferAmount,
            timestamp: blockTime ? new Date(blockTime * 1000).toISOString() : null,
            savedUntil: deadline.toISOString(),
          });
        } else if (transferAmount >= COST) {
          saves.push({
            member: "unknown",
            savedBy: senderWallet?.toString() || "unknown",
            signature: sig,
            amount: transferAmount,
            timestamp: blockTime ? new Date(blockTime * 1000).toISOString() : null,
            savedUntil: deadline.toISOString(),
            note: "No memo — cannot match to member",
          });
        }
      }
    }

    const result = {
      saves,
      checkedAt: new Date().toISOString(),
      txCount: relevantSigs.length,
      ...(debug ? { debug: debugInfo } : {}),
    };

    if (!debug) cache = { data: result, ts: now };
    return Response.json(result);
  } catch (err) {
    console.error("verify-saves error:", err);
    return Response.json({ error: "Failed to verify on-chain saves", detail: err.message }, { status: 500 });
  }
}
