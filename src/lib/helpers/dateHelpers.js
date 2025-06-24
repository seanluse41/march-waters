export function updateAvailableTimeSlots(date, busySlots, allTimeSlots) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  if (busySlots[dateString]) {
    return allTimeSlots.filter((slot) =>
      !busySlots[dateString].includes(slot.value)
    );
  } else {
    return allTimeSlots;
  }
}

export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}