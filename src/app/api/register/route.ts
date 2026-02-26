import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import prisma from '@/lib/prisma';
import { sendPaymentLinkEmail } from '@/lib/mail';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: Request) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim();
    const isProduction = !serverKey?.startsWith('SB-');

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
        const redirectUrl = transaction.redirect_url;

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

        await sendPaymentLinkEmail(email, name, orderId, redirectUrl, amount.toString());

        return NextResponse.json({ success: true, message: 'Registrasi berhasil. Link pembayaran telah dikirim ke email.' });
    } catch (error: unknown) {
        Sentry.captureException(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
