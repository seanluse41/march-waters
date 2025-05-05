<script>
    import LorumIspum from "$lib/components/LorumIpsum.svelte";
    import { Button, Heading } from "flowbite-svelte";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import StepsTimeline from "$lib/components/StepsTimeline.svelte";

    let currentStep = $state(1);

    const nextStep = () => {
        currentStep += 1
    }
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <Heading class="text-5xl font-bold my-8 text-slate-700">Midwife Consulation</Heading>
        <PhotoCarousel />
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
    </div>
    <div
        class="w-full md:w-1/2 p-4 md:px-10 md:sticky md:top-0 overflow-y-auto flex flex-col items-center justify-center"
    >
    <StepsTimeline currentStep={currentStep} />

        <Heading class="text-4xl font-bold my-8 text-slate-700">
            Choose an Open Date
        </Heading>
        <DatePicker />
        <Button
            color="primary"
            onclick={nextStep}
            class="mt-8 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 text-white">Next</Button
        >
    </div>
</div>
