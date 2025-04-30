<script>
  // TopCard.svelte
  export let title = "";
  export let text = "";
  export let icon = null;
</script>

<div class="card cursor-pointer bg-white rounded-lg shadow-md p-6 lg:h-56 sm:pt-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-slate-700">{title}</h3>
    {#if icon}
      <svelte:component this={icon} class="ml-1 text-blue-600 flex-shrink-0" size="xl" />
    {/if}
  </div>
  <p class="text-slate-700">{text}</p>
</div>