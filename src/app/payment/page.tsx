'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw, Key } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [licenseToken, setLicenseToken] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const hasFetched = useRef(false);

    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const referralCode = searchParams.get('ref');

    useEffect(() => {
        if (!name || !email || !phone) {
            router.push('/');
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        const getToken = async () => {
            try {
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, referralCode }),
                });
                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                    setOrderId(data.orderId);
                } else {
                    setError(data.error || 'Gagal mendapatkan token pembayaran');
                }
            } catch (err: unknown) {
                console.error(err);
                setError('Terjadi kesalahan koneksi');
            } finally {
                setLoading(false);
            }
        };

        getToken();
    }, [name, email, phone, referralCode, router]);

    const checkStatus = async (silent = false) => {
        if (!orderId) return;
        if (!silent) setIsChecking(true);

        try {
            const response = await fetch(`/api/check-status?orderId=${orderId}`);
            const data = await response.json();

            if (data.status) {
                setPaymentStatus(data.status);
                if (data.token) {
                    setLicenseToken(data.token);
                }

                if (data.status === 'success') {
                    if (!silent) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Pembayaran Berhasil!',
                            text: 'Pembayaran berhasil, kembali ke halaman utama...',
                            confirmButtonColor: '#1D61E7',
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => {
                            router.push('/');
                        });
                    } else {
                        router.push('/');
                    }
                }
            }
        } catch (err) {
            console.error('Check status error:', err);
        } finally {
            if (!silent) setIsChecking(false);
        }
    };

    const handlePayment = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        if (token && win.snap) {
            win.snap.pay(token, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                onSuccess: function (_result: any) {
                    checkStatus();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                onPending: function (_result: any) {
                    MySwal.fire({
                        icon: 'info',
                        title: 'Menunggu Pembayaran',
                        text: 'Silakan selesaikan pembayaran Anda.',
                        confirmButtonColor: '#1D61E7'
                    });
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                onError: function (_result: any) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Pembayaran Gagal',
                        text: 'Terjadi kesalahan saat memproses pembayaran.',
                        confirmButtonColor: '#ef4444'
                    });
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
                    {paymentStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <CheckCircle2 color="#10b981" size={32} />
                            </div>
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Pembayaran Berhasil!</h2>
                            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Simpan token berikut untuk aktivasi aplikasi.</p>

                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <Key size={18} color="#1D61E7" />
                                <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '2px', color: 'var(--foreground)' }}>
                                    {licenseToken || 'SEDANG MEMPROSES...'}
                                </span>
                            </div>

                            {!licenseToken && (
                                <button
                                    onClick={() => checkStatus()}
                                    style={{ marginTop: '16px', fontSize: '12px', padding: '8px', background: 'transparent', border: '1px solid var(--glass-border)' }}
                                >
                                    <RefreshCw size={14} className={isChecking ? 'spin' : ''} />
                                    Ambil Token
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(29, 97, 231, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CreditCard color="#1D61E7" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700' }}>Aktivasi Mitra</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lisensi Aplikasi Selamanya</div>
                                </div>
                            </div>

                            <div className="divider" />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#94a3b8' }}>Harga</span>
                                <span style={{ fontWeight: '600' }}>Rp 1000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#94a3b8' }}>PPN (0%)</span>
                                <span style={{ fontWeight: '600' }}>Rp 0</span>
                            </div>

                            <div className="divider" />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600' }}>Total Bayar</span>
                                <div className="price-tag" style={{ margin: 0 }}>
                                    1000 <span>IDR</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px' }}>
                                <button onClick={handlePayment} disabled={loading || !!error}>
                                    {loading ? 'Menyiapkan...' : 'Bayar Sekarang'}
                                    {!loading && <ShieldCheck size={18} />}
                                </button>
                                {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>{error}</p>}

                                {orderId && (
                                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => checkStatus()}
                                            disabled={isChecking}
                                            style={{ background: 'transparent', color: '#94a3b8', fontSize: '13px', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
                                        >
                                            <RefreshCw size={14} style={{ marginRight: '8px' }} />
                                            Cek Status Pembayaran
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Akses penuh ke semua fitur
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Terhubung ke satu akun WhatsApp
                    </div>
                </div>

                <div className="footer-info">
                    © 2026 Mitra. Pembayaran terenkripsi.
                </div>
            </div>
            <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
