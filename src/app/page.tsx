'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Step1Content() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

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
