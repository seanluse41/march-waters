<script>
  import { Radio } from "flowbite-svelte";
  import { fly } from "svelte/transition";
  
  let { 
    selectedCourse = $bindable(""),
    title = "",
    courses = []
  } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
  <p class="mb-5 text-lg font-medium text-slate-700">{title}</p>
  <div class="grid w-full gap-6 md:grid-cols-2">
    {#each courses as course}
    {@const Icon = course.icon}
      <Radio name="consultCourse" custom bind:group={selectedCourse} value={course.id}>
        <div class="dark:peer-checked:text-primary-500 peer-checked:border-blue-600 peer-checked:text-blue-600 inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
          <div>
            <div class="w-full text-lg font-semibold">{course.title}</div>
            <div class="w-full">{course.description}</div>
            <div class="mt-2 text-blue-600 font-bold">{course.price}</div>
          </div>
          <div class="flex flex-col items-center justify-center ml-3">
            <Icon class="h-8 w-8 text-blue-500" />
            {#if course.duration}
              <span class="text-sm mt-1">{course.duration}</span>
            {/if}
          </div>
        </div>
      </Radio>
    {/each}
  </div>
</div>