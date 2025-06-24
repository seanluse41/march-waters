<script>
  import { Datepicker, Select, P, Spinner } from "flowbite-svelte";
  import { onMount, tick, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import { fetchCalendarEvents } from "$lib/requests/fetchCalendarEvents.js";
  import { generateTimeSlots, processCalendarEvents, isDateFullyBooked } from "$lib/helpers/timeSlotHelpers.js";
  import { updateAvailableTimeSlots, isPastDate } from "$lib/helpers/dateHelpers.js";

  let {
    selectedDate = $bindable(null),
    selectedTimeSlot = $bindable(""),
    dateSelected = $bindable(false),
    showTimePicker = true,
    context = "general",
  } = $props();

  let availableTimeSlots = $state([]);
  let dateError = $state("");
  let calendarEvents = $state([]);
  let isLoadingCalendar = $state(true);
  let loadError = $state(null);
  let busySlots = $state({});
  let datepickerElement = $state();
  let currentMonth = $state(null);
  let monthObserver = null;

  const allTimeSlots = generateTimeSlots();

  $effect(() => {
    if (selectedDate !== null) {
      dateSelected = true;
    }
  });

  function onMonthChanged(newMonth) {
    console.log('Month changed to:', newMonth);
    // Re-apply disabled dates when month changes
    setTimeout(() => {
      applyDisabledDates();
    }, 100);
  }

  async function handleCalendarFetch() {
    isLoadingCalendar = true;
    loadError = null;
    
    const result = await fetchCalendarEvents();
    
    if (result.success) {
      calendarEvents = result.events;
      busySlots = processCalendarEvents(calendarEvents, allTimeSlots);
      
      await tick();
      setTimeout(() => {
        applyDisabledDates();
      }, 100);
    } else {
      loadError = $_("datePicker.loadError", { default: "Unable to load availability. Please refresh the page or try again later." });
    }
    
    isLoadingCalendar = false;
  }

  function resetDisabledDates(dateButtons) {
    dateButtons.forEach(button => {
      button.disabled = false;
      button.style.pointerEvents = '';
      button.style.cursor = '';
      
      button.classList.remove('opacity-50', 'bg-red-50');
      button.classList.add('hover:bg-gray-100', 'focus-within:text-primary-700');
      
      const existingX = button.querySelector('.booked-overlay');
      if (existingX) {
        existingX.remove();
      }
    });
  }

  function applyDisabledDates() {
    if (!datepickerElement) return;
    const dateButtons = datepickerElement.querySelectorAll('button[role="gridcell"]');
    
    resetDisabledDates(dateButtons);
    
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
      
      // Handle past dates (including today)
      if (isPastDate(date)) {
        button.disabled = true;
        button.style.pointerEvents = 'none';
        button.style.cursor = 'not-allowed';
        button.classList.add('opacity-50');
        button.classList.remove('hover:bg-gray-100', 'focus-within:text-primary-700');
        return;
      }
      
      if (isDateFullyBooked(date, busySlots, allTimeSlots)) {
        button.disabled = true;
        button.style.pointerEvents = 'none';
        button.style.cursor = 'not-allowed';
        
        button.classList.add('opacity-50', 'bg-red-50');
        button.classList.remove('hover:bg-gray-100', 'focus-within:text-primary-700');
        
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
    });
  }

  function handleDateSelect(detail) {
    const date = new Date(detail);

    if (selectedDate === null || date.getTime() !== selectedDate.getTime()) {
      selectedTimeSlot = "";
    }

    dateError = "";

    if (isPastDate(date)) {
      dateError = $_("datePicker.pastDateError");
      dateSelected = false;
      selectedDate = null;
      return;
    }

    if (isDateFullyBooked(date, busySlots, allTimeSlots)) {
      dateError = $_("datePicker.noTimeSlots");
      dateSelected = false;
      selectedDate = null;
      return;
    }

    selectedDate = date;
    dateSelected = true;

    availableTimeSlots = updateAvailableTimeSlots(date, busySlots, allTimeSlots);
  }

  onMount(() => {
    handleCalendarFetch();
    
    // Set up interval to check for month changes
    let checkInterval;
    let lastCheckedMonth = null;
    
    setTimeout(() => {
      checkInterval = setInterval(() => {
        if (datepickerElement) {
          // Find any date button to extract current month
          const dateButton = datepickerElement.querySelector('button[role="gridcell"][aria-label*="2025"]');
          
          if (dateButton) {
            const ariaLabel = dateButton.getAttribute('aria-label');
            const monthMatch = ariaLabel.match(/\w+, (\w+) \d+, (\d+)/);
            if (monthMatch) {
              const currentDisplayedMonth = `${monthMatch[1]} ${monthMatch[2]}`;
              if (lastCheckedMonth && lastCheckedMonth !== currentDisplayedMonth) {
                onMonthChanged(currentDisplayedMonth);
              }
              
              lastCheckedMonth = currentDisplayedMonth;
            }
          }
        }
      }, 500); // Check every 250ms
      
      // Initial application of disabled dates
      applyDisabledDates();
    }, 500);
    
    // Clean up interval on destroy
    onDestroy(() => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    });
  });

  onDestroy(() => {
    // Cleanup handled in onMount
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
        onclick={() => handleCalendarFetch()} 
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