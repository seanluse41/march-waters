<script>
  import { Radio } from "flowbite-svelte";
  import { ArrowRightOutline, ClockSolid, EnvelopeSolid } from "flowbite-svelte-icons";
  import { _ } from "svelte-i18n";
  import { fly } from "svelte/transition";

  let { selectedCourse = $bindable("") } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
  <p class="mb-5 text-lg font-medium text-slate-700">{$_("midwife.coursePicker.title")}</p>
  <div class="grid w-full gap-6 md:grid-cols-2">
    <Radio name="consultCourse" custom value="quick" bind:group={selectedCourse}>
      <div class="dark:peer-checked:text-primary-500 peer-checked:border-blue-600 peer-checked:text-blue-600 inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
        <div>
          <div class="w-full text-lg font-semibold">{$_("midwife.coursePicker.quick.title")}</div>
          <div class="w-full">{$_("midwife.coursePicker.quick.description")}</div>
          <div class="mt-2 text-blue-600 font-bold">¥3,000</div>
        </div>
        <div class="flex flex-col items-center justify-center ml-3">
          <ClockSolid class="h-8 w-8 text-blue-500" />
          <span class="text-sm mt-1">30 min</span>
        </div>
      </div>
    </Radio>
    <Radio name="consultCourse" custom value="in-depth" bind:group={selectedCourse}>
      <div class="dark:peer-checked:text-primary-500 peer-checked:border-blue-600 peer-checked:text-blue-600 inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
        <div class="block">
          <div class="w-full text-lg font-semibold">{$_("midwife.coursePicker.inDepth.title")}</div>
          <div class="w-full">{$_("midwife.coursePicker.inDepth.description")}</div>
          <div class="mt-2 text-blue-600 font-bold">¥5,500</div>
        </div>
        <div class="flex flex-col items-center justify-center ml-3">
          <ClockSolid class="h-8 w-8 text-blue-500" />
          <span class="text-sm mt-1">60 min</span>
        </div>
      </div>
    </Radio>
    <Radio name="consultCourse" custom value="email" bind:group={selectedCourse}>
      <div class="dark:peer-checked:text-primary-500 peer-checked:border-blue-600 peer-checked:text-blue-600 inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
        <div class="block">
          <div class="w-full text-lg font-semibold">{$_("midwife.coursePicker.email.title")}</div>
          <div class="w-full">{$_("midwife.coursePicker.email.description")}</div>
          <div class="mt-2 text-blue-600 font-bold">¥2,500</div>
        </div>
        <div class="flex flex-col items-center justify-center ml-3">
          <EnvelopeSolid class="h-8 w-8 text-blue-500" />
        </div>
      </div>
    </Radio>
  </div>
</div>