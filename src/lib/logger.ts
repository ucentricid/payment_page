import { Logger } from "@logtail/next";

/**
 * Returns a pre-configured Logger instance scoped to a specific area.
 * Call `await log.flush()` before returning from server components.
 *
 * Example:
 *   const log = getLogger("create-payment");
 *   log.info("Payment created", { orderId });
 */
export function getLogger(scope: string): Logger {
    return new Logger({ source: scope });
}
