<script>
    import LorumIspum from "$lib/components/LorumIpsum.svelte";
    import { Button, Heading, Hr } from "flowbite-svelte";
    import { ArrowRightOutline, ArrowLeftOutline } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import StepsTimeline from "$lib/components/StepsTimeline.svelte";
    import InfoForm from "$lib/components/InfoForm.svelte";

    let selectedDate = $state(null);
    let selectedTimeSlot = $state("");

    let currentStep = $state(1);

    const nextStep = () => {
        currentStep += 1;
    };

    const prevStep = () => {
        currentStep -= 1;
    };

    let canProceed = $derived(selectedDate !== null && selectedTimeSlot !== "");
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <Heading class="text-5xl font-bold my-8 text-slate-700"
            >Child care Services</Heading
        >
        <PhotoCarousel />
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
    </div>
    <div
        class="w-full md:w-1/2 p-4 md:px-10 md:sticky md:top-0 overflow-y-auto flex flex-col items-center"
    >
        <StepsTimeline {currentStep} />
        <Hr class="mx-auto my-4 h-1 w-48 rounded-sm md:my-10" />

        {#if currentStep === 1}
            <div in:fly={{ y: 50, duration: 300 }}>
                <Heading class="text-4xl font-bold my-8 text-slate-700">
                    Choose an Open Date
                </Heading>
                <DatePicker bind:selectedDate bind:selectedTimeSlot />
            </div>
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }}>
                <Heading class="text-4xl font-bold my-8 text-slate-700">
                    Enter Your Information
                </Heading>
                <InfoForm onNext={nextStep} onBack={prevStep} />
            </div>
        {/if}
        <div class="flex gap-8 w-full items-center justify-center px-2 md:px-32">
            <Button
                color="primary"
                onclick={prevStep}
                disabled={!canProceed}
                class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
            >
            <ArrowLeftOutline class="ms-2 h-5 w-5" /> Previous
            </Button>
            <Button
                color="primary"
                onclick={nextStep}
                disabled={!canProceed}
                class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
            >
                Next <ArrowRightOutline class="ms-2 h-5 w-5" />
            </Button>
        </div>
    </div>
</div>
