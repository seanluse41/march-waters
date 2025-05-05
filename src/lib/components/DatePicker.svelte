<script>
    import { Datepicker, Select, P} from "flowbite-svelte";
    import { onMount } from "svelte";
    
    // Props for parent component to bind to
    let { selectedDate, selectedTimeSlot } = $props();
    
    // For internal datepicker state
    let disabledDates = $state([]);
    let availableTimeSlots = $state([]);
    
    // Mock data for available slots - replace with API data in production
    const mockAvailability = {
      // Keys are ISO date strings, values are arrays of available hour slots
      "2025-05-10": ["09:00", "10:00", "14:00", "15:00"],
      "2025-05-11": ["11:00", "13:00", "16:00"],
      "2025-05-12": ["09:00", "10:00", "11:00"],
      // Dates not in this object are fully available
    };
    
    // Days to disable completely (no slots available)
    const fullyBookedDays = ["2025-05-08", "2025-05-15", "2025-05-22"];
    
    // Generate time slots from 9am to 5pm
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
    
    // Default time slots (all available)
    const allTimeSlots = generateTimeSlots();
    
    onMount(() => {
      // Set the disabled dates
      disabledDates = fullyBookedDays.map(dateStr => new Date(dateStr));
    });
    
    // Handle date selection
    function handleDateSelect(detail) {
      console.log("Selected date:", detail);
      const date = new Date(detail);
      selectedDate = date;
      updateAvailableTimeSlots(date);
    }
    
    // Update available time slots based on selected date
    function updateAvailableTimeSlots(date) {
      // Reset time slot selection when date changes
      selectedTimeSlot = "";
      
      // Format date to YYYY-MM-DD for lookup, accounting for timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      console.log("Looking up availability for:", dateString);
      
      if (dateString in mockAvailability) {
        // Filter to only show available time slots for this date
        const availableHours = mockAvailability[dateString];
        availableTimeSlots = allTimeSlots.filter(slot => 
          availableHours.includes(slot.value)
        );
        console.log("Available slots:", availableTimeSlots);
      } else {
        // If no specific availability, all slots are available
        availableTimeSlots = allTimeSlots;
        console.log("All slots available");
      }
    }
    
    // Check if a date is in the fully booked days list
    function isDateFullyBooked(date) {
      if (!date) return false;
      
      // Format date to YYYY-MM-DD, accounting for timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      return fullyBookedDays.includes(dateString);
    }
  </script>
  
  <div class="space-y-4">
    <div>
      <Datepicker 
        inline 
        bind:value={selectedDate} 
        onselect={handleDateSelect}
      />
    </div>
    
    {#if selectedDate}
      <div>
        <p class="mb-2 font-medium">Selected date: {selectedDate.toLocaleDateString()}</p>
        
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