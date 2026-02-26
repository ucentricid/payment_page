import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { query } from '@/lib/db';
import { sendReceiptEmail } from '@/lib/mail';
import * as Sentry from '@sentry/nextjs';

const isProduction = !process.env.MIDTRANS_SERVER_KEY?.startsWith('SB-');

const snap = new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
    try {
        const notification = await req.json();

        const statusResponse = await snap.transaction.notification(notification);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        let finalStatus = 'pending';

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                finalStatus = 'challenge';
            } else if (fraudStatus === 'accept') {
                finalStatus = 'success';
            }
        } else if (transactionStatus === 'settlement') {
            finalStatus = 'success';
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            finalStatus = 'failure';
        } else if (transactionStatus === 'pending') {
            finalStatus = 'pending';
        }

        // Update the database
        await query(
            'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
            [finalStatus, orderId]
        );

        // If payment is successful, generate and insert token into digital token table
        if (finalStatus === 'success') {
            const paymentResult = await query('SELECT name, email, phone, referral_code FROM payments WHERE order_id = $1', [orderId]);

            if (paymentResult.rows.length > 0) {
                const { name, email, phone, referral_code } = paymentResult.rows[0];

                const generateToken = () => {
                    const chars = '0123456789';
                    const chunk = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                    return `${chunk()}-${chunk()}-${chunk()}-${chunk()}`;
                };

                const tokenNumber = generateToken();
                const registerDate = new Date();

                await query(
                    `INSERT INTO ukasir_token (
                        order_id, name, email, phone, token_number, register_date, status_active, referral_code
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [orderId, name, email, phone, tokenNumber, registerDate, true, referral_code]
                );

                console.log(`Token generated for ${orderId}: ${tokenNumber} (Ref: ${referral_code})`);

                await sendReceiptEmail(email, name, orderId, tokenNumber);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: unknown) {
        Sentry.captureException(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
