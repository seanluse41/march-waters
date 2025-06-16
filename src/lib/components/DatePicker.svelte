<script>
  import { Datepicker, Select, P, Spinner } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  let {
    selectedDate = $bindable(null),
    selectedTimeSlot = $bindable(""),
    dateSelected = $bindable(false),
    showTimePicker = true,
  } = $props();

  let availableTimeSlots = $state([]);
  let dateError = $state("");
  let calendarEvents = $state([]);
  let isLoadingCalendar = $state(true);
  let loadError = $state(null);
  let busySlots = $state({});

  // Set dateSelected based on initial selectedDate
  $effect(() => {
    if (selectedDate !== null) {
      dateSelected = true;
    }
  });

  function generateTimeSlots() {
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

  const allTimeSlots = generateTimeSlots();

  async function fetchCalendarEvents() {
    try {
      isLoadingCalendar = true;
      loadError = null;
      
      // Calculate date range: today to 30 days from now
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const response = await fetch(`/api/get-calendar?timeMin=${today.toISOString()}&timeMax=${thirtyDaysFromNow.toISOString()}&maxResults=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      calendarEvents = data.events || [];
      
      // Process events immediately after fetching
      busySlots = processCalendarEvents(calendarEvents);
      
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      loadError = $_("datePicker.loadError", { default: "Unable to load availability. Please refresh the page or try again later." });
    } finally {
      isLoadingCalendar = false;
    }
  }

  // Process calendar events to extract busy times
  function processCalendarEvents(events) {
    const slots = {};
    
    events.forEach(event => {
      if (event.start && event.start.dateTime) {
        const startDate = new Date(event.start.dateTime);
        const endDate = new Date(event.end.dateTime);
        
        // Get the date string in YYYY-MM-DD format
        const dateString = startDate.toISOString().split('T')[0];
        
        // Initialize array for this date if it doesn't exist
        if (!slots[dateString]) {
          slots[dateString] = [];
        }
        
        // Add all hours that this event covers
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlot = hour.toString().padStart(2, "0") + ":00";
          if (!slots[dateString].includes(timeSlot)) {
            slots[dateString].push(timeSlot);
          }
        }
      }
    });
    
    return slots;
  }

  function handleDateSelect(detail) {
    const date = new Date(detail);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only reset time slot if selecting a different date
    if (selectedDate === null || date.getTime() !== selectedDate.getTime()) {
      selectedTimeSlot = "";
    }

    dateError = "";

    if (date <= today) {
      dateError = $_("datePicker.pastDateError");
      dateSelected = false;
      selectedDate = null;
      return;
    }

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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (busySlots[dateString]) {
      // Filter out busy slots
      availableTimeSlots = allTimeSlots.filter((slot) =>
        !busySlots[dateString].includes(slot.value)
      );
    } else {
      // No events on this day, all slots available
      availableTimeSlots = allTimeSlots;
    }
  }

  function isDateFullyBooked(date) {
    if (!date) return false;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    // Check if all slots (9am-5pm) are busy
    if (busySlots[dateString]) {
      const allSlotsBooked = allTimeSlots.every(slot => 
        busySlots[dateString].includes(slot.value)
      );
      return allSlotsBooked;
    }
    return false;
  }

  // Initialize by fetching calendar data
  onMount(() => {
    fetchCalendarEvents();
  });
</script>

<div class="space-y-4 flex flex-col items-center">
  {#if isLoadingCalendar}
    <div class="flex flex-col items-center justify-center p-8">
      <Spinner class="mb-4" />
      <p class="text-gray-600">{$_("datePicker.loading")}</p>
    </div>
  {:else if loadError}
    <div class="text-center p-8">
      <p class="text-red-500 mb-4">{loadError}</p>
      <button 
        onclick={() => fetchCalendarEvents()} 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {$_("datePicker.error")}
      </button>
    </div>
  {:else}
    <div>
      <Datepicker
        inline
        value={selectedDate}
        onselect={handleDateSelect}
        color="blue"
      />
    </div>
    {#if dateError}
      <p class="text-red-500 mt-2">{dateError}</p>
    {/if}
    {#if showTimePicker}
      {#if dateSelected}
        <div>
          <p class="mb-2 font-medium">
            {$_("datePicker.selectedDate")}: {selectedDate?.toLocaleDateString()}
          </p>

          {#if availableTimeSlots.length > 0}
            <div class="mt-4 flex flex-col">
              <label
                for="time-slot"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {$_("datePicker.selectTimeSlot")}
              </label>
              <Select
                size="lg"
                class="pr-16 w-full flex"
                id="time-slot"
                items={availableTimeSlots}
                bind:value={selectedTimeSlot}
                placeholder={$_("datePicker.chooseTimeSlot")}
              />
            </div>
          {:else}
            <p class="text-red-500">{$_("datePicker.noTimeSlots")}</p>
          {/if}
        </div>
      {/if}
    {/if}
  {/if}
</div>