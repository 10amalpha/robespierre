import { Connection, PublicKey } from "@solana/web3.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC = process.env.HELIUS_RPC_URL;
if (!RPC) {
  throw new Error("HELIUS_RPC_URL env var is required (set in Vercel project settings)");
}
const BURN = "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG";
const MINT = "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky";
const COST = 10000;
const DECIMALS = 9;
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const AUDIT_DATE = new Date("2026-04-07T00:00:00Z");
const TIMER_DAYS = 10;

let cache = { data: null, ts: 0 };
const CACHE_TTL = 60_000;

async function parseSaveTxs(conn, signatures, debug) {
  const saves = [];
  const debugInfo = [];

  for (let i = 0; i < signatures.length; i += 10) {
    const batch = signatures.slice(i, i + 10);
    const txs = await Promise.all(
      batch.map(s => conn.getParsedTransaction(s.signature, { maxSupportedTransactionVersion: 0 }))
    );

    for (let j = 0; j < txs.length; j++) {
      const tx = txs[j];
      if (!tx) continue;

      const sig = batch[j].signature;
      const blockTime = batch[j].blockTime;

      const allIx = [
        ...tx.transaction.message.instructions,
        ...(tx.meta?.innerInstructions || []).flatMap(ii => ii.instructions),
      ];

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

      let memo = null;
      for (const ix of allIx) {
        const pid = ix.programId?.toString?.() || "";
        if (ix.program === "spl-memo" || pid === MEMO_PROGRAM) {
          memo = ix.parsed || null;
        }
      }

      if (debug) {
        debugInfo.push({ sig: sig.slice(0, 24), amount: transferAmount, memo, sender: senderWallet?.toString?.()?.slice(0, 8) });
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
          note: "No memo",
        });
      }
    }
  }

  return { saves, debugInfo };
}

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
    const auditTs = AUDIT_DATE.getTime() / 1000;

    // Derive the burn ATA
    const { getAssociatedTokenAddressSync } = await import("@solana/spl-token");
    const burnATA = getAssociatedTokenAddressSync(mintPk, burnPk);

    // Search BOTH the burn wallet AND the burn ATA for transactions
    // This catches txs even if the ATA was closed/burned
    const [walletSigs, ataSigs] = await Promise.all([
      conn.getSignaturesForAddress(burnPk, { limit: 100 }).catch(() => []),
      conn.getSignaturesForAddress(burnATA, { limit: 100 }).catch(() => []),
    ]);

    // Deduplicate by signature
    const sigMap = new Map();
    for (const s of [...walletSigs, ...ataSigs]) {
      if (s.blockTime && s.blockTime >= auditTs && !s.err) {
        sigMap.set(s.signature, s);
      }
    }
    const relevantSigs = [...sigMap.values()];

    const { saves, debugInfo } = await parseSaveTxs(conn, relevantSigs, debug);

    // Deduplicate saves by signature (in case same tx found via both paths)
    const uniqueSaves = [];
    const seenSigs = new Set();
    for (const s of saves) {
      if (!seenSigs.has(s.signature)) {
        seenSigs.add(s.signature);
        uniqueSaves.push(s);
      }
    }

    const result = {
      saves: uniqueSaves,
      checkedAt: new Date().toISOString(),
      txCount: relevantSigs.length,
      ...(debug ? { debug: debugInfo, burnATA: burnATA.toString(), walletSigs: walletSigs.length, ataSigs: ataSigs.length } : {}),
    };

    if (!debug) cache = { data: result, ts: now };
    return Response.json(result);
  } catch (err) {
    console.error("verify-saves error:", err);
    return Response.json({ error: "Failed to verify on-chain saves", detail: err.message }, { status: 500 });
  }
}
