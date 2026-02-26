import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://SDCxuyXe3AT8Bi2eqPkkfdFU@s1765061.eu-fsn-3.betterstackdata.com/1765061",

    // Capture 100% of transactions
    tracesSampleRate: 1.0,
});
