// src/routes/api/send-speaking-emails/+server.js
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { speakCustomerEmailTemplate } from '$lib/emails/speakCustomer.js';
import { speakStaffEmailTemplate } from '$lib/emails/speakStaff.js';

export async function POST({ request }) {
    try {
        const { requestData } = await request.json();
        
        const emailUser = import.meta.env.VITE_EMAIL_USER;
        const emailPass = import.meta.env.VITE_EMAIL_PASS;
        
        if (!emailUser || !emailPass) {
            return json({ error: 'Email configuration missing' }, { status: 500 });
        }

        let transporter = nodemailer.createTransport({
            host: 'smtp.porkbun.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        // Send customer confirmation email
        const customerEmailContent = speakCustomerEmailTemplate(requestData);
        const customerInfo = await transporter.sendMail({
            from: emailUser,
            to: requestData.email,
            subject: 'March Waters - 性教育講座開催のお問い合わせありがとうございます',
            text: customerEmailContent,
        });

        // Send staff notification email
        const staffEmailContent = speakStaffEmailTemplate(requestData);
        const staffInfo = await transporter.sendMail({
            from: emailUser,
            to: 'talk@march-waters.com',
            subject: '性教育講座開催のお問い合わせが届きました',
            text: staffEmailContent,
        });

        return json({ 
            success: true,
            message: 'Speaking request emails sent successfully', 
            messageIds: {
                customer: customerInfo.messageId,
                staff: staffInfo.messageId
            }
        });

    } catch (error) {
        console.error('Error sending speaking request emails:', error);
        return json({ 
            success: false,
            error: 'Failed to send speaking request emails',
            details: error.message 
        }, { status: 500 });
    }
}