<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import Vara from "vara";

  let { containerId = "vara-container" } = $props();
  let containerElement;
  let showSubtitle = $state(false);

  let onAnimationFinished = () => {
    console.log("done");
    showSubtitle = true;
  };

  onMount(() => {
    const varaInstance = new Vara(`#${containerId}`, "/PacificoSLO.json", [
      {
        text: "March Waters",
        fontSize: 64,
        strokeWidth: 1,
        color: "#1a1a1a",
        duration: 2000,
        textAlign: "center",
      },
    ]);

    varaInstance.ready(function () {
      varaInstance.animationEnd(onAnimationFinished);
    });

    if (containerElement) {
      containerElement.varaInstance = varaInstance;
    }
    return () => {
      if (varaInstance && typeof varaInstance.destroy === "function") {
        varaInstance.destroy();
      }
    };
  });
</script>

<div class="w-full min-h-20 flex flex-col justify-center items-center">
  <div id={containerId} bind:this={containerElement} class="w-full flex justify-center items-center"></div>
  
  <div class="mt-4 h-7 flex items-center justify-center">
    {#if showSubtitle}
      <p 
        class="text-lg text-slate-600 text-center italic"
        in:fly={{ y: 20, duration: 600, opacity: 0 }}
      >
        {$_("top.subtitle")}
      </p>
    {/if}
  </div>
</div>