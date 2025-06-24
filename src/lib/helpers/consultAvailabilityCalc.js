// src/lib/helpers/consultAvailabilityCalc.js

/**
 * Generate time slots for consultations (9:00 AM - 5:00 PM)
 */
export function generateConsultTimeSlots() {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    const startHour = hour.toString().padStart(2, "0");
    const endHour = (hour + 1).toString().padStart(2, "0");
    const displayTime = `${startHour}:00 ~ ${endHour}:00`;
    slots.push({
      value: `${startHour}:00`,
      name: displayTime,
    });
  }
  return slots;
}

/**
 * Process calendar events for consultation availability
 * Returns busy slots and fully booked dates
 */
export function processConsultAvailability(events) {
  const busySlots = {};
  const allTimeSlots = generateConsultTimeSlots();
  
  events.forEach(event => {
    if (!event.start) return;
    
    if (event.start.date) {
      // All-day event blocks all slots
      const dateString = event.start.date;
      
      if (!busySlots[dateString]) {
        busySlots[dateString] = [];
      }
      
      // Block all time slots for this date
      allTimeSlots.forEach(slot => {
        busySlots[dateString].push(slot.value);
      });
    } else if (event.start.dateTime) {
      // Timed event blocks specific slots
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);
      
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      
      if (!busySlots[dateString]) {
        busySlots[dateString] = [];
      }
      
      const eventStartHour = startDate.getHours() + (startDate.getMinutes() / 60);
      const eventEndHour = endDate.getHours() + (endDate.getMinutes() / 60);
      
      // Block overlapping time slots
      allTimeSlots.forEach(slot => {
        const slotHour = parseInt(slot.value.split(':')[0]);
        
        if (eventStartHour <= slotHour && eventEndHour > slotHour) {
          busySlots[dateString].push(slot.value);
        }
      });
    }
  });
  
  // Calculate fully booked dates
  const fullyBookedDates = [];
  Object.entries(busySlots).forEach(([date, slots]) => {
    if (slots.length === allTimeSlots.length) {
      fullyBookedDates.push(date);
    }
  });
  
  return {
    fullyBookedDates,
    busySlots,
    timeSlots: allTimeSlots
  };
}

/**
 * Get available time slots for a specific date
 */
export function getAvailableConsultSlots(date, busySlots, allTimeSlots) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  
  if (busySlots[dateString]) {
    return allTimeSlots.filter(slot => 
      !busySlots[dateString].includes(slot.value)
    );
  }
  
  return allTimeSlots;
}

/**
 * Check if a date is fully booked for consultations
 */
export function isConsultDateFullyBooked(date, busySlots, allTimeSlots) {
  if (!date) return false;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  
  if (busySlots[dateString]) {
    return busySlots[dateString].length === allTimeSlots.length;
  }
  
  return false;
}