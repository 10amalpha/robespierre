import { Connection, PublicKey } from "@solana/web3.js";

const RPC = "https://mainnet.helius-rpc.com/?api-key=d4d1c413-f308-4627-acf4-be837d854089";
const BURN = "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG";
const MINT = "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky";
const COST = 10000;
const DECIMALS = 9; // SPL token decimals
const RAW_COST = COST * Math.pow(10, DECIMALS);
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const AUDIT_DATE = new Date("2026-04-07T00:00:00Z");
const TIMER_DAYS = 10;

// Cache saves in memory for 60s to avoid hammering RPC
let cache = { data: null, ts: 0 };
const CACHE_TTL = 60_000;

export async function GET() {
  try {
    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL) {
      return Response.json(cache.data);
    }

    const conn = new Connection(RPC, "confirmed");
    const burnPk = new PublicKey(BURN);
    const mintPk = new PublicKey(MINT);

    // Get all token accounts for the burn address
    const tokenAccounts = await conn.getParsedTokenAccountsByOwner(burnPk, {
      mint: mintPk,
    });

    if (!tokenAccounts.value.length) {
      const result = { saves: [], checkedAt: new Date().toISOString(), txCount: 0 };
      cache = { data: result, ts: now };
      return Response.json(result);
    }

    // Get signatures of transactions to the burn address token account
    const tokenAccountPk = tokenAccounts.value[0].pubkey;
    const sigs = await conn.getSignaturesForAddress(tokenAccountPk, {
      limit: 100,
    });

    // Only check txs after audit date
    const auditTs = AUDIT_DATE.getTime() / 1000;
    const relevantSigs = sigs.filter(
      (s) => s.blockTime && s.blockTime >= auditTs && !s.err
    );

    const saves = [];

    // Process in batches of 10 to avoid rate limits
    for (let i = 0; i < relevantSigs.length; i += 10) {
      const batch = relevantSigs.slice(i, i + 10);
      const txs = await Promise.all(
        batch.map((s) =>
          conn.getParsedTransaction(s.signature, {
            maxSupportedTransactionVersion: 0,
          })
        )
      );

      for (let j = 0; j < txs.length; j++) {
        const tx = txs[j];
        if (!tx) continue;

        const sig = batch[j].signature;
        const blockTime = batch[j].blockTime;

        // Find SPL transfer instruction with enough tokens
        let transferAmount = 0;
        let senderWallet = null;

        for (const ix of tx.transaction.message.instructions) {
          // Check parsed SPL token transfers
          if (
            ix.program === "spl-token" &&
            ix.parsed &&
            (ix.parsed.type === "transfer" || ix.parsed.type === "transferChecked")
          ) {
            const info = ix.parsed.info;
            const amt =
              ix.parsed.type === "transferChecked"
                ? parseFloat(info.tokenAmount?.uiAmount || 0)
                : parseInt(info.amount || 0) / Math.pow(10, DECIMALS);

            if (amt >= COST) {
              transferAmount = amt;
              // Get the signer (fee payer) as the wallet
              senderWallet = tx.transaction.message.accountKeys.find(
                (k) => k.signer
              )?.pubkey;
            }
          }
        }

        if (transferAmount < COST) continue;

        // Find memo instruction
        let memo = null;
        for (const ix of tx.transaction.message.instructions) {
          if (
            ix.program === "spl-memo" ||
            ix.programId?.toString() === MEMO_PROGRAM
          ) {
            memo = ix.parsed || null;
          }
        }

        // Also check inner instructions for memo
        if (!memo && tx.meta?.innerInstructions) {
          for (const inner of tx.meta.innerInstructions) {
            for (const ix of inner.instructions) {
              if (
                ix.program === "spl-memo" ||
                ix.programId?.toString() === MEMO_PROGRAM
              ) {
                memo = ix.parsed || null;
              }
            }
          }
        }

        if (memo) {
          // Memo format: "SAVE:MemberName" or just "MemberName"
          const memberName = memo.startsWith("SAVE:")
            ? memo.slice(5).trim()
            : memo.trim();

          const deadline = new Date(AUDIT_DATE);
          deadline.setDate(deadline.getDate() + TIMER_DAYS);

          saves.push({
            member: memberName,
            savedBy: senderWallet?.toString() || "unknown",
            signature: sig,
            amount: transferAmount,
            timestamp: blockTime
              ? new Date(blockTime * 1000).toISOString()
              : null,
            savedUntil: deadline.toISOString(),
          });
        }
      }
    }

    const result = {
      saves,
      checkedAt: new Date().toISOString(),
      txCount: relevantSigs.length,
    };

    cache = { data: result, ts: now };
    return Response.json(result);
  } catch (err) {
    console.error("verify-saves error:", err);
    return Response.json(
      { error: "Failed to verify on-chain saves", detail: err.message },
      { status: 500 }
    );
  }
}
