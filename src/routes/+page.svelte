<script>
    import TitleAnimation from "../lib/components/TitleAnimation.svelte";
    import WomanBaby from "$lib/assets/animations/WomanBaby.svelte";
    import CardsDisplay from "../lib/components/CardsDisplay.svelte";
    import SocialsCard from "../lib/components/SocialsCard.svelte";
    import NewsBox from "../lib/components/NewsBox.svelte";
</script>

<main class="">
    <div class="container mx-auto flex flex-col gap-8">
        <TitleAnimation />
        <div
            class="flex flex-col lg:flex-row mt-16 gap-4 lg:gap-0 items-center"
        >
            <div class="w-full md:w-1/2">
                <WomanBaby />
            </div>
            <div class="w-full md:w-2/3">
                <SocialsCard />
            </div>
        </div>
        <NewsBox />
        <CardsDisplay />
    </div>
</main>
