import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const result = await query(
            'SELECT name, email, phone, amount, status FROM payments WHERE order_id = $1',
            [orderId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('Fetch Details Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
