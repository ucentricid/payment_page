'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Step1() {
  const router = useRouter();
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
      alert('Mohon isi semua data');
      setLoading(false);
      return;
    }

    try {
      // Store form data in local storage or state for step 2
      // We'll pass it via search params for simplicity in this demo flow
      const params = new URLSearchParams(formData);
      router.push(`/payment?${params.toString()}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="badge">Registrasi Akun</div>
          <h1>Aktivasi Ukasir</h1>
          <p className="subtitle">Lengkapi data diri anda untuk melanjutkan pembayaran aktivasi aplikasi Ukasir.</p>
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
                {loading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>

        <div className="footer-info">
          © 2026 Ukasir. Pembayaran aman melalui Midtrans.
        </div>
      </div>
    </main>
  );
}
