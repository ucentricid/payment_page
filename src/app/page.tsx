'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Step1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // If redirect query params are present, show status UI instead of form
  if (orderId && transactionStatus) {
    const isSuccess = transactionStatus === 'settlement' || transactionStatus === 'capture';
    const isPending = transactionStatus === 'pending';
    const isFailed = transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire';

    return (
      <main>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="badge">Status Pembayaran</div>
            <h1>{isSuccess ? 'Pembayaran Berhasil' : isPending ? 'Menunggu Pembayaran' : isFailed ? 'Pembayaran Gagal' : 'Status Tidak Diketahui'}</h1>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            {isSuccess && (
              <>
                <CheckCircle2 color="#10b981" size={80} style={{ margin: '0 auto 20px auto' }} />
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Terima Kasih!</h2>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  Pembayaran Anda untuk Order <strong>{orderId}</strong> telah berhasil kami terima. Silakan cek email Anda untuk informasi lebih lanjut.
                </p>
              </>
            )}

            {isPending && (
              <>
                <Clock color="#f59e0b" size={80} style={{ margin: '0 auto 20px auto' }} />
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Menunggu Pembayaran</h2>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  Pesanan <strong>{orderId}</strong> sedang menunggu pembayaran. Silakan selesaikan instruksi pembayaran yang dikirim ke email Anda.
                </p>
              </>
            )}

            {isFailed && (
              <>
                <XCircle color="#ef4444" size={80} style={{ margin: '0 auto 20px auto' }} />
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Pembayaran Gagal</h2>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  Mohon maaf, pembayaran untuk Order <strong>{orderId}</strong> tidak dapat diproses atau telah kedaluwarsa.
                </p>
              </>
            )}

            {(!isSuccess && !isPending && !isFailed) && (
              <p style={{ color: '#64748b', marginBottom: '20px' }}>
                Status transaksi: {transactionStatus} (Order ID: {orderId})
              </p>
            )}

            <button
              onClick={() => router.push('/')}
              style={{ marginTop: '20px', maxWidth: '300px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </main>
    );
  }

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

  return (
    <main>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="badge">Registrasi Akun</div>
          <h1>Aktivasi Mitra</h1>
          <p className="subtitle">Lengkapi data diri anda untuk melanjutkan pembayaran aktivasi aplikasi Mitra.</p>
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

            <div style={{ marginTop: '32px' }}>
              <button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>

        <div className="footer-info">
          © 2026 Mitra. Pembayaran aman melalui Midtrans.
        </div>
      </div>
    </main>
  );
}

export default function Step1() {
  return (
    <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '100px 0' }}><div className="badge">Memuat...</div></div>}>
      <Step1Content />
    </Suspense>
  );
}
