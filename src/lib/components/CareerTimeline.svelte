<script>
  import { Timeline, TimelineItem } from "flowbite-svelte";
  import { 
    BadgeCheckSolid, 
    GraduationCapSolid, 
    HomeSolid, 
    HeartSolid, 
    SchoolSolid 
  } from "flowbite-svelte-icons";
  import { _ } from "svelte-i18n";
</script>

<div class="career-timeline">
  <h2 class="text-2xl md:text-3xl font-bold text-slate-700 mb-8">{$_("about.timeline.heading")}</h2>
  
  <Timeline order="vertical">
    <TimelineItem title={$_("about.timeline.2017.title")} date={$_("about.timeline.2017.date")}>
      {#snippet orientationSlot()}
        <span class="bg-blue-500 absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
          <BadgeCheckSolid class="text-white h-6 w-6" />
        </span>
      {/snippet}
      <p class="text-base text-slate-700 pl-4">
        {$_("about.timeline.2017.description")}
      </p>
    </TimelineItem>

    <TimelineItem title={$_("about.timeline.2019.title")} date={$_("about.timeline.2019.date")}>
      {#snippet orientationSlot()}
        <span class="bg-blue-500 absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
          <HeartSolid class="text-white h-6 w-6" />
        </span>
      {/snippet}
      <p class="text-base text-slate-700">
        {$_("about.timeline.2019.description")}
      </p>
    </TimelineItem>

    <TimelineItem title={$_("about.timeline.2022.title")} date={$_("about.timeline.2022.date")}>
      {#snippet orientationSlot()}
        <span class="bg-blue-500 absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
          <GraduationCapSolid class="text-white h-6 w-6" />
        </span>
      {/snippet}
      <p class="text-base text-slate-700">
        {$_("about.timeline.2022.description")}
      </p>
    </TimelineItem>

    <TimelineItem title={$_("about.timeline.2024.title")} date={$_("about.timeline.2024.date")}>
      {#snippet orientationSlot()}
        <span class="bg-blue-500 absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
          <SchoolSolid class="text-white h-6 w-6" />
        </span>
      {/snippet}
      <div class="text-base text-slate-700">
        <p class="mb-3">
          {$_("about.timeline.2024.description")}
        </p>
        <div class="bg-slate-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">{$_("about.timeline.2024.achievements.heading")}</h4>
          <ul class="space-y-1">
            <li>{$_("about.timeline.2024.achievements.item1")}</li>
            <li>{$_("about.timeline.2024.achievements.item2")}</li>
            <li>{$_("about.timeline.2024.achievements.item3")}</li>
          </ul>
        </div>
      </div>
    </TimelineItem>

    <TimelineItem title={$_("about.timeline.2025.title")} date={$_("about.timeline.2025.date")}>
      {#snippet orientationSlot()}
        <span class="bg-blue-500 absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
          <HomeSolid class="text-white h-6 w-6" />
        </span>
      {/snippet}
      <p class="text-base text-slate-700">
        {$_("about.timeline.2025.description")}
      </p>
    </TimelineItem>
  </Timeline>
</div>