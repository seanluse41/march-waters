// src/lib/helpers/child-careAvailabilityCalc.js

/**
 * Process calendar events for child-care availability
 * Child-care is 5:00 PM - 9:30 PM (17:00-21:30)
 * If ANY event overlaps this time, the entire day is blocked
 */
export function processChildCareAvailability(events) {
  const fullyBookedDates = [];
  const busySlots = {};
  
  events.forEach(event => {
    if (!event.start) return;
    
    let eventDate;
    let isFullDay = false;
    let eventStart, eventEnd;
    
    if (event.start.date) {
      // All-day event
      eventDate = event.start.date;
      isFullDay = true;
    } else if (event.start.dateTime) {
      // Timed event
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);
      
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      eventDate = `${year}-${month}-${day}`;
      
      eventStart = startDate.getHours() + (startDate.getMinutes() / 60);
      eventEnd = endDate.getHours() + (endDate.getMinutes() / 60);
    }
    
    // Child-care hours: 5:00 PM (17:00) to 9:30 PM (21:30)
    const childCareStart = 17;
    const childCareEnd = 21.5;
    
    // Check if event overlaps with child-care hours
    if (isFullDay || (eventStart < childCareEnd && eventEnd > childCareStart)) {
      fullyBookedDates.push(eventDate);
      busySlots[eventDate] = ['blocked']; // Mark as fully blocked
    }
  });
  
  return {
    fullyBookedDates: [...new Set(fullyBookedDates)],
    busySlots,
    timeSlots: [] // No time slots for child-care
  };
}

/**
 * Check if a date is fully booked for child-care
 */
export function isChildCareDateFullyBooked(date, fullyBookedDates) {
  if (!date) return false;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  
  return fullyBookedDates.includes(dateString);
}