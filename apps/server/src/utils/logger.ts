import { logger } from "../lib/logger.ts";
import { getTraceId } from "../context.ts";

export function log(message: string, meta: Record<string, unknown> = {}) {
  logger.info({ traceId: getTraceId(), ...meta }, message);
}

export function logWarn(message: string, meta: Record<string, unknown> = {}) {
  logger.warn({ traceId: getTraceId(), ...meta }, message);
}

export function logError(message: string, meta: Record<string, unknown> = {}) {
  logger.error({ traceId: getTraceId(), ...meta }, message);
}
