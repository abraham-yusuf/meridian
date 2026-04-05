import { z } from "zod";

export const deploySchema = z.object({
  pool_address: z.string().min(32),
  amount_y: z.number().positive().optional(),
  amount_x: z.number().nonnegative().optional(),
  strategy: z.enum(["bid_ask", "spot", "curve"]).optional(),
  bins_below: z.number().int().min(1).max(300).optional(),
  bins_above: z.number().int().min(0).max(300).optional(),
});

export const closeSchema = z.object({
  position_address: z.string().min(32),
  reason: z.string().optional(),
  skip_swap: z.boolean().optional(),
});

export const claimSchema = z.object({
  position_address: z.string().min(32),
});

export const swapSchema = z.object({
  input_mint: z.string().min(3),
  output_mint: z.string().min(3),
  amount: z.number().positive(),
});

export const configUpdateSchema = z.object({
  changes: z.record(z.any()),
  reason: z.string().optional(),
});

export const blacklistAddSchema = z.object({
  mint: z.string().min(32),
  symbol: z.string().optional(),
  reason: z.string().optional(),
});

export const blacklistRemoveSchema = z.object({
  mint: z.string().min(32),
});
