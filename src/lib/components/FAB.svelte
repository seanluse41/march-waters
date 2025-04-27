<script>
    import { onMount } from "svelte";
    import { Button } from "flowbite-svelte";
    import { CaretUpSolid } from "flowbite-svelte-icons";
    let scrollToTop = $state();

    onMount(() => {
        let topElement = document.getElementById("top");
        scrollToTop = () => {
            topElement ? window.scrollTo({top: 0, left: 0, behavior: "smooth"}) : null;
        };
    });
</script>

<Button on:click={scrollToTop} pill={true} class="!p-2 focus:ring-0 bg-rojo"><CaretUpSolid class="w-6 h-6" /></Button>
