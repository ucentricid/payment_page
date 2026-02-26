import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://SDCxuyXe3AT8Bi2eqPkkfdFU@s1765061.eu-fsn-3.betterstackdata.com/1765061",

    // Capture 100% of transactions in development; tune down for production as needed
    tracesSampleRate: 1.0,

    // Record a session replay for 10% of all sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
