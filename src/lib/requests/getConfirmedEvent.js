export async function getConfirmedEvent() {
  try {
    const response = await fetch('/api/get-confirmed-event');
    
    if (!response.ok) {
      throw new Error('Failed to fetch confirmed event');
    }
    
    const data = await response.json();
    return {
      success: true,
      event: data.event,
      hasEvents: data.hasEvents
    };
    
  } catch (error) {
    console.error('Error fetching confirmed event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}