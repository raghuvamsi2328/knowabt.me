const nodemailer = require('nodemailer');

const buildTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtppro.zoho.in';
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === 'true'
        : port === 465;
    const user = process.env.SMTP_USER || process.env.MAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass
        }
    });
};

const sendDeploymentSuccessEmail = async ({ to, subdomain, siteUrl, name }) => {
    if (!to) return { ok: false, error: 'Missing recipient' };

    const transporter = buildTransporter();
    if (!transporter) {
        return { ok: false, error: 'SMTP credentials not configured' };
    }

        const from = process.env.MAIL_FROM || 'knowabt.me <hello@knowabt.me>';
        const subject = `Your portfolio is live: ${subdomain}.knowabt.me`;
        const displayName = name || subdomain || 'there';
        const logoUrl = process.env.MAIL_LOGO_URL || '';
        const heroUrl = process.env.MAIL_HERO_URL || '';
        const buttonUrl = siteUrl;
        const text = `Hi ${displayName},\n\nThe wait is over. Your professional story now has a home at ${siteUrl}.\n\nThree things to do right now:\n1) Add it to your socials\n2) Check the mobile view\n3) Spread the word\n\nWant to make a tweak? You can jump back into your dashboard anytime to update your projects, bio, or layout.\n\nView My Portfolio: ${buttonUrl}\n\nCheers,\nThe knowabt.me Team`;

        const html = `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;padding:24px;">
                <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="padding:20px 24px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:12px;">
                        ${logoUrl ? `<img src="${logoUrl}" alt="knowabt.me" style="height:32px;" />` : ''}
                        <div style="font-size:18px;color:#566246;letter-spacing:-0.02em;">
                            <span style="font-weight:300;">knowabt</span><span style="font-weight:700;">.me</span>
                        </div>
                    </div>

                    <div style="padding:24px;">
                        <p style="font-size:16px;color:#111827;">Hi ${displayName},</p>
                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            The wait is over. Your professional story now has a home at
                            <a href="${siteUrl}" style="color:#2563eb;text-decoration:none;">${siteUrl}</a>.
                        </p>
                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            We’ve taken your work, your skills, and your vision and packaged them into a sleek, high-speed
                            portfolio that’s ready to share with the world. Whether you’re sending this to a recruiter, a
                            potential client, or just showing off to your peers, you’re officially leveled up.
                        </p>

                        <div style="margin:16px 0;height:2mm;background:#566246;border-radius:999px;"></div>

                        <h3 style="margin:20px 0 8px;color:#111827;">Three things to do right now:</h3>
                        <ol style="padding-left:20px;color:#111827;line-height:1.7;">
                            <li>Add it to your socials: Put your link in your Instagram, X, or LinkedIn bio.</li>
                            <li>Check the mobile view: Open your link on your phone to see how crisp it looks on the go.</li>
                            <li>Spread the word: Send the link to one person who needs to see your latest work.</li>
                        </ol>

                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            Want to make a tweak? Your portfolio is living and breathing. You can jump back into your dashboard
                            anytime to update your projects, swap out your bio, or change your layout.
                        </p>

                        <div style="margin:24px 0;">
                            <a href="${buttonUrl}" style="background:#566246;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">View My Portfolio</a>
                        </div>

                        <p style="font-size:16px;color:#111827;">We’re stoked to have you in the community. Now, go make some waves!</p>
                        <p style="font-size:16px;color:#111827;">Cheers,<br/>The knowabt.me Team</p>
                    </div>
                </div>
            </div>
        `;

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
        return { ok: true };
    } catch (error) {
        return { ok: false, error: error.message || 'Send failed' };
    }
};

const sendDeleteRequestEmail = async ({ requesterEmail, subdomain, siteUrl }) => {
    const transporter = buildTransporter();
    if (!transporter) {
        return { ok: false, error: 'SMTP credentials not configured' };
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        return { ok: false, error: 'Admin email not configured' };
    }

    const from = process.env.MAIL_FROM || 'knowabt.me <hello@knowabt.me>';
    const subject = `Delete request: ${subdomain}.knowabt.me`;
    const text = `Delete request received\n\nSite: ${siteUrl}\nRequested by: ${requesterEmail || 'unknown'}\n\nPlease review and delete if approved.`;
    const html = `
        <p><strong>Delete request received</strong></p>
        <p><strong>Site:</strong> <a href="${siteUrl}">${siteUrl}</a></p>
        <p><strong>Requested by:</strong> ${requesterEmail || 'unknown'}</p>
        <p>Please review and delete if approved.</p>
    `;

    try {
        await transporter.sendMail({
            from,
            to: adminEmail,
            subject,
            text,
            html
        });
        return { ok: true };
    } catch (error) {
        return { ok: false, error: error.message || 'Send failed' };
    }
};

const sendDeploymentFailedEmail = async ({ to, subdomain, siteUrl, name, reason }) => {
        if (!to) return { ok: false, error: 'Missing recipient' };

        const transporter = buildTransporter();
        if (!transporter) {
                return { ok: false, error: 'SMTP credentials not configured' };
        }

        const from = process.env.MAIL_FROM || 'knowabt.me <hello@knowabt.me>';
        const supportEmail = process.env.SUPPORT_EMAIL || 'support@knowabt.me';
        const displayName = name || subdomain || 'there';
        const subject = `Build failed: ${subdomain}.knowabt.me`;
        const text = `Hi ${displayName},\n\nWe ran into an issue while building your portfolio at ${siteUrl}.\n\nReason: ${reason || 'Build failed'}\n\nPlease reply or reach us at ${supportEmail} and we’ll help you fix it.\n\nCheers,\nThe knowabt.me Team`;
        const html = `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;padding:24px;">
                <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="padding:20px 24px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:12px;">
                        <div style="font-size:18px;color:#566246;letter-spacing:-0.02em;">
                            <span style="font-weight:300;">knowabt</span><span style="font-weight:700;">.me</span>
                        </div>
                    </div>
                    <div style="padding:24px;">
                        <p style="font-size:16px;color:#111827;">Hi ${displayName},</p>
                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            We ran into an issue while building your portfolio at
                            <a href="${siteUrl}" style="color:#2563eb;text-decoration:none;">${siteUrl}</a>.
                        </p>
                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            <strong>Reason:</strong> ${reason || 'Build failed'}
                        </p>
                        <div style="margin:16px 0;height:2mm;background:#566246;border-radius:999px;"></div>
                        <p style="font-size:16px;color:#111827;line-height:1.6;">
                            Please reply or contact us at <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">${supportEmail}</a> and we’ll help you fix it.
                        </p>
                        <p style="font-size:16px;color:#111827;">Cheers,<br/>The knowabt.me Team</p>
                    </div>
                </div>
            </div>
        `;

        try {
                await transporter.sendMail({
                        from,
                        to,
                        subject,
                        text,
                        html
                });
                return { ok: true };
        } catch (error) {
                return { ok: false, error: error.message || 'Send failed' };
        }
};

module.exports = {
    sendDeploymentSuccessEmail,
    sendDeleteRequestEmail,
    sendDeploymentFailedEmail
};
