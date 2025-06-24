export async function fetchCalendarEvents() {
  try {
    const response = await fetch('/api/get-calendar');
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    
    const data = await response.json();
    return {
      success: true,
      events: data.events || []
    };
    
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}