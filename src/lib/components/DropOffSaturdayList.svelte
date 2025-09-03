<script>
    import { onMount } from "svelte";
    import { Card, Radio, Spinner, P } from "flowbite-svelte";
    import { CalendarMonthSolid, UserGroupSolid } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    let {
        selectedDate = $bindable(null),
        dateSelected = $bindable(false)
    } = $props();

    let saturdayEvents = $state([]);
    let isLoading = $state(true);
    let loadError = $state(null);
    let selectedEventId = $state("");

    onMount(() => {
        fetchSaturdayEvents();
    });

    async function fetchSaturdayEvents() {
        try {
            const response = await fetch('/api/get-saturday-dropoff');
            
            if (!response.ok) {
                throw new Error('Failed to fetch Saturday events');
            }
            
            const data = await response.json();
            saturdayEvents = data.events || [];
            isLoading = false;
        } catch (error) {
            console.error('Error fetching Saturday events:', error);
            loadError = $_("datePicker.loadError");
            isLoading = false;
        }
    }

    function handleDateSelect(event) {
        selectedDate = new Date(event.start.dateTime);
        dateSelected = true;
        selectedEventId = event.id;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }

    function getAvailableSlots(description) {
        // Parse the description to get current capacity
        const match = description.match(/定員：(\d+)\/3/);
        if (match) {
            const taken = parseInt(match[1]);
            return 3 - taken;
        }
        return 3;
    }
</script>

<div class="space-y-4">
    {#if isLoading}
        <div class="flex flex-col items-center justify-center p-8">
            <Spinner class="mb-4" />
            <p class="text-gray-600">{$_("datePicker.loading")}</p>
        </div>
    {:else if loadError}
        <div class="text-center p-8">
            <p class="text-red-500 mb-4">{loadError}</p>
            <button 
                onclick={() => fetchSaturdayEvents()} 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {$_("datePicker.error")}
            </button>
        </div>
    {:else if saturdayEvents.length === 0}
        <div class="text-center p-8">
            <p class="text-gray-500">{$_("childcare.noSaturdaysAvailable")}</p>
        </div>
    {:else}
        <div class="grid gap-4 md:grid-cols-2">
            {#each saturdayEvents as event}
                {@const availableSlots = getAvailableSlots(event.description || '')}
                {@const isFullyBooked = availableSlots === 0}
                
                <Card 
                    class={`cursor-pointer transition-all ${
                        selectedEventId === event.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : isFullyBooked 
                                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                : 'hover:shadow-lg'
                    }`}
                    onclick={() => !isFullyBooked && handleDateSelect(event)}
                >
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <CalendarMonthSolid class="w-5 h-5 text-blue-500" />
                                <p class="font-semibold text-slate-700">
                                    {formatDate(event.start.dateTime)}
                                </p>
                            </div>
                            
                            <p class="text-sm text-gray-600 mb-2">
                                17:00 - 21:30
                            </p>
                            
                            <div class="flex items-center gap-2">
                                <UserGroupSolid class="w-4 h-4 text-gray-500" />
                                {#if isFullyBooked}
                                    <span class="text-sm text-red-600 font-medium">
                                        {$_("childcare.fullyBooked")}
                                    </span>
                                {:else}
                                    <span class="text-sm text-green-600">
                                        {$_("childcare.slotsAvailable", { values: { count: availableSlots } })}
                                    </span>
                                {/if}
                            </div>
                        </div>
                        
                        <Radio 
                            checked={selectedEventId === event.id}
                            disabled={isFullyBooked}
                            color="blue"
                            class="mt-1"
                        />
                    </div>
                </Card>
            {/each}
        </div>
        
        {#if selectedDate}
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <p class="text-blue-800">
                    <span class="font-medium">{$_("datePicker.selectedDate")}:</span> 
                    {formatDate(selectedDate.toISOString())}
                </p>
            </div>
        {/if}
    {/if}
</div>