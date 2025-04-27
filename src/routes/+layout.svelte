<script>
	import '../app.css';
	import Navbar from "$lib/components/Navbar.svelte"
	import Fab from '$lib/components/FAB.svelte';
	let { children } = $props();
</script>

<div class="flex flex-col bg-whitesmoke relative">
    <Navbar />
    <div class="flex-grow px-[5%] pb-[5%] z-10 relative">
        <div class="flex flex-col mt-8">
            {@render children()}
        </div>
    </div>
</div>

<div class="fixed right-4 bottom-4 z-20">
    <Fab />
</div>

<style>
    :global(body) {
        background-color: whitesmoke;
    }
</style>
