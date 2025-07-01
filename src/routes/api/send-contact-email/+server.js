// src/routes/api/send-contact-email/+server.js
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { contactEmailTemplate } from '$lib/emails/contact.js';

export async function POST({ request }) {
    try {
        const { contactData } = await request.json();
        
        const emailUser = import.meta.env.VITE_EMAIL_USER;
        const emailPass = import.meta.env.VITE_EMAIL_PASS;
        
        if (!emailUser || !emailPass) {
            return json({ error: 'Email configuration missing' }, { status: 500 });
        }

        const emailContent = contactEmailTemplate(contactData);

        let transporter = nodemailer.createTransporter({
            host: 'smtp.porkbun.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        let info = await transporter.sendMail({
            from: emailUser, // admin@march-waters.com
            to: 'talk@march-waters.com',
            subject: 'ウェブサイト - 新しいお問い合わせ',
            text: emailContent,
        });

        return json({ 
            success: true,
            message: 'Contact email sent successfully', 
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending contact email:', error);
        return json({ 
            success: false,
            error: 'Failed to send contact email',
            details: error.message 
        }, { status: 500 });
    }
}