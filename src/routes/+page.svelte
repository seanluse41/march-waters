<script>
    import { Heading, P, Card } from "flowbite-svelte";
    import TitleAnimation from "../lib/components/TitleAnimation.svelte";
    import LogoAnimation from "$lib/components/LogoAnimation.svelte";
    import LorumIpsum from "../lib/components/LorumIpsum.svelte";
</script>

<main class="bg-gray-100">
    <div class="container mx-auto">
        <Card color="primary" class="p-8 border-0 max-w-none">
            <TitleAnimation />
            <LogoAnimation />
        </Card>
    </div>
</main>
