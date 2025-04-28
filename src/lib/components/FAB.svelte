<script>
    import { Button } from "flowbite-svelte";
    import { CaretUpSolid } from "flowbite-svelte-icons";
    
    function scrollToTop() {
        console.log("click");
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }
</script>

<Button 
    onclick={scrollToTop} 
    pill={true} 
    class="!p-2 focus:ring-0 bg-blue-500 fixed right-5 bottom-5 z-20">
    <CaretUpSolid class="w-6 h-6" />
</Button>