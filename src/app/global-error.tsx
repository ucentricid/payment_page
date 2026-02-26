"use client";

import { useEffect } from "react";
import { useLogger } from "@logtail/next/hooks";
import { LogLevel } from "@logtail/next";
import { usePathname } from "next/navigation";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const pathname = usePathname();
    const log = useLogger({ source: "error-boundary" });

    useEffect(() => {
        const statusCode = error.message === "Invalid URL" ? 404 : 500;
        log.logHttpRequest(
            LogLevel.error,
            error.message,
            {
                host: window.location.href,
                path: pathname,
                statusCode,
            },
            {
                error: error.name,
                cause: String(error.cause ?? ""),
                stack: error.stack,
                digest: error.digest,
            }
        );
    }, [error, log, pathname]);

    return (
        <html>
            <body
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    fontFamily: "system-ui, sans-serif",
                    background: "#f9fafb",
                    color: "#111827",
                    gap: "1rem",
                }}
            >
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    Terjadi kesalahan
                </h1>
                <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                    {error.message}
                </p>
                <button
                    onClick={reset}
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 1.25rem",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                    }}
                >
                    Coba lagi
                </button>
            </body>
        </html>
    );
}
