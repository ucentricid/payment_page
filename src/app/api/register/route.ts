import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { query } from '@/lib/db';
import { sendPaymentLinkEmail } from '@/lib/mail';

export async function POST(req: Request) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim();
    const isProduction = !serverKey?.startsWith('SB-');

    console.log('--- Register Flow - Midtrans Debug ---');
    console.log('Server Key exists:', !!serverKey);
    console.log('Client Key exists:', !!clientKey);
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
        const amount = 100; // IDR

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
        const redirectUrl = transaction.redirect_url; // payment URL

        // 2. Save to Database
        await query(
            `INSERT INTO payments (order_id, name, email, phone, amount, status, midtrans_token, referral_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [orderId, name, email, phone, amount, 'pending', snapToken, referralCode || null]
        );

        // 3. Send Email with Payment Link
        await sendPaymentLinkEmail(email, name, orderId, redirectUrl, amount.toString());

        return NextResponse.json({ success: true, message: 'Registrasi berhasil. Link pembayaran telah dikirim ke email.' });
    } catch (error: unknown) {
        console.error('Registration Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
