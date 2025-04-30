<script>
  import { _ } from "svelte-i18n";
  import { Timeline, TimelineItem, Button } from "flowbite-svelte";
  import {
    UserAddSolid,
    CalendarEditOutline,
    HeartSolid,
    CheckCircleSolid,
    ArrowRightOutline
  } from "flowbite-svelte-icons";
</script>

<h1 class="text-3xl text-slate-700 mb-8">{$_("top.actions.title")}</h1>
<Timeline order="horizontal" class="gap-8">
  <TimelineItem>
    <h1 class="text-3xl text-slate-700 mt-4">{$_("top.actions.1.heading")}</h1>
    {#snippet orientationSlot()}
      <div class="flex items-center">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500"
        >
          <UserAddSolid class="text-white h-6 w-6" />
        </div>
        <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
      </div>
    {/snippet}
    <p class="text-base font-normal text-slate-700 my-4">
      {$_("top.actions.1.text")}
    </p>
    <Button href="/register" color="blue" class="cursor-pointer">{$_("top.actions.1.button")}<ArrowRightOutline class="ms-2 h-5 w-5" /></Button>
  </TimelineItem>
  <TimelineItem>
    <h1 class="text-3xl text-slate-700 mt-4">{$_("top.actions.2.heading")}</h1>
    {#snippet orientationSlot()}
      <div class="flex items-center">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500"
        >
          <CalendarEditOutline class="text-white h-6 w-6" />
        </div>
        <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
      </div>
    {/snippet}
    <p class="text-base font-normal text-slate-700 my-4">
      {$_("top.actions.2.text")}
    </p>
    <Button href="/calendar" color="blue">{$_("top.actions.2.button")}<ArrowRightOutline class="ms-2 h-5 w-5" /></Button>
  </TimelineItem>
  <TimelineItem>
    <h1 class="text-3xl text-slate-700 mt-4">{$_("top.actions.3.heading")}</h1>
    {#snippet orientationSlot()}
      <div class="flex items-center">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500"
        >
          <HeartSolid class="text-white h-6 w-6" />
        </div>
        <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
      </div>
    {/snippet}
    <p class="text-base font-normal text-slate-700 my-4">
      {$_("top.actions.3.text")}
    </p>
    <Button href="/blog" color="blue">{$_("top.actions.3.button")}<ArrowRightOutline class="ms-2 h-5 w-5" /></Button>
  </TimelineItem>
</Timeline>