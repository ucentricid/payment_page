import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { query } from '@/lib/db';

const snap = new midtransClient.Snap({
    isProduction: false, // Set to true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
    try {
        const { name, email, phone } = await req.json();

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orderId = `UKASIR-${Date.now()}`;
        const amount = 145000;

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
            item_details: [
                {
                    id: 'UKASIR-ACT',
                    price: amount,
                    quantity: 1,
                    name: 'Aktivasi Aplikasi Ukasir',
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // 2. Save to Database
        await query(
            `INSERT INTO payments (order_id, name, email, phone, amount, status, midtrans_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [orderId, name, email, phone, amount, 'pending', snapToken]
        );

        return NextResponse.json({ token: snapToken, orderId });
    } catch (error: any) {
        console.error('Midtrans Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
