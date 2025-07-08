// src/lib/requests/sendReservationRequestEmail.js
export async function sendReservationRequestEmail(eventData, recipientEmail) {
  try {
    const response = await fetch('/api/send-request-email', {
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
      throw new Error(errorData.error || 'Failed to send reservation request email');
    }
    
    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId
    };
    
  } catch (error) {
    console.error('Error sending reservation request email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}