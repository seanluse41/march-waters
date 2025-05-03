<script>
    import { Timeline, TimelineItem } from "flowbite-svelte";
    import {
        CalendarEditSolid,
        UserEditSolid,
        CreditCardSolid,
        BadgeCheckSolid
    } from "flowbite-svelte-icons";
</script>

<Timeline order="horizontal">
    <TimelineItem title="Pick a Date" date="Step 1">
        {#snippet orientationSlot()}
            <div class="flex items-center">
                <div
                    class="bg-primary-200 dark:bg-primary-900 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900"
                >
                    <CalendarEditSolid
                        class="text-primary-600 dark:text-primary-400 h-4 w-4"
                    />
                </div>
                <div
                    class="hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700"
                ></div>
            </div>
        {/snippet}
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">
            Select your preferred date and time for your appointment.
        </p>
    </TimelineItem>
    <TimelineItem title="Enter User Details" date="Step 2">
        {#snippet orientationSlot()}
            <div class="flex items-center">
                <div
                    class="bg-primary-200 dark:bg-primary-900 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900"
                >
                    <UserEditSolid
                        class="text-primary-600 dark:text-primary-400 h-4 w-4"
                    />
                </div>
                <div
                    class="hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700"
                ></div>
            </div>
        {/snippet}
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">
            Provide your personal information and contact details.
        </p>
    </TimelineItem>
    <TimelineItem title="Complete Payment" date="Step 3">
        {#snippet orientationSlot()}
            <div class="flex items-center">
                <div
                    class="bg-primary-200 dark:bg-primary-900 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900"
                >
                    <CreditCardSolid
                        class="text-primary-600 dark:text-primary-400 h-4 w-4"
                    />
                </div>
                <div
                    class="hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700"
                ></div>
            </div>
        {/snippet}
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">
            Process your payment securely to confirm your booking.
        </p>
    </TimelineItem>
</Timeline>
