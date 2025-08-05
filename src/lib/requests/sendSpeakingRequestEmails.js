// src/lib/requests/sendSpeakingRequestEmails.js
export async function sendSpeakingRequestEmails(requestData) {
  try {
    const response = await fetch('/api/send-speaking-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requestData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send speaking request emails');
    }
    
    const data = await response.json();
    return {
      success: true,
      messageIds: data.messageIds
    };
    
  } catch (error) {
    console.error('Error sending speaking request emails:', error);
    return {
      success: false,
      error: error.message
    };
  }
}