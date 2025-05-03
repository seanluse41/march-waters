<script>
    import { Card } from "flowbite-svelte";
    let { children } = $props();
</script>

<Card color="primary" class="p-4 md:p-8 bg-white max-w-none mt-16">
    {@render children()}
</Card>
