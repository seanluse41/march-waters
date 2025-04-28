<script>
	import '../app.css';
	import Fab from '$lib/components/FAB.svelte';
    import FullScreenNav from '$lib/components/FullScreenNav.svelte';
    import LanguageButton from '$lib/components/LanguageButton.svelte';
	let { children } = $props();
</script>

<div class="flex flex-col bg-whitesmoke relative" id="top">
    <div class="flex-grow px-[5%] pb-[5%] z-10 relative">
        <LanguageButton />
        <FullScreenNav />
        <Fab />
        <div class="flex flex-col mt-8">
            {@render children()}
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: whitesmoke;
    }
</style>
