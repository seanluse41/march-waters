<script>
	import '../app.css';
	import Fab from '$lib/components/FAB.svelte';
    import FullScreenNav from '$lib/components/FullScreenNav.svelte';
    import LanguageButton from '$lib/components/LanguageButton.svelte';
	let { children } = $props();
    
    // Gradient colors (you can adjust these to match your preference)
    const gradient1 = "#fff989";
    const gradient2 = "#89d9ff";
    const gradientDeg = "45deg";
</script>

<div 
    class="flex flex-col relative" 
    id="top"
    style="
        --gradient-1: {gradient1};
        --gradient-2: {gradient2};
        --deg: {gradientDeg};
    "
>
    <LanguageButton />
    <div class="flex-grow px-[5%] pb-[5%] z-10 relative">
        <FullScreenNav />
        <Fab />
        <div class="flex flex-col mt-8">
            {@render children()}
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }
    
    div#top {
        min-height: 100vh;
        width: 100%;
        background: linear-gradient(var(--deg), var(--gradient-1), var(--gradient-2));
    }
</style>