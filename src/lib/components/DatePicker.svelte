<script>
  import { Datepicker, Select, P, Spinner } from "flowbite-svelte";
  import { onMount, tick } from "svelte";
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
  let datepickerElement = $state();

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
      busySlots = processCalendarEvents(calendarEvents);
      
      await tick();
      setTimeout(() => {
        applyDisabledDates();
      }, 100);
      
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      loadError = $_("datePicker.loadError", { default: "Unable to load availability. Please refresh the page or try again later." });
    } finally {
      isLoadingCalendar = false;
    }
  }

  function processCalendarEvents(events) {
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

  function applyDisabledDates() {
    if (!datepickerElement) return;
    
    const dateButtons = datepickerElement.querySelectorAll('button[role="gridcell"]');
    
    dateButtons.forEach(button => {
      const ariaLabel = button.getAttribute('aria-label');
      if (!ariaLabel) return;
      
      const dateMatch = ariaLabel.match(/(\w+), (\w+) (\d+), (\d+)/);
      if (!dateMatch) return;
      
      const [, , monthName, day, year] = dateMatch;
      
      const monthMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      
      const month = monthMap[monthName];
      if (month === undefined) return;
      
      const date = new Date(parseInt(year), month, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date <= today) return;
      
      if (isDateFullyBooked(date)) {
        button.disabled = true;
        button.style.pointerEvents = 'none';
        button.style.cursor = 'not-allowed';
        
        button.classList.add('opacity-50', 'bg-red-50');
        button.classList.remove('hover:bg-gray-100', 'focus-within:text-primary-700');
        
        const existingX = button.querySelector('.booked-overlay');
        if (!existingX) {
          const overlay = document.createElement('div');
          overlay.className = 'booked-overlay absolute inset-0 flex items-center justify-center pointer-events-none';
          overlay.innerHTML = `
            <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          `;
          
          if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
          }
          
          button.appendChild(overlay);
        }
      } else {
        button.disabled = false;
        button.style.pointerEvents = '';
        button.style.cursor = '';
        
        button.classList.remove('opacity-50', 'bg-red-50');
        
        const existingX = button.querySelector('.booked-overlay');
        if (existingX) {
          existingX.remove();
        }
      }
    });
  }

  function handleDateSelect(detail) {
    const date = new Date(detail);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    if (isDateFullyBooked(date)) {
      dateError = $_("datePicker.noTimeSlots");
      dateSelected = false;
      selectedDate = null;
      return;
    }

    selectedDate = date;
    dateSelected = true;

    updateAvailableTimeSlots(date);
  }

  function updateAvailableTimeSlots(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (busySlots[dateString]) {
      availableTimeSlots = allTimeSlots.filter((slot) =>
        !busySlots[dateString].includes(slot.value)
      );
    } else {
      availableTimeSlots = allTimeSlots;
    }
  }

  function isDateFullyBooked(date) {
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

  $effect(() => {
    if (!isLoadingCalendar && Object.keys(busySlots).length > 0) {
      setTimeout(() => {
        applyDisabledDates();
      }, 50);
    }
  });

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
    <div bind:this={datepickerElement}>
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