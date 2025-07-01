// src/routes/api/send-email/+server.js
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { childCareEmailTemplate } from '$lib/emails/childCare.js';
import { consultationEmailTemplate } from '$lib/emails/consult.js';

function constructEmailContent(eventData, serviceType) {
    // Determine service type from event summary if not provided
    if (!serviceType) {
        const { summary } = eventData;
        if (summary.includes('あとはねるだけ')) {
            serviceType = 'childcare';
        } else if (summary.includes('じょさんし') || summary.includes('メール相談') || summary.includes('相談')) {
            serviceType = 'consultation';
        } else {
            serviceType = 'consultation';
        }
    }

    return serviceType === 'childcare' 
        ? childCareEmailTemplate(eventData)
        : consultationEmailTemplate(eventData);
}

export async function POST({ request }) {
    try {
        const { eventData, recipientEmail, serviceType } = await request.json();
        
        const emailUser = import.meta.env.VITE_EMAIL_USER;
        const emailPass = import.meta.env.VITE_EMAIL_PASS;
        
        if (!emailUser || !emailPass) {
            return json({ error: 'Email configuration missing' }, { status: 500 });
        }

        const emailContent = constructEmailContent(eventData, serviceType);

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
            subject: 'March Waters - 予約確認',
            text: emailContent,
        });

        return json({ 
            success: true,
            message: 'Email sent successfully', 
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return json({ 
            success: false,
            error: 'Failed to send email',
            details: error.message 
        }, { status: 500 });
    }
}