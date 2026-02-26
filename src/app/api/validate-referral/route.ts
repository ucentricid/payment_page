import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as Sentry from '@sentry/nextjs';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        const result = await query(
            'SELECT id, name, email, referral_code FROM "User" WHERE referral_code = $1 LIMIT 1',
            [code]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ valid: false, message: 'Kode referral tidak ditemukan' }, { status: 404 });
        }

        const user = result.rows[0];

        return NextResponse.json({
            valid: true,
            referrer: {
                id: user.id,
                name: user.name,
                email: user.email,
                code: user.referral_code
            }
        });
    } catch (error: unknown) {
        Sentry.captureException(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
