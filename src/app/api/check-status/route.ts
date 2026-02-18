import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { query } from '@/lib/db';

const isProduction = !process.env.MIDTRANS_SERVER_KEY?.startsWith('SB-');

const snap = new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        // 1. Check status from Midtrans
        const midtransStatus = await snap.transaction.status(orderId);
        const transactionStatus = midtransStatus.transaction_status;
        const fraudStatus = midtransStatus.fraud_status;

        let finalStatus = 'pending';

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') finalStatus = 'success';
        } else if (transactionStatus === 'settlement') {
            finalStatus = 'success';
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            finalStatus = 'failure';
        }

        // 2. Update DB based on Midtrans status
        await query(
            'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
            [finalStatus, orderId]
        );

        // 3. If successful, check if token exists, if not generate it (Safety measure)
        if (finalStatus === 'success') {
            const tokenCheck = await query('SELECT token_number FROM ukasir_token WHERE order_id = $1', [orderId]);

            if (tokenCheck.rows.length === 0) {
                const paymentResult = await query('SELECT name, email, phone, referral_code FROM payments WHERE order_id = $1', [orderId]);
                if (paymentResult.rows.length > 0) {
                    const { name, email, phone, referral_code } = paymentResult.rows[0];
                    const generateToken = () => {
                        const chars = '0123456789';
                        const chunk = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                        return `${chunk()}-${chunk()}-${chunk()}-${chunk()}`;
                    };
                    const tokenNumber = generateToken();
                    await query(
                        `INSERT INTO ukasir_token (order_id, name, email, phone, token_number, register_date, status_active, referral_code)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [orderId, name, email, phone, tokenNumber, new Date(), true, referral_code]
                    );
                }
            }
        }

        // 4. Get latest data from DB
        const result = await query('SELECT status FROM payments WHERE order_id = $1', [orderId]);
        const tokenResult = await query('SELECT token_number FROM ukasir_token WHERE order_id = $1', [orderId]);

        return NextResponse.json({
            status: result.rows[0]?.status,
            token: tokenResult.rows[0]?.token_number,
            midtransStatus: transactionStatus
        });

    } catch (error: any) {
        console.error('Status Check Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
