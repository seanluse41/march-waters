<script>
  import { Datepicker, Select, P } from "flowbite-svelte";
  import { onMount } from "svelte";
  
  let { 
      selectedDate = $bindable(null), 
      selectedTimeSlot = $bindable("") 
  } = $props();
  
  let availableTimeSlots = $state([]);
  let dateSelected = $state(false);
  
  const mockAvailability = {
    "2025-05-10": ["09:00", "10:00", "14:00", "15:00"],
    "2025-05-11": ["11:00", "13:00", "16:00"],
    "2025-05-12": ["09:00", "10:00", "11:00"],
  };
  
  const fullyBookedDays = ["2025-05-08", "2025-05-15", "2025-05-22"];
  
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');
      const displayTime = `${startHour}:00 ~ ${endHour}:00`;
      slots.push({
        value: `${startHour}:00`,
        name: displayTime
      });
    }
    return slots;
  }
  
  const allTimeSlots = generateTimeSlots();
  
  function handleDateSelect(detail) {
    const date = new Date(detail);
    
    selectedTimeSlot = "";
    selectedDate = date;
    dateSelected = true;
    
    if (isDateFullyBooked(date)) {
      availableTimeSlots = [];
    } else {
      updateAvailableTimeSlots(date);
    }
  }
  
  function updateAvailableTimeSlots(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    if (dateString in mockAvailability) {
      const availableHours = mockAvailability[dateString];
      availableTimeSlots = allTimeSlots.filter(slot => 
        availableHours.includes(slot.value)
      );
    } else {
      availableTimeSlots = allTimeSlots;
    }
  }
  
  function isDateFullyBooked(date) {
    if (!date) return false;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return fullyBookedDays.includes(dateString);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
</script>

<div class="space-y-4">
<div>
  <Datepicker 
    inline 
    value={selectedDate} 
    onselect={handleDateSelect}
    minDate={today}
  />
</div>

{#if dateSelected}
  <div>
    <p class="mb-2 font-medium">Selected date: {selectedDate?.toLocaleDateString()}</p>
    
    {#if availableTimeSlots.length > 0}
      <div class="mt-4">
        <label for="time-slot" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select a time slot
        </label>
        <Select 
          id="time-slot"
          items={availableTimeSlots} 
          bind:value={selectedTimeSlot}
          placeholder="Choose an available time"
        />
      </div>
    {:else}
      <p class="text-red-500">No available time slots for this date</p>
    {/if}
  </div>
{/if}

{#if selectedDate && selectedTimeSlot}
  <div class="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
    <p class="font-medium">Appointment Summary</p>
    <p>Date: {selectedDate.toLocaleDateString()}</p>
    <p>Time: {selectedTimeSlot}</p>
  </div>
{/if}
</div>