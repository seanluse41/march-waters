<script>
    import { _ } from "svelte-i18n";
    import { Button, Heading, Hr, List, Li, Textarea, Datepicker } from "flowbite-svelte";
    import { ArrowRightOutline, ArrowLeftOutline } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import StepProgress from "$lib/components/StepProgress.svelte";
    import InfoForm from "$lib/components/InfoForm.svelte";

    // Form validation states
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let notes = $state("");
    let preferredDate = $state(null);

    let currentStep = $state(1);

    // Define steps and descriptions
    let steps = $derived([
        $_("bodychoice.steps.enterInfo"),
        $_("bodychoice.steps.confirm")
    ]);
    
    let descriptions = $derived([
        $_("timeline.step2.description"), 
        $_("timeline.step3.description")
    ]);

    let isFormValid = $derived(name.trim() !== "" && email.trim() !== "" && phone.trim() !== "");

    function nextStep() {
        if (currentStep === 1 && isFormValid) {
            currentStep = 2;
        } else if (currentStep === 2) {
            // Handle submission and confirmation logic
            console.log("Inquiry submitted!", {
                name,
                email,
                phone,
                preferredDate,
                notes
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
        <Heading class="text-5xl font-bold my-8 text-slate-700 break-keep">
            {$_("bodychoice.pageTitle")}
        </Heading>
        <PhotoCarousel />
        
        <div class="my-8">
            <Heading tag="h2" class="text-2xl font-bold mb-4 text-slate-700 break-keep">
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
        <StepProgress 
            currentStep={currentStep}
            steps={steps}
            descriptions={descriptions}
            color="blue"
        />
        <Hr class="mx-auto my-4 h-1 w-48 rounded-sm md:my-10" />

        {#if currentStep === 1}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading class="text-4xl font-bold my-8 text-center text-slate-700">
                    {$_("bodychoice.steps.enterInfo")}
                </Heading>
                
                <!-- Standard Info Form -->
                <InfoForm 
                    bind:name 
                    bind:email 
                    bind:phone
                    disablePayment={true}
                />
                
                <!-- Date Picker using Flowbite component -->
                <div class="mb-6">
                    <label for="preferredDate" class="mb-2 block text-slate-700">
                        {$_("bodychoice.form.preferredDate", { default: "Preferred Date (Optional)" })}
                    </label>
                    <div class="w-full">
                        <Datepicker bind:value={preferredDate} color="blue" />
                    </div>
                </div>
                
                <div class="mb-6">
                    <label for="notes" class="mb-2 block text-slate-700">
                        {$_("bodychoice.form.notes", { default: "Additional Notes" })}
                    </label>
                    <Textarea
                        id="notes"
                        bind:value={notes}
                        placeholder={$_("bodychoice.form.notesPlaceholder", { default: "Please share any specific topics or questions you'd like to discuss" })}
                        rows={4}
                    />
                </div>
            </div>
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading class="text-4xl font-bold my-8 text-center text-slate-700">
                    {$_("bodychoice.confirmation.title")}
                </Heading>
                
                <div class="bg-white p-6 rounded-lg border border-slate-200 mb-8">
                    <p class="font-medium text-slate-800 mb-4">
                        {$_("bodychoice.confirmation.details")}
                    </p>
                    <div class="space-y-3 text-slate-700">
                        <p>
                            <span class="font-semibold">{$_("bodychoice.confirmation.name")}:</span> {name}
                        </p>
                        <p>
                            <span class="font-semibold">{$_("bodychoice.confirmation.email")}:</span> {email}
                        </p>
                        <p>
                            <span class="font-semibold">{$_("bodychoice.confirmation.phone")}:</span> {phone}
                        </p>
                        {#if preferredDate}
                            <p>
                                <span class="font-semibold">{$_("bodychoice.form.preferredDate", { default: "Preferred Date" })}:</span> {preferredDate.toLocaleDateString()}
                            </p>
                        {/if}
                        {#if notes}
                            <div>
                                <span class="font-semibold">{$_("bodychoice.form.notes", { default: "Additional Notes" })}:</span>
                                <p class="mt-1 whitespace-pre-wrap">{notes}</p>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p class="font-medium text-blue-800 mb-4">
                        {$_("bodychoice.confirmation.thankYou", { default: "Thank you for your interest in our My Body My Choice Project. We'll review your request and contact you shortly to discuss how we can help." })}
                    </p>
                </div>
            </div>
        {/if}

        {#if currentStep <= 2}
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
                    disabled={currentStep === 1 ? !isFormValid : false}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    {currentStep === 2 ? $_("bodychoice.buttons.complete") : $_("bodychoice.buttons.next")} <ArrowRightOutline class="ms-2 h-5 w-5" />
                </Button>
            </div>
        {/if}
    </div>
</div>