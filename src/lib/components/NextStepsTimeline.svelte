<!-- src/lib/components/NextStepsTimeline.svelte -->
<script>
    import { Timeline, TimelineItem } from "flowbite-svelte";
    import {
        CheckCircleSolid,
        ClockSolid,
        EnvelopeSolid,
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    let { paymentMethod = "cash" } = $props();
</script>

<Timeline
    order="horizontal"
    class="mb-6 flex max-w-none gap-10"
>
    <!-- Step 1: Request Submitted (Completed) -->
    <TimelineItem
        title={$_("nextSteps.step1.title")}
    >
        {#snippet orientationSlot()}
            <div class="flex items-center mb-4">
                <div
                    class="bg-green-500 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8"
                >
                    <CheckCircleSolid class="text-white h-5 w-5" />
                </div>
                <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
            </div>
        {/snippet}
        <p class="text-sm text-slate-700">
            {$_("nextSteps.step1.description")}
        </p>
    </TimelineItem>

    <!-- Step 2: Staff Review -->
    <TimelineItem
        title={$_("nextSteps.step2.title")}
    >
        {#snippet orientationSlot()}
            <div class="flex items-center mb-4">
                <div
                    class="bg-blue-500 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8"
                >
                    <ClockSolid class="text-white h-5 w-5" />
                </div>
                <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
            </div>
        {/snippet}
        <p class="text-sm text-slate-700">
            {$_("nextSteps.step2.description")}
        </p>
    </TimelineItem>

    <!-- Step 3: Confirmation & Payment -->
    <TimelineItem
        title={$_("nextSteps.step3.title")}
    >
        {#snippet orientationSlot()}
            <div class="flex items-center mb-4">
                <div
                    class="bg-gray-300 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8"
                >
                    <EnvelopeSolid class="text-white h-5 w-5" />
                </div>
            </div>
        {/snippet}
        <p class="text-sm text-slate-700">
            {#if paymentMethod === "credit"}
                {$_("nextSteps.step3.descriptionCredit")}
            {:else}
                {$_("nextSteps.step3.descriptionCash")}
            {/if}
        </p>
    </TimelineItem>
</Timeline>
