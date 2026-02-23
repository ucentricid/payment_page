import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import prisma from '@/lib/prisma';

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
        await prisma.payments.create({
            data: {
                order_id: orderId,
                name,
                email,
                phone,
                amount,
                status: 'pending',
                midtrans_token: snapToken,
                referral_code: referralCode || null,
                privacy_policy_accepted_at: new Date(),
            }
        });

        return NextResponse.json({ token: snapToken, orderId });
    } catch (error: unknown) {
        console.error('Midtrans Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
