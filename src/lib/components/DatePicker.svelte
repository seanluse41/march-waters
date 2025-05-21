<script>
  import { Datepicker, Select, P } from "flowbite-svelte";
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
  let datepickerEl = $state(null);

  const mockAvailability = {
    "2025-05-10": ["09:00", "10:00", "14:00", "15:00"],
    "2025-05-11": ["11:00", "13:00", "16:00"],
    "2025-05-12": ["09:00", "10:00", "11:00"],
  };

  const fullyBookedDays = ["2025-05-08", "2025-05-15", "2025-05-22"];

  // Set dateSelected based on initial selectedDate
  $effect(() => {
    if (selectedDate !== null) {
      dateSelected = true;
      styleSelectedDate(selectedDate);
    } else {
      clearDateStyling();
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

  function clearDateStyling() {
    if (!datepickerEl) return;

    // Find all date buttons
    const allButtons = datepickerEl.querySelectorAll('[role="gridcell"]');

    allButtons.forEach((btn) => {
      if (btn.querySelector(".date-circle")) {
        btn.textContent = btn.querySelector(".date-circle").textContent;
      }
    });
  }

  function styleSelectedDate(date) {
    if (!date || !datepickerEl) return;
    clearDateStyling();

    const dayLabel = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Find the selected date button
    const selectedButton = datepickerEl.querySelector(
      `[aria-label="${dayLabel}"]`,
    );
    if (selectedButton) {
      const dateNumber = selectedButton.textContent.trim();
      selectedButton.innerHTML = "";

      // Create a span for the date number with circle styling
      const span = document.createElement("span");
      span.textContent = dateNumber;
      span.className = "date-circle";
      span.style.display = "flex";
      span.style.alignItems = "center";
      span.style.justifyContent = "center";
      span.style.width = "28px";
      span.style.height = "28px";
      span.style.borderRadius = "50%";
      span.style.backgroundColor = "#3b82f6"; // Blue-500 color
      span.style.color = "white";

      selectedButton.appendChild(span);
    }
  }

  function updateAvailableTimeSlots(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (dateString in mockAvailability) {
      const availableHours = mockAvailability[dateString];
      availableTimeSlots = allTimeSlots.filter((slot) =>
        availableHours.includes(slot.value),
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

    return fullyBookedDays.includes(dateString);
  }

  // Initialize time slots if a date is already selected (when navigating back)
  onMount(() => {
    if (selectedDate) {
      if (isDateFullyBooked(selectedDate)) {
        availableTimeSlots = [];
      } else {
        updateAvailableTimeSlots(selectedDate);
      }
    }
  });
</script>

<div class="space-y-4 flex flex-col items-center">
  <div bind:this={datepickerEl}>
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
</div>
