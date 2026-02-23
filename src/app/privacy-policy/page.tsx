import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <main className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
                <Link href="/" style={{ color: '#1D61E7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    &larr; Kembali ke Beranda
                </Link>
            </div>

            <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1e293b' }}>Kebijakan Privasi</h1>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Terakhir Diperbarui: 23 Februari 2026</p>

            <div className="card" style={{ padding: '32px', lineHeight: '1.6', color: '#334155' }}>
                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>1. Pendahuluan</h2>
                    <p>
                        Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi Data Pribadi Anda saat menggunakan aplikasi Mitra, sesuai dengan ketentuan yang diatur dalam Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) di Indonesia.
                    </p>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>2. Data Pribadi yang Kami Kumpulkan</h2>
                    <p>Saat Anda mendaftar dan menggunakan layanan kami, kami mengumpulkan data pribadi berikut:</p>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Identitas:</strong> Nama Lengkap.</li>
                        <li><strong>Kontak:</strong> Alamat Email aktif dan Nomor Telepon/WhatsApp.</li>
                        <li><strong>Data Transaksi:</strong> Token pembayaran dari pihak ketiga (Midtrans) dan riwayat pembayaran Anda di platform kami.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>3. Tujuan Penggunaan Data</h2>
                    <p>Kami menggunakan Data Pribadi Anda untuk tujuan berikut:</p>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                        <li>Memproses registrasi dan aktivasi akun Mitra Anda.</li>
                        <li>Mengirimkan tautan pembayaran, konfirmasi transaksi, dan struk melalui email.</li>
                        <li>Mengelola sistem referral dan pencatatan komisi jika Anda menggunakan atau memberikan kode referral.</li>
                        <li>Berkomunikasi dengan Anda terkait layanan atau dukungan teknis.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>4. Pembagian Data ke Pihak Ketiga</h2>
                    <p>
                        Kami sangat menjaga kerahasiaan data Anda. Kami tidak akan menjual atau menyewakan data Anda. Namun, kami membagikan data kelengkapan transaksi (Nama, Email, dan Telepon) secara terbatas kepada mitra pemroses pembayaran terpercaya kami, yaitu <strong>Midtrans</strong>, secara eksklusif untuk kebutuhan verifikasi dan fasilitasi pembayaran.
                    </p>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>5. Hak-Hak Anda (Berdasarkan UU PDP)</h2>
                    <p>Berkenaan dengan Data Pribadi yang Anda berikan kepada kami, Anda memiliki hak-hak berikut:</p>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Hak Akses:</strong> Meminta salinan data pribadi Anda yang kami simpan.</li>
                        <li><strong>Hak Perbaikan:</strong> Meminta perbaikan data yang tidak akurat atau memperbaruinya melalui halaman profil.</li>
                        <li><strong>Hak Penghapusan (Right to be Forgotten):</strong> Meminta penghapusan data Anda dari sistem kami, kecuali jika retensi data diwajibkan oleh hukum yang berlaku terkait transaksi keuangan.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>6. Penyimpanan dan Keamanan Data</h2>
                    <p>
                        Data Anda disimpan di server yang aman. Kami menerapkan langkah-langkah keamanan teknis (seperti enkripsi transmisi via HTTPS) dan operasional untuk melindungi data Anda dari akses, pengungkapan, atau penyalahgunaan yang tidak sah.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#0f172a' }}>7. Kontak</h2>
                    <p>
                        Jika Anda memiliki pertanyaan lebih lanjut, permintaan terkait data, atau ingin menarik persetujuan Anda, silakan hubungi kami melalui fasilitas dukungan di dalam aplikasi atau kontak resmi kami.
                    </p>
                </section>
            </div>
        </main>
    );
}
