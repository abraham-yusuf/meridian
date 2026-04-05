import fs from "fs";
import path from "path";
import { getWalletBalances, swapToken } from "../tools/wallet.js";
import { getMyPositions, getPositionPnl } from "../tools/dlmm.js";
import { getTopCandidates } from "../tools/screening.js";
import { config } from "../config.js";
import { executeTool } from "../tools/executor.js";
import { listLessons, getPerformanceSummary } from "../lessons.js";
import { getPoolMemory } from "../pool-memory.js";
import { listBlacklist, addToBlacklist, removeFromBlacklist } from "../token-blacklist.js";

export async function getDashboardData() {
  const [wallet, positions, perf] = await Promise.all([
    getWalletBalances(),
    getMyPositions({ force: true }),
    Promise.resolve(getPerformanceSummary()),
  ]);
  return { wallet, positions, performance: perf };
}

export async function getCandidates(limit = 10) {
  return getTopCandidates({ limit });
}

export async function getConfig() {
  return config;
}

export async function updateConfig(changes, reason = "web config update") {
  return executeTool("update_config", { changes, reason });
}

export async function deployAction(payload) {
  return executeTool("deploy_position", payload);
}

export async function closeAction(payload) {
  return executeTool("close_position", payload);
}

export async function claimAction(payload) {
  return executeTool("claim_fees", payload);
}

export async function swapAction(payload) {
  return executeTool("swap_token", payload);
}

export async function runManagementOnce() {
  const positions = await getMyPositions({ force: true });
  const actions = [];

  for (const p of positions.positions || []) {
    if ((p.unclaimed_fees_usd ?? 0) >= config.management.minClaimAmount) {
      actions.push({ type: "claim", position: p.position });
    }
    if (p.pnl_pct != null && p.pnl_pct <= config.management.stopLossPct) {
      actions.push({ type: "close", position: p.position, reason: "stop loss" });
    }
    if (!p.in_range && (p.minutes_out_of_range ?? 0) >= config.management.outOfRangeWaitMinutes) {
      actions.push({ type: "close", position: p.position, reason: "out of range" });
    }
  }

  const results = [];
  for (const a of actions) {
    if (a.type === "claim") results.push(await claimAction({ position_address: a.position }));
    if (a.type === "close") results.push(await closeAction({ position_address: a.position, reason: a.reason }));
  }

  return { evaluated: positions.total_positions || 0, actions: actions.length, results };
}

export async function runScreeningOnce() {
  const [positions, wallet, candidates] = await Promise.all([
    getMyPositions({ force: true }),
    getWalletBalances(),
    getTopCandidates({ limit: 10 }),
  ]);

  if ((positions.total_positions || 0) >= config.risk.maxPositions) {
    return { skipped: true, reason: "max positions reached" };
  }
  const minRequired = (config.management.deployAmountSol || 0) + (config.management.gasReserve || 0);
  if ((wallet.sol || 0) < minRequired) {
    return { skipped: true, reason: "insufficient sol" };
  }

  const best = (candidates.candidates || [])[0];
  if (!best) return { skipped: true, reason: "no candidates" };

  const volatility = Number(best.volatility || 0);
  const binsBelow = Math.max(35, Math.min(69, Math.round(35 + (volatility / 5) * 34)));

  const deployed = await deployAction({
    pool_address: best.pool,
    amount_y: config.management.deployAmountSol,
    strategy: "bid_ask",
    bins_below: binsBelow,
    bins_above: 0,
  });

  return { picked: best.pool, binsBelow, deployed };
}

export function getLessons(limit = 50) {
  return listLessons({ limit });
}

export function readLogs(limit = 200) {
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) return { logs: [] };
  const files = fs.readdirSync(logDir).filter((f) => f.endsWith(".log")).sort();
  const latest = files[files.length - 1];
  if (!latest) return { logs: [] };
  const lines = fs.readFileSync(path.join(logDir, latest), "utf8").split("\n").filter(Boolean);
  return { file: latest, logs: lines.slice(-limit) };
}

export function readPoolMemory(poolAddress) {
  return getPoolMemory({ pool_address: poolAddress });
}

export function getBlacklist() {
  return listBlacklist();
}

export function blacklistAdd(payload) {
  return addToBlacklist(payload);
}

export function blacklistRemove(payload) {
  return removeFromBlacklist(payload);
}

export async function getPositionPnlData(pool_address, position_address) {
  return getPositionPnl({ pool_address, position_address });
}

export async function manualSwap(input_mint, output_mint, amount) {
  return swapToken({ input_mint, output_mint, amount });
}
