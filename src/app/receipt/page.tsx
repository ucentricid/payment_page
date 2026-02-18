'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Copy, Download, Home, Mail, Phone, User, Zap, ShieldCheck, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ReceiptContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/check-status?orderId=${orderId}`);
                const result = await response.json();

                if (result.status === 'success') {
                    const detailRes = await fetch(`/api/get-payment-details?orderId=${orderId}`);
                    const details = await detailRes.json();

                    setData({
                        ...details,
                        token: result.token,
                        status: result.status
                    });
                } else {
                    router.push(`/payment?orderId=${orderId}`);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId, router]);

    const copyToken = () => {
        if (data?.token) {
            navigator.clipboard.writeText(data.token);
            MySwal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success',
                title: 'Token dikopi!',
            });
        }
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            gap: '24px'
        }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    border: '4px solid #e2e8f0',
                    borderRadius: '50%',
                    position: 'absolute'
                }}></div>
                <div style={{
                    width: '64px',
                    height: '64px',
                    border: '4px solid transparent',
                    borderTopColor: '#2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
            <div style={{ textAlign: 'center', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Memverifikasi Data</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>Menyiapkan struk pembayaran Anda...</p>
            </div>
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}</style>
        </div>
    );

    return (
        <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* SCREEN UI - Premium View */}
            <div className="container screen-only" style={{ paddingBottom: '60px' }}>

                <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeInDown 0.6s ease-out' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <CheckCircle2 color="#fff" size={40} />
                    </div>
                    <h1 style={{ fontSize: '28px', color: 'var(--foreground)' }}>
                        Pembayaran Berhasil!
                    </h1>
                    <p className="subtitle" style={{ fontSize: '15px' }}>Transaksi Anda telah terverifikasi oleh sistem.</p>
                </div>

                <div className="card" style={{
                    padding: '0',
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '20px',
                        background: '#f8fafc',
                        borderRadius: '10px'
                    }} />

                    <div style={{
                        padding: '32px 24px 24px',
                        background: 'rgba(29, 97, 231, 0.03)',
                        borderBottom: '1px dashed #e2e8f0',
                        textAlign: 'center'
                    }}>
                        <div className="badge" style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '14px', marginBottom: '8px' }}>E-RECEIPT</div>
                        <div style={{ fontWeight: '800', fontSize: '24px', margin: '4px 0', fontFamily: 'monospace', letterSpacing: '1px', color: 'var(--foreground)' }}>{orderId}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    <div style={{ padding: '32px 24px' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                                <Zap size={16} color="#fbbf24" fill="#fbbf24" />
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '2px' }}>Token Aktivasi</span>
                            </div>

                            <div style={{
                                background: '#f0f9ff',
                                borderRadius: '20px',
                                padding: '24px',
                                border: '2px solid #bae6fd',
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: '900',
                                    letterSpacing: '2px',
                                    color: '#0369a1',
                                    fontFamily: 'monospace'
                                }}>
                                    {data?.token}
                                </div>

                                <button
                                    onClick={copyToken}
                                    style={{
                                        marginTop: '16px',
                                        width: 'auto',
                                        padding: '8px 20px',
                                        fontSize: '13px',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        color: 'var(--foreground)',
                                        margin: '16px auto 0',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Copy size={14} style={{ marginRight: '8px' }} />
                                    Salin Token
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                            <div className="info-block">
                                <label>Nama Pembayar</label>
                                <div style={{ fontWeight: '700', color: 'var(--foreground)' }}>{data?.name || 'User'}</div>
                            </div>
                            <div className="info-block" style={{ textAlign: 'right' }}>
                                <label>Nomor WA</label>
                                <div style={{ fontWeight: '700', color: 'var(--foreground)' }}>{data?.phone || '-'}</div>
                            </div>
                            <div className="info-block">
                                <label>Email</label>
                                <div style={{ fontWeight: '700', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>{data?.email || '-'}</div>
                            </div>
                            <div className="info-block" style={{ textAlign: 'right' }}>
                                <label>Total Bayar</label>
                                <div style={{ fontWeight: '800', color: '#10b981' }}>Rp 1.000</div>
                            </div>
                        </div>

                        <div className="divider" style={{ borderStyle: 'dashed' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                            <button
                                onClick={() => window.print()}
                                style={{ background: 'var(--primary)', color: '#fff' }}
                            >
                                <Download size={18} />
                                Download Invoice
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: 'var(--foreground)', boxShadow: 'none' }}
                            >
                                <Home size={18} />
                                Kembali ke Beranda
                            </button>
                        </div>

                        <div style={{
                            marginTop: '40px',
                            padding: '16px',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <ShieldCheck size={20} color="#10b981" />
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                Pembayaran ini dilindungi dan dienkripsi oleh Midtrans Payment Gateway.
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Dukungan teknis Prioritas
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        Update fitur selamanya
                    </div>
                </div>

                <div className="footer-info" style={{ marginTop: '20px' }}>
                    © 2026 Mitra. Pembayaran terenkripsi.<br />
                    ID Transaksi: {orderId}
                </div>
            </div>

            {/* PRINT UI - Professional Receipt (Struk Pembayaran) Style */}
            <div className="print-only" style={{
                color: '#1e293b',
                backgroundColor: '#fff',
                width: '210mm',
                height: '297mm',
                padding: '15mm 25mm', // Reduced padding
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: "'Inter', sans-serif",
                display: 'none', // Hidden on screen by default
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Receipt Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Zap fill="#0f172a" color="#0f172a" size={20} />
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '1px' }}>MITRA</span>
                    </div>
                    <p style={{ margin: '0', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>PT MITRA INDONESIA JAYA</p>
                    <p style={{ margin: '1px 0', fontSize: '9px', color: '#64748b' }}>Office Tower, Jakarta Selatan, Indonesia</p>
                    <p style={{ margin: '1px 0', fontSize: '9px', color: '#64748b' }}>www.mitra.com | help@mitra.com</p>
                </div>

                <div style={{ width: '100%', borderBottom: '1px dashed #cbd5e1', marginBottom: '6px' }}></div>
                <div style={{ width: '100%', textAlign: 'center', padding: '8px 0' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '3px', margin: 0, textTransform: 'uppercase' }}>STRUK PEMBAYARAN</h2>
                </div>
                <div style={{ width: '100%', borderBottom: '1px dashed #cbd5e1', marginBottom: '20px' }}></div>

                {/* Transaction Main Info */}
                <div style={{ width: '100%', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>NOMOR INVOICE</span>
                        <span style={{ fontSize: '10px', fontWeight: '800', fontFamily: 'monospace' }}>{orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>TANGGAL</span>
                        <span style={{ fontSize: '10px', fontWeight: '700' }}>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>STATUS</span>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#059669' }}>LUNAS / PAID</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>METODE</span>
                        <span style={{ fontSize: '10px', fontWeight: '700' }}>QRIS (VERIFIED)</span>
                    </div>
                </div>

                <div style={{ width: '100%', borderBottom: '0.5px dashed #e2e8f0', marginBottom: '20px' }}></div>

                {/* Customer Details */}
                <div style={{ width: '100%', marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '8px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>DITAGIHKAN KEPADA</h3>
                    <div style={{ paddingLeft: '2px' }}>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: '800' }}>{data?.name || '-'}</p>
                        <p style={{ margin: '1px 0', fontSize: '10px', color: '#1e293b' }}>{data?.email || '-'}</p>
                        <p style={{ margin: '1px 0', fontSize: '10px', color: '#1e293b' }}>{data?.phone || '-'}</p>
                    </div>
                </div>

                {/* Items Section */}
                <div style={{ width: '100%', marginBottom: '25px' }}>
                    <div style={{ width: '100%', borderBottom: '1px solid #0f172a', paddingBottom: '6px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#0f172a' }}>DESKRIPSI PRODUK</span>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#0f172a', width: '80px', textAlign: 'right' }}>TOTAL</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0', fontSize: '11px', fontWeight: '800' }}>LISENSI MITRA PRO (LIFETIME)</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#64748b', lineHeight: '1.4' }}>Aktivasi akun permanen selamanya.</p>
                        </div>
                        <div style={{ width: '80px', textAlign: 'right' }}>
                            <p style={{ margin: '0', fontSize: '11px', fontWeight: '800' }}>Rp 1.000</p>
                        </div>
                    </div>
                </div>

                {/* Total Section with Receipt Look */}
                <div style={{ width: '100%', borderTop: '1px dashed #cbd5e1', paddingTop: '15px', marginBottom: '35px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>SUBTOTAL</span>
                        <span style={{ fontSize: '10px', fontWeight: '700' }}>Rp 1.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>PPN (0%)</span>
                        <span style={{ fontSize: '10px', fontWeight: '700' }}>Rp 0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '900' }}>TOTAL AKHIR</span>
                        <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace' }}>Rp 1.000</span>
                    </div>
                </div>

                {/* Secure Activation Token Box */}
                <div style={{
                    width: '100%',
                    padding: '20px',
                    border: '1.2px dashed #3b82f6',
                    borderRadius: '10px',
                    textAlign: 'center',
                    backgroundColor: '#f0f9ff',
                    marginBottom: '40px'
                }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>SERIAL TOKEN AKTIVASI</span>
                    <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '3px', color: '#1e293b', fontFamily: 'monospace' }}>
                        {data?.token}
                    </div>
                    <p style={{ margin: '10px 0 0 0', fontSize: '8px', color: '#64748b' }}>Simpan kode ini untuk mengaktifkan fitur pro di aplikasi MITRA.</p>
                </div>

                {/* Legal & Stamp - Lower Part */}
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '10px' }}>
                    <div style={{ maxWidth: '300px' }}>
                        <p style={{ fontSize: '8px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
                            * Struk ini adalah bukti pembayaran yang sah dan dihasilkan secara otomatis.<br />
                            * Simpan sebagai referensi dukungan teknis.<br />
                            * Syarat & ketentuan berlaku.
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{
                                border: '1.5px solid rgba(5, 150, 105, 0.4)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                transform: 'rotate(-5deg)',
                                color: 'rgba(5, 150, 105, 0.3)',
                                fontWeight: '900',
                                fontSize: '12px',
                                textTransform: 'uppercase'
                            }}>
                                SUCCESS
                            </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '800' }}>ADMINISTRATOR</p>
                        <p style={{ margin: 0, fontSize: '8px', color: '#94a3b8' }}>MITRA INDONESIA JAYA</p>
                    </div>
                </div>

                {/* Footer Center */}
                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <p style={{ fontSize: '8px', color: '#cbd5e1', letterSpacing: '1px' }}>TERIMA KASIH ATAS KEPERCAYAAN ANDA</p>
                </div>
            </div>

            <style jsx>{`
        .info-block label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        
        .print-only {
          display: none;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media print {
          .screen-only {
            display: none !important;
          }
          .print-only {
            display: flex !important;
          }
          body, main {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
        </main>
    );
}

export default function ReceiptPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReceiptContent />
        </Suspense>
    );
}
