// src/lib/helpers/consultAvailabilityCalc.js

/**
 * Generate 30-minute time slots for consultations (9:00 AM - 5:00 PM)
 */
export function generateConsult30MinSlots() {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startHour = hour.toString().padStart(2, "0");
      const startMin = minute.toString().padStart(2, "0");
      
      const endTime = new Date();
      endTime.setHours(hour, minute + 30, 0, 0);
      const endHour = endTime.getHours().toString().padStart(2, "0");
      const endMin = endTime.getMinutes().toString().padStart(2, "0");
      
      const displayTime = `${startHour}:${startMin} ~ ${endHour}:${endMin}`;
      slots.push({
        value: `${startHour}:${startMin}`,
        name: displayTime,
      });
    }
  }
  return slots;
}

/**
 * Generate 1-hour time slots for consultations (9:00 AM - 5:00 PM)
 */
export function generateConsult1HourSlots() {
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
 */
export function processConsultAvailability(events) {
  const busySlots = {};
  const timeSlots30Min = generateConsult30MinSlots();
  const timeSlots1Hour = generateConsult1HourSlots();
  
  events.forEach(event => {
    if (!event.start) return;
    
    if (event.start.date) {
      // All-day event blocks all slots
      const dateString = event.start.date;
      
      if (!busySlots[dateString]) {
        busySlots[dateString] = [];
      }
      
      // Block all 30-minute slots for this date
      timeSlots30Min.forEach(slot => {
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
      
      // Block overlapping 30-minute slots
      timeSlots30Min.forEach(slot => {
        const [slotHourStr, slotMinStr] = slot.value.split(':');
        const slotTime = parseInt(slotHourStr) + (parseInt(slotMinStr) / 60);
        const slotEndTime = slotTime + 0.5; // 30 minutes = 0.5 hours
        
        if (eventStartHour < slotEndTime && eventEndHour > slotTime) {
          busySlots[dateString].push(slot.value);
        }
      });
    }
  });
  
  // Calculate fully booked dates (when all 30-min slots are blocked)
  const fullyBookedDates = [];
  Object.entries(busySlots).forEach(([date, slots]) => {
    if (slots.length === timeSlots30Min.length) {
      fullyBookedDates.push(date);
    }
  });
  
  return {
    fullyBookedDates,
    busySlots,
    timeSlots30Min,
    timeSlots1Hour
  };
}

/**
 * Get available time slots for a specific date and consultation type
 */
export function getAvailableConsultSlots(date, busySlots, consultationType) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  
  const timeSlots30Min = generateConsult30MinSlots();
  const timeSlots1Hour = generateConsult1HourSlots();
  
  const busySlotsForDate = busySlots[dateString] || [];
  
  if (consultationType === "quick") {
    // 30-minute consultation - show 30-minute slots
    return timeSlots30Min.filter(slot => 
      !busySlotsForDate.includes(slot.value)
    );
  } else {
    // 1-hour consultation - show 1-hour slots, check if both 30-min slots are free
    return timeSlots1Hour.filter(slot => {
      const [hourStr] = slot.value.split(':');
      const slot1 = `${hourStr}:00`;
      const slot2 = `${hourStr}:30`;
      
      return !busySlotsForDate.includes(slot1) && !busySlotsForDate.includes(slot2);
    });
  }
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
    // Use 30-minute slots as the base for determining if fully booked
    const timeSlots30Min = generateConsult30MinSlots();
    return busySlots[dateString].length === timeSlots30Min.length;
  }
  
  return false;
}