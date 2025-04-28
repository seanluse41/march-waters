<script>
    import { Heading, P, Card } from "flowbite-svelte";
    import TitleAnimation from "../lib/components/TitleAnimation.svelte";
    import LorumIpsum from "../lib/components/LorumIpsum.svelte";
</script>

<main class="bg-gray-100">
    <div class="container mx-auto p-4">
        <Card color="primary" class="p-8 border-0 max-w-none">
            <TitleAnimation />
            <h1 class="text-3xl font-bold">Your App Content</h1>
            <LorumIpsum />
        </Card>
    </div>
</main>
