<script>
    import { _ } from "svelte-i18n";
    import { Button, Heading, Hr, List, Li } from "flowbite-svelte";
    import { ArrowRightOutline, ArrowLeftOutline } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import StepsTimeline from "$lib/components/StepsTimeline.svelte";
    import InfoForm from "$lib/components/InfoForm.svelte";
    import ConfirmationScreen from "$lib/components/ConfirmationScreen.svelte";

    // Persistent state
    let selectedDate = $state(null);
    let selectedTimeSlot = $state("");
    let dateSelected = $state(false);
    
    // Form validation states
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let paymentMethod = $state("cash");

    let currentStep = $state(1);

    let isFormValid = $derived(name.trim() !== "" && email.trim() !== "" && phone.trim() !== "");
    let canProceedFromStep1 = $derived(dateSelected && selectedTimeSlot !== "");

    $effect(() => {
        console.log("Date:", selectedDate, "Time:", selectedTimeSlot, "Can proceed:", dateSelected && selectedTimeSlot !== "");
    });

    function nextStep() {
        if (currentStep === 1 && canProceedFromStep1) {
            currentStep = 2;
        } else if (currentStep === 2 && isFormValid) {
            currentStep = 3;
        } else if (currentStep === 3) {
            currentStep = 4;
            console.log("Booking complete!", {
                date: selectedDate,
                time: selectedTimeSlot,
                name,
                email,
                phone,
                paymentMethod
            });
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep = currentStep - 1;
        }
    }
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <Heading class="text-5xl font-bold my-8 text-slate-700">
            {$_("bodychoice.pageTitle")}
        </Heading>
        <PhotoCarousel />
        
        <div class="my-8">
            <Heading tag="h2" class="text-2xl font-bold mb-4 text-slate-700">
                {$_("bodychoice.project.title")}
            </Heading>
            <p class="text-slate-700 mb-6">
                {$_("bodychoice.project.description")}
            </p>
            
            <Heading tag="h3" class="text-lg font-semibold mt-6 mb-2 text-slate-700">
                {$_("bodychoice.project.services.title")}
            </Heading>
            <List class="space-y-1 mb-4">
                <Li>{$_("bodychoice.project.services.item1")}</Li>
                <Li>{$_("bodychoice.project.services.item2")}</Li>
                <Li>{$_("bodychoice.project.services.item3")}</Li>
            </List>
            
            <div class="mt-6 bg-blue-50 p-4 rounded-lg">
                <Heading tag="h3" class="text-lg font-semibold mb-2 text-slate-700">
                    {$_("bodychoice.project.details.title")}
                </Heading>
                <p class="text-slate-700">
                    <span class="font-medium">{$_("bodychoice.project.details.cost")}:</span> {$_("bodychoice.project.details.costValue")}
                </p>
            </div>
        </div>
    </div>
    <div
        class="w-full md:w-1/2 p-4 md:px-10 md:sticky md:top-0 overflow-y-auto flex flex-col items-center"
    >
        <StepsTimeline {currentStep} />
        <Hr class="mx-auto my-4 h-1 w-48 rounded-sm md:my-10" />

        {#if currentStep === 1}
            <div in:fly={{ y: 50, duration: 300 }}>
                <Heading class="text-4xl font-bold my-8 text-slate-700">
                    {$_("bodychoice.steps.chooseDate")}
                </Heading>
                <DatePicker 
                    bind:selectedDate 
                    bind:selectedTimeSlot 
                    bind:dateSelected
                />
            </div>
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }}>
                <Heading class="text-4xl font-bold my-8 text-slate-700">
                    {$_("bodychoice.steps.enterInfo")}
                </Heading>
                <InfoForm 
                    bind:name 
                    bind:email 
                    bind:phone 
                    bind:paymentMethod
                />
            </div>
        {:else if currentStep === 3}
            <ConfirmationScreen 
                {selectedDate} 
                {selectedTimeSlot} 
                {name} 
                {email} 
                {phone} 
                {paymentMethod}
            />
        {/if}

        {#if currentStep <= 3}
            <div class="flex gap-8 w-full items-center justify-center px-2 md:px-32">
                <Button
                    color="primary"
                    onclick={prevStep}
                    disabled={currentStep <= 1}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    <ArrowLeftOutline class="me-2 h-5 w-5" /> {$_("bodychoice.buttons.previous")}
                </Button>
                <Button
                    color="primary"
                    onclick={nextStep}
                    disabled={currentStep === 1 ? !canProceedFromStep1 : (currentStep === 2 ? !isFormValid : false)}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    {currentStep === 3 ? $_("bodychoice.buttons.complete") : $_("bodychoice.buttons.next")} <ArrowRightOutline class="ms-2 h-5 w-5" />
                </Button>
            </div>
        {/if}
    </div>
</div>