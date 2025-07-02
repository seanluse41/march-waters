export const handler = async (event, context) => {
  console.log('Webhook renewal function called:', event);
  
  // Check if this is a scheduled call OR manual trigger
  if (event.httpMethod !== 'POST' && !event.headers['netlify-cron']) {
    console.log('Not a valid trigger, method:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const calendar = await getCalendarClient();
    
    // First, try to stop any existing webhook to avoid conflicts
    try {
      // You'd need to store the previous channel ID somewhere to stop it
      console.log('Attempting to stop previous webhook...');
    } catch (stopError) {
      console.log('No previous webhook to stop or error stopping:', stopError.message);
    }

    const channelId = crypto.randomUUID();
    const expiration = Date.now() + (6 * 24 * 60 * 60 * 1000); // 6 days
    
    const watchRequest = {
      calendarId: CALENDAR_ID,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: WEBHOOK_URL,
        expiration: expiration.toString() // Google expects string
      }
    };

    console.log('Creating webhook with:', watchRequest);
    const response = await calendar.events.watch(watchRequest);
    
    console.log('Webhook created successfully:', {
      channelId: response.data.id,
      resourceId: response.data.resourceId,
      expiration: new Date(parseInt(response.data.expiration))
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        channelId: response.data.id,
        resourceId: response.data.resourceId,
        expiration: response.data.expiration,
        message: 'Webhook renewed successfully'
      })
    };
    
  } catch (error) {
    console.error('Webhook renewal failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};