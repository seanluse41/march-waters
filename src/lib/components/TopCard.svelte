<!-- TopCard.svelte -->
<script>
  const { title, text, iconName, link } = $props();
  import {
    MoonPlusOutline,
    UserGraduateOutline,
    HeadphonesOutline,
    BookOpenOutline,
    GlobeOutline,
    ArrowUpRightFromSquareOutline,
  } from "flowbite-svelte-icons";

  import { Card } from "flowbite-svelte";
</script>

<Card href={link} color="primary" class="p-4 sm:p-6 md:p-8 bg-white max-w-none min-h-72">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-slate-700">{title}</h3>
    {#if iconName === "MoonPlusOutline"}
      <MoonPlusOutline class="h-8 w-8 text-slate-700" />
    {:else if iconName === "UserGraduateOutline"}
      <UserGraduateOutline class="h-8 w-8 text-slate-700" />
    {:else if iconName === "HeadphonesOutline"}
      <HeadphonesOutline class="h-8 w-8 text-slate-700 " />
    {:else if iconName === "BookOpenOutline"}
      <BookOpenOutline class="h-8 w-8 text-slate-700 " />
    {:else if iconName === "GlobeOutline"}
      <GlobeOutline class="h-8 w-8 text-slate-700" />
    {/if}
  </div>
  <p class="text-slate-700">{text}</p>
</Card>
