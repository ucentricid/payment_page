import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { query } from '@/lib/db';

// Move initialization inside to ensure env vars are loaded

export async function POST(req: Request) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim();
    const isProduction = !serverKey?.startsWith('SB-');

    console.log('--- Midtrans Debug ---');
    console.log('Server Key exists:', !!serverKey);
    console.log('Client Key exists:', !!clientKey);
    console.log('Server Key Prefix:', serverKey?.substring(0, 11));
    console.log('Detected isProduction:', isProduction);

    const snap = new midtransClient.Snap({
        isProduction,
        serverKey: serverKey,
        clientKey: clientKey,
    });

    try {
        const { name, email, phone, referralCode } = await req.json();

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orderId = `MITRA-${Date.now()}`;
        const amount = 100;

        // 1. Create Midtrans Transaction
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                first_name: name,
                email: email,
                phone: phone,
            },
            item_details: [{
                id: 'mitra_activation',
                price: amount,
                quantity: 1,
                name: 'Aktivasi Mitra (Lifetime)',
            }],
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // 2. Save to Database
        await query(
            `INSERT INTO payments (order_id, name, email, phone, amount, status, midtrans_token, referral_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [orderId, name, email, phone, amount, 'pending', snapToken, referralCode || null]
        );

        return NextResponse.json({ token: snapToken, orderId });
    } catch (error: any) {
        console.error('Midtrans Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
