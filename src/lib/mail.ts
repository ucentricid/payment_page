
import nodemailer from 'nodemailer';

export async function sendReceiptEmail(
    email: string,
    name: string,
    orderId: string,
    token: string,
    amount: string = '1.000',
    date: Date = new Date()
) {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.error('SMTP credentials are not set');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const mailOptions = {
        from: `"Mitra Payment" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Struk Pembayaran - ${orderId}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Struk Pembayaran</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-text-size-adjust: none; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 40px; margin-bottom: 40px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
                .content { padding: 40px 30px; }
                .token-box { background-color: #f0f9ff; border: 2px dashed #bae6fd; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
                .token-code { font-family: monospace; font-size: 24px; font-weight: 800; color: #0369a1; letter-spacing: 2px; margin: 10px 0; display: block; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #475569; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px; }
                .info-label { font-weight: 600; color: #64748b; }
                .info-value { font-weight: 700; color: #1e293b; text-align: right; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
                .btn { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">Pembayaran Berhasil!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Terima kasih, ${name}</p>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <p style="color: #64748b; margin: 0;">Order ID</p>
                        <h2 style="margin: 5px 0; color: #1e293b;">${orderId}</h2>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">${formattedDate}</p>
                    </div>

                    <div class="token-box">
                        <span style="font-size: 11px; font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 1px;">Serial Token Aktivasi</span>
                        <span class="token-code">${token}</span>
                        <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">Simpan kode ini untuk aktivasi aplikasi.</p>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Deskripsi</span>
                        <span class="info-value"> Ukasir</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Pembayaran</span>
                        <span class="info-value" style="color: #10b981;"> Rp ${amount}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status</span>
                        <span class="info-value"> LUNAS</span>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
                            Jika Anda mengalami kendala, silakan hubungi tim support kami.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    &copy; ${new Date().getFullYear()} Ucentric ID.<br>
                    Pembayaran ini dilindungi dan dienkripsi.
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} for order ${orderId}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendPaymentLinkEmail(
    email: string,
    name: string,
    orderId: string,
    paymentUrl: string,
    amount: string = '1.000',
    date: Date = new Date()
) {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.error('SMTP credentials are not set');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const mailOptions = {
        from: `"Mitra Payment" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Selesaikan Pembayaran Anda - ${orderId}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pembayaran Registrasi</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-text-size-adjust: none; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 40px; margin-bottom: 40px; }
                .header { background: linear-gradient(135deg, #1D61E7 0%, #2563EB 100%); padding: 40px 20px; text-align: center; color: white; }
                .content { padding: 40px 30px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #475569; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px; }
                .info-label { font-weight: 600; color: #64748b; }
                .info-value { font-weight: 700; color: #1e293b; text-align: right; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
                .btn { display: inline-block; background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 30px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4); }
                .btn:hover { background-color: #059669; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">Selesaikan Pembayaran Anda</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Halo, ${name}</p>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <p style="color: #64748b; margin: 0;">Order ID</p>
                        <h2 style="margin: 5px 0; color: #1e293b;">${orderId}</h2>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">${formattedDate}</p>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Deskripsi</span>
                        <span class="info-value">Aktivasi Mitra (Lifetime)</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Pembayaran</span>
                        <span class="info-value" style="color: #10b981;">Rp ${amount}</span>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <p style="font-size: 15px; color: #334155; margin-bottom: 5px;">
                            Silakan klik tombol di bawah ini untuk melakukan pembayaran:
                        </p>
                        <a href="${paymentUrl}" class="btn">Bayar Sekarang</a>
                    </div>
                    
                    <div style="text-align: center; margin-top: 40px;">
                        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
                            Tautan pembayaran ini mendukung berbagai metode pembayaran termasuk Bank Transfer, E-Wallet (GoPay, OVO, dll), dan Minimarket.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    &copy; ${new Date().getFullYear()} Mitra.<br>
                    Pembayaran ini dilindungi dan dienkripsi oleh Midtrans.
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment link email sent to ${email} for order ${orderId}`);
    } catch (error) {
        console.error('Error sending payment link email:', error);
    }
}
