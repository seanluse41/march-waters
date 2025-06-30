// src/lib/requests/sendEmail.js
export async function sendConfirmationEmail(eventData, recipientEmail) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventData,
        recipientEmail
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }
    
    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId
    };
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}