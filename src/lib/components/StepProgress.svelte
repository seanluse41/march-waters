<script>
  import { StepIndicator } from "flowbite-svelte";

  let { 
    currentStep = 1, 
    steps = [],
    descriptions = [],
    color = "blue"
  } = $props();
  
  // Get description for current step
  let currentDescription = $derived.by(() => {
    if (currentStep > 0 && currentStep <= descriptions.length) {
      return descriptions[currentStep - 1];
    }
    return "";
  });
</script>

<div class="w-full">
  <StepIndicator 
    {steps}
    {currentStep}
    {color}
  />
  
  {#if currentDescription}
    <div class="mt-4 text-center">
      <p class="font-medium text-slate-700">
        {currentDescription}
      </p>
    </div>
  {/if}
</div>