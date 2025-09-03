// src/routes/api/send-email/+server.js
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { childCareEmailTemplate } from '$lib/emails/childCare.js';
import { consultationEmailTemplate } from '$lib/emails/consult.js';
import { dropoffEmailTemplate } from '$lib/emails/dropoff.js';

function getServiceType(summary) {
  if (summary.includes('訪問型')) {
    return 'babysitter';
  } else if (summary.includes('お預かり')) {
    return 'dropoff';
  } else {
    return 'consultation';
  }
}

function constructEmailContent(eventData, serviceType, eventId) {
  const finalServiceType = serviceType || getServiceType(eventData.summary);
  
  switch (finalServiceType) {
    case 'babysitter':
      return childCareEmailTemplate(eventData, eventId);
    case 'dropoff':
      return dropoffEmailTemplate(eventData, eventId);
    default:
      return consultationEmailTemplate(eventData, eventId);
  }
}

export async function POST({ request }) {
  try {
    const { eventData, recipientEmail, serviceType, eventId } = await request.json();
    
    const emailUser = import.meta.env.VITE_EMAIL_USER;
    const emailPass = import.meta.env.VITE_EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      return json({ error: 'Email configuration missing' }, { status: 500 });
    }

    const emailContent = constructEmailContent(eventData, serviceType, eventId);

    const transporter = nodemailer.createTransport({
      host: 'smtp.porkbun.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const info = await transporter.sendMail({
      from: emailUser,
      to: recipientEmail,
      subject: 'March Waters - 予約確定',
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