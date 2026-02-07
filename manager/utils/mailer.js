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

const sendDeploymentSuccessEmail = async ({ to, subdomain, siteUrl }) => {
    if (!to) return { ok: false, error: 'Missing recipient' };

    const transporter = buildTransporter();
    if (!transporter) {
        return { ok: false, error: 'SMTP credentials not configured' };
    }

    const from = process.env.MAIL_FROM || 'knowabt.me <hello@knowabt.me>';
    const subject = `Your site is live: ${subdomain}.knowabt.me`;
    const text = `Hi!\n\nYour portfolio has been deployed successfully.\n\nURL: ${siteUrl}\n\nThanks,\nknowabt.me`;
    const html = `
        <p>Hi!</p>
        <p>Your portfolio has been deployed successfully.</p>
        <p><strong>URL:</strong> <a href="${siteUrl}">${siteUrl}</a></p>
        <p>Thanks,<br/>knowabt.me</p>
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

module.exports = {
    sendDeploymentSuccessEmail,
    sendDeleteRequestEmail
};
