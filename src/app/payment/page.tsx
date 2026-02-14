'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    useEffect(() => {
        if (!name || !email || !phone) {
            router.push('/');
            return;
        }

        const getToken = async () => {
            try {
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone }),
                });
                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                } else {
                    setError(data.error || 'Gagal mendapatkan token pembayaran');
                }
            } catch (err) {
                setError('Terjadi kesalahan koneksi');
            } finally {
                setLoading(false);
            }
        };

        getToken();
    }, [name, email, phone, router]);

    const handlePayment = () => {
        if (token && (window as any).snap) {
            (window as any).snap.pay(token, {
                onSuccess: function (result: any) {
                    console.log('success', result);
                    alert('Pembayaran Berhasil!');
                    router.push('/');
                },
                onPending: function (result: any) {
                    console.log('pending', result);
                    alert('Menunggu Pembayaran...');
                },
                onError: function (result: any) {
                    console.log('error', result);
                    alert('Pembayaran Gagal!');
                },
                onClose: function () {
                    console.log('customer closed the popup without finishing the payment');
                },
            });
        }
    };

    return (
        <main>
            <div className="container">
                <button
                    onClick={() => router.back()}
                    style={{ width: 'fit-content', background: 'transparent', padding: '8px', boxShadow: 'none', color: '#94a3b8' }}
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div className="badge">Detail Pembayaran</div>
                    <h1>Ringkasan Pesanan</h1>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard color="#3b82f6" style={{ margin: 'auto' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: '600' }}>Aktivasi Ukasir</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Lisensi Aplikasi Selamanya</div>
                        </div>
                    </div>

                    <div className="divider" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8' }}>Harga</span>
                        <span style={{ fontWeight: '600' }}>Rp 145.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8' }}>PPN (0%)</span>
                        <span style={{ fontWeight: '600' }}>Rp 0</span>
                    </div>

                    <div className="divider" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600' }}>Total Bayar</span>
                        <div className="price-tag" style={{ margin: 0 }}>
                            145.000 <span>IDR</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <button onClick={handlePayment} disabled={loading || !!error}>
                            {loading ? 'Menyiapkan...' : 'Bayar Sekarang'}
                            {!loading && <ShieldCheck size={18} />}
                        </button>
                        {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Akses penuh ke semua fitur
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Update gratis selamanya
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Dukungan teknis prioritas
                    </div>
                </div>

                <div className="footer-info">
                    © 2026 Ukasir. Pembayaran terenkripsi.
                </div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
