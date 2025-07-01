// src/lib/requests/sendContactEmail.js
export async function sendContactEmail(contactData, fetchFn = null) {
  try {
    // Use provided fetch function (for server-side) or global fetch (for client-side)
    const useFetch = fetchFn || fetch;
    
    const response = await useFetch('/api/send-contact-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contactData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send contact email');
    }
    
    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId
    };
    
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}