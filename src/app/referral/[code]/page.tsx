'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Referrer {
    id: string;
    name: string;
    email: string;
    code: string;
}

export default function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
    const router = useRouter();
    const [referralCode, setReferralCode] = useState<string>('');
    const [referrer, setReferrer] = useState<Referrer | null>(null);
    const [validating, setValidating] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [hasConsent, setHasConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    // Unwrap params and validate referral code
    useEffect(() => {
        params.then(async ({ code }) => {
            setReferralCode(code);

            try {
                // Validate referral code via API
                const response = await fetch(`/api/validate-referral?code=${encodeURIComponent(code)}`);
                const data = await response.json();

                if (data.valid && data.referrer) {
                    setReferrer(data.referrer);
                    setValidating(false);
                } else {
                    // Invalid code - redirect to homepage
                    MySwal.fire({
                        icon: 'error',
                        title: 'Kode Referral Tidak Valid',
                        text: data.message || 'Kode referral tidak ditemukan',
                        confirmButtonColor: '#1D61E7'
                    }).then(() => {
                        router.push('/');
                    });
                }
            } catch (error) {
                console.error('Validation error:', error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal memvalidasi kode referral',
                    confirmButtonColor: '#1D61E7'
                }).then(() => {
                    router.push('/');
                });
            }
        });
    }, [params, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Form validation
        if (!formData.name || !formData.email || !formData.phone) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mohon isi semua data!',
                confirmButtonColor: '#1D61E7'
            });
            setLoading(false);
            return;
        }

        if (!hasConsent) {
            MySwal.fire({
                icon: 'warning',
                title: 'Persetujuan Diperlukan',
                text: 'Anda harus menyetujui Kebijakan Privasi kami untuk melanjutkan pendaftaran.',
                confirmButtonColor: '#1D61E7'
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    referralCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan saat pendaftaran.');
            }

            MySwal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil!',
                text: 'Silakan cek email Anda (termasuk folder spam) untuk melanjutkan ke pembayaran.',
                confirmButtonColor: '#1D61E7'
            });

            setFormData({ name: '', email: '', phone: '' });
            setHasConsent(false);
            setLoading(false);
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan koneksi';
            MySwal.fire({
                icon: 'error',
                title: 'Gagal Pendaftaran',
                text: message,
                confirmButtonColor: '#1D61E7'
            });
            setLoading(false);
        }
    };

    // Show loading state while validating
    if (validating) {
        return (
            <main>
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="badge">Memvalidasi Kode Referral...</div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div className="badge">Registrasi Akun</div>
                    <h1>Aktivasi Mitra</h1>
                    <p className="subtitle">Lengkapi data diri anda untuk melanjutkan pembayaran aktivasi aplikasi Mitra.</p>

                    {referrer && (
                        <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Direferensikan oleh
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '6px' }}>
                                {referrer.name}
                            </div>
                            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                Kode: {referrer.code}
                            </div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nama Lengkap</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Masukkan nama anda"
                                    style={{ paddingLeft: '48px' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    style={{ paddingLeft: '48px' }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nomor WhatsApp</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="tel"
                                    placeholder="081234567890"
                                    style={{ paddingLeft: '48px' }}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="consent"
                                checked={hasConsent}
                                onChange={(e) => setHasConsent(e.target.checked)}
                                style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
                                required
                            />
                            <label htmlFor="consent" style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', cursor: 'pointer', fontWeight: 'normal', marginBottom: 0 }}>
                                Saya menyetujui Syarat & Ketentuan serta <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#1D61E7', textDecoration: 'underline' }}>Kebijakan Privasi</a> yang berlaku untuk pelindungan data saya.
                            </label>
                        </div>

                        <div style={{ marginTop: '32px' }}>
                            <button type="submit" disabled={loading || !hasConsent}>
                                {loading ? 'Memproses...' : 'Daftar Sekarang'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-info">
                    © 2026 Mitra. Pembayaran aman melalui Midtrans.<br />
                    <a href="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'underline', marginTop: '8px', display: 'inline-block' }}>Kebijakan Privasi (UU PDP)</a>
                </div>
            </div>
        </main>
    );
}
