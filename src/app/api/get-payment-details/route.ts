import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withBetterStack, BetterStackRequest } from '@logtail/next';

export const GET = withBetterStack(async (req: BetterStackRequest) => {
    const log = req.log.with({ route: 'get-payment-details' });
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        log.info('Fetching payment details', { orderId });

        const result = await query(
            'SELECT name, email, phone, amount, status FROM payments WHERE order_id = $1',
            [orderId]
        );

        if (result.rows.length === 0) {
            log.warn('Order not found', { orderId });
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        log.info('Payment details fetched', { orderId });
        return NextResponse.json(result.rows[0]);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        log.error('Failed to fetch payment details', { orderId, error: message });
        return NextResponse.json({ error: message }, { status: 500 });
    }
});
