// src/routes/api/send-request-email/+server.js
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { reservationRequestEmailTemplate } from '$lib/emails/reservationRequest.js';

export async function POST({ request }) {
    try {
        const { eventData, recipientEmail } = await request.json();
        
        const emailUser = import.meta.env.VITE_EMAIL_USER;
        const emailPass = import.meta.env.VITE_EMAIL_PASS;
        
        if (!emailUser || !emailPass) {
            return json({ error: 'Email configuration missing' }, { status: 500 });
        }

        const emailContent = reservationRequestEmailTemplate(eventData);

        let transporter = nodemailer.createTransport({
            host: 'smtp.porkbun.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        let info = await transporter.sendMail({
            from: emailUser,
            to: recipientEmail,
            subject: 'March Waters - 予約申請受付',
            text: emailContent,
        });

        return json({ 
            success: true,
            message: 'Reservation request email sent successfully', 
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending reservation request email:', error);
        return json({ 
            success: false,
            error: 'Failed to send reservation request email',
            details: error.message 
        }, { status: 500 });
    }
}