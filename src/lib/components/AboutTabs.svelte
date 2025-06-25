<script>
    import { Tabs, TabItem } from "flowbite-svelte";
    import { UserCircleSolid, ClockSolid, StarSolid } from "flowbite-svelte-icons";
    import StaffIntroductionTab from "./StaffIntroductionTab.svelte";
    import CareerTimelineTab from "./CareerTimelineTab.svelte";
    import CustomerReviewsTab from "./CustomerReviewsTab.svelte";
    import { _ } from "svelte-i18n";
</script>

<Tabs tabStyle="full" class="flex divide-x divide-gray-200 rounded-lg shadow-sm rtl:divide-x-reverse dark:divide-gray-700">
    <TabItem class="w-full" open>
        {#snippet titleSlot()}
            <div class="flex items-center gap-2 justify-center">
                <UserCircleSolid size="sm" />
                <span class="text-sm">Staff</span>
            </div>
        {/snippet}
        <StaffIntroductionTab />
    </TabItem>
    
    <TabItem class="w-full">
        {#snippet titleSlot()}
            <div class="flex items-center gap-2 justify-center">
                <ClockSolid size="sm" />
                <span class="text-sm">Career</span>
            </div>
        {/snippet}
        <CareerTimelineTab />
    </TabItem>
    
    <TabItem class="w-full">
        {#snippet titleSlot()}
            <div class="flex items-center gap-2 justify-center">
                <StarSolid size="sm" />
                <span class="text-sm">Reviews</span>
            </div>
        {/snippet}
        <CustomerReviewsTab />
    </TabItem>
</Tabs>