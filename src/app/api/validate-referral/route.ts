import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withBetterStack, BetterStackRequest } from '@logtail/next';

export const GET = withBetterStack(async (req: BetterStackRequest) => {
    const log = req.log.with({ route: 'validate-referral' });

    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        log.info('Validating referral code', { code });

        // Query User table to check if referral_code exists
        const result = await query(
            'SELECT id, name, email, referral_code FROM "User" WHERE referral_code = $1 LIMIT 1',
            [code]
        );

        if (result.rows.length === 0) {
            log.warn('Referral code not found', { code });
            return NextResponse.json({ valid: false, message: 'Kode referral tidak ditemukan' }, { status: 404 });
        }

        const user = result.rows[0];
        log.info('Referral code valid', { code, referrerId: user.id });

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
        const message = error instanceof Error ? error.message : 'Unknown error';
        log.error('Referral validation failed', { error: message });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
