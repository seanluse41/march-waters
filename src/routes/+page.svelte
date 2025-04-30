<script>
    import { Heading, P, Card } from "flowbite-svelte";
    import TitleAnimation from "../lib/components/TitleAnimation.svelte";
    import WomanBaby from "$lib/assets/animations/WomanBaby.svelte";
    import LorumIpsum from "../lib/components/LorumIpsum.svelte";
    import CardsDisplay from "../lib/components/CardsDisplay.svelte";
    import SocialsCard from "../lib/components/SocialsCard.svelte";
</script>

<main class="">
    <div class="container mx-auto flex flex-col gap-8">
        <TitleAnimation />
        <div class="flex flex-col md:flex-row mt-16 px-2 md:px-32 gap-4 md:gap-0">
            <div class="w-full md:w-1/2">
                <WomanBaby />
            </div>
            <div class="w-full md:w-1/2">
                <div class="card bg-white rounded-lg shadow-md p-6 sm:pt-3">
                    <SocialsCard />
                </div>
            </div>
        </div>

        <CardsDisplay />
    </div>
</main>
