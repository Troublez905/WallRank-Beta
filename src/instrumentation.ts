import type { Instrumentation } from "next";

export function register() {
  console.info(
    JSON.stringify({
      level: "info",
      event: "monitoring_ready",
      service: "wallrank",
      runtime: process.env.NEXT_RUNTIME ?? "unknown",
    }),
  );
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const message = error instanceof Error ? error.message : String(error);
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  console.error(
    JSON.stringify({
      level: "error",
      event: "unhandled_request_error",
      service: "wallrank",
      message,
      digest,
      method: request.method,
      path: request.path,
      route: context.routePath,
      routeType: context.routeType,
      timestamp: new Date().toISOString(),
    }),
  );
};
