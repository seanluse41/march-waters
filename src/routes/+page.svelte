<script>
    import { Heading, P, Card } from "flowbite-svelte";
    import TitleAnimation from "../lib/components/TitleAnimation.svelte";
    import WomanBaby from "$lib/assets/animations/WomanBaby.svelte";
    import LorumIpsum from "../lib/components/LorumIpsum.svelte";
    import CardsDisplay from "../lib/components/CardsDisplay.svelte";
    import SocialsCard from "../lib/components/SocialsCard.svelte";
    import ActionsCard from "../lib/components/ActionsCard.svelte";
</script>

<main class="">
    <div class="container mx-auto flex flex-col gap-8">
        <TitleAnimation />
    <div class="flex flex-col lg:flex-row mt-16 gap-4 lg:gap-0 items-center">
            <div class="w-full md:w-1/2">
                <WomanBaby />
            </div>
            <div class="w-full md:w-2/3">
                <div class="card bg-white rounded-lg shadow-md md:p-6 p-3">
                    <SocialsCard />
                </div>
            </div>
        </div>
        <div class="card bg-white rounded-lg shadow-2xl md:p-6 p-3">
            <ActionsCard />
        </div>
        <CardsDisplay />
    </div>
</main>
