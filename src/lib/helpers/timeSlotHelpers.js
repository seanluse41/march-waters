export function generateTimeSlots() {
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

export function processCalendarEvents(events, allTimeSlots) {
  const slots = {};
  
  events.forEach(event => {
    if (event.start) {
      if (event.start.date) {
        const dateString = event.start.date;
        
        if (!slots[dateString]) {
          slots[dateString] = [];
        }
        
        allTimeSlots.forEach(slot => {
          slots[dateString].push(slot.value);
        });
      }
      else if (event.start.dateTime) {
        const startDate = new Date(event.start.dateTime);
        const endDate = new Date(event.end.dateTime);
        
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const day = String(startDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;
        
        if (!slots[dateString]) {
          slots[dateString] = [];
        }
        
        const eventStartHour = startDate.getHours() + (startDate.getMinutes() / 60);
        const eventEndHour = endDate.getHours() + (endDate.getMinutes() / 60);
        
        allTimeSlots.forEach(slot => {
          const slotHour = parseInt(slot.value.split(':')[0]);
          
          if (eventStartHour <= slotHour && eventEndHour > slotHour) {
            slots[dateString].push(slot.value);
          }
        });
      }
    }
  });
  
  return slots;
}

export function isDateFullyBooked(date, busySlots, allTimeSlots) {
  if (!date) return false;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  if (busySlots[dateString]) {
    const allSlotsBooked = allTimeSlots.every(slot => 
      busySlots[dateString].includes(slot.value)
    );
    return allSlotsBooked;
  }
  
  return false;
}