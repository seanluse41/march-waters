<script>
    import { Timeline, TimelineItem } from "flowbite-svelte";
    import {
        CalendarEditSolid,
        UserEditSolid,
        CreditCardSolid,
        BadgeCheckSolid,
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    let { currentStep = 1 } = $props();
</script>

<Timeline order="horizontal">
    <TimelineItem title={$_("timeline.step1.title")}>
        {#snippet orientationSlot()}
            <div class="flex items-center">
                {#if currentStep === 1}
                    <div
                        class="bg-blue-500 flex h-10 w-10 items-center justify-center rounded-full my-2"
                    >
                        <CalendarEditSolid class="text-white h-6 w-6" />
                    </div>
                {:else}
                    <div
                        class="bg-green-500 flex h-10 w-10 items-center justify-center rounded-full my-2"
                    >
                        <BadgeCheckSolid class="text-white h-6 w-6" />
                    </div>
                {/if}
            </div>
        {/snippet}
        <p class="text-slate-700">
            {$_("timeline.step1.description")}
        </p>
    </TimelineItem>
    <TimelineItem title={$_("timeline.step2.title")}>
        {#snippet orientationSlot()}
            <div class="flex items-center">
                {#if currentStep < 3}
                    <div
                        class="bg-blue-500 flex h-10 w-10 items-center justify-center rounded-full my-2"
                    >
                        <UserEditSolid class="text-white h-6 w-6" />
                    </div>
                {:else}
                    <div
                        class="bg-green-500 flex h-10 w-10 items-center justify-center rounded-full my-2"
                    >
                        <BadgeCheckSolid class="text-white h-6 w-6" />
                    </div>
                {/if}
            </div>
        {/snippet}
        <p class="text-slate-700">
            {$_("timeline.step2.description")}
        </p>
    </TimelineItem>
    <TimelineItem title={$_("timeline.step3.title")}>
        {#snippet orientationSlot()}
            <div class="flex items-center">
                <div
                    class="bg-blue-500 flex h-10 w-10 items-center justify-center rounded-full my-2"
                >
                    <CreditCardSolid class="text-white h-6 w-6" />
                </div>
            </div>
        {/snippet}
        <p class="text-slate-700">
            {$_("timeline.step3.description")}
        </p>
    </TimelineItem>
</Timeline>
