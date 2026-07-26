import { AsyncLocalStorage } from "async_hooks";

interface RequestContext {
  traceId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getTraceId(): string | undefined {
  return requestContext.getStore()?.traceId;
}
