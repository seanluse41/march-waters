<script>
    import { _ } from "svelte-i18n";
    import { Button, Heading, Hr, List, Li, Spinner } from "flowbite-svelte";
    import {
        ArrowRightOutline,
        ArrowLeftOutline,
        ClockSolid,
        EnvelopeSolid,
    } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import StepProgress from "$lib/components/StepProgress.svelte";
    import InfoForm from "$lib/components/InfoForm.svelte";
    import ConfirmationScreen from "$lib/components/ConfirmationScreen.svelte";
    import SuccessCard from "$lib/components/SuccessCard.svelte";
    import CoursePicker from "$lib/components/CoursePicker.svelte";
    import {
        addCalendarEvent,
        createConsultEventData,
    } from "$lib/requests/addCalendarEvent.js";
    import { sendReservationRequestEmail } from "$lib/requests/sendReservationRequestEmail.js";
    import { validateEmail } from "$lib/helpers/emailHelpers.js";

    // Persistent state
    let selectedDate = $state(null);
    let selectedTimeSlot = $state("");
    let dateSelected = $state(false);

    let dinner = $state(false);

    // Form validation states
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let paymentMethod = $state("credit"); // Default to credit for consultations
    let selectedCourse = $state("");
    let isSubmitting = $state(false);
    let submissionError = $state("");

    // Track if email consultation is selected
    let isEmailCourse = $derived(selectedCourse === "email");

    let currentStep = $state(1);

    // Replace constant array with derived reactive array
    let midwifeCourses = $derived([
        {
            id: "quick",
            title: $_("midwife.coursePicker.quick.title"),
            description: $_("midwife.coursePicker.quick.description"),
            price: "¥3,000",
            duration: "30 min",
            icon: ClockSolid,
        },
        {
            id: "indepth",
            title: $_("midwife.coursePicker.inDepth.title"),
            description: $_("midwife.coursePicker.inDepth.description"),
            price: "¥5,500",
            duration: "60 min",
            icon: ClockSolid,
        },
        {
            id: "email",
            title: $_("midwife.coursePicker.email.title"),
            description: $_("midwife.coursePicker.email.description"),
            price: "¥2,500",
            duration: "---",
            icon: EnvelopeSolid,
        },
    ]);

    // Also make steps and descriptions reactive
    let steps = $derived([
        $_("midwife.steps.chooseCourse"),
        $_("midwife.steps.chooseDate"),
        $_("midwife.steps.enterInfo"),
        $_("midwife.steps.confirm"),
    ]);

    let descriptions = $derived([
        $_("midwife.steps.chooseCourseDescription", {
            default: "Select your consultation type",
        }),
        $_("timeline.step1.description"),
        $_("timeline.step2.description"),
        $_("timeline.step3.description"),
    ]);

    // Reactive derived state for the active course
    let activeCourse = $derived(
        midwifeCourses.find((c) => c.id === selectedCourse),
    );

    let isFormValid = $derived(
        name.trim() !== "" && email.trim() !== "" && !validateEmail(email),
    );
    let canProceedFromStep1 = $derived(selectedCourse !== "");
    let canProceedFromStep2 = $derived(dateSelected && selectedTimeSlot !== "");

    function nextStep() {
        if (currentStep === 1 && canProceedFromStep1) {
            // If email consultation is selected, skip the date selection step
            if (isEmailCourse) {
                currentStep = 3; // Skip to info entry step
            } else {
                currentStep = 2; // Go to date selection for other consultation types
            }
        } else if (currentStep === 2 && canProceedFromStep2) {
            currentStep = 3;
        } else if (currentStep === 3 && isFormValid) {
            currentStep = 4;
        } else if (currentStep === 4) {
            handleSubmission();
        }
    }

    async function handleSubmission() {
        if (dinner) {
            console.log("Bot detected - dinner checkbox checked");
            submissionError = "Please try again later.";
            return;
        }
        isSubmitting = true;
        submissionError = "";

        try {
            // For email consultations, use current date
            const eventDate = isEmailCourse ? new Date() : selectedDate;

            const eventData = createConsultEventData({
                selectedDate: eventDate,
                selectedTimeSlot: isEmailCourse ? "N/A" : selectedTimeSlot,
                name,
                email,
                phone,
                selectedCourse,
                paymentMethod: "credit", // Always credit for consultations
                courseDuration: activeCourse?.duration,
            });

            const result = await addCalendarEvent(
                eventData,
                email,
                "consultation",
            );

            if (result.success) {
                // Send reservation request email
                const emailResult = await sendReservationRequestEmail(
                    eventData,
                    email,
                );
                if (!emailResult.success) {
                    console.warn(
                        "Reservation request email failed to send:",
                        emailResult.error,
                    );
                    // Don't fail the submission, just log the issue
                }

                currentStep = 5;
            } else {
                submissionError =
                    result.error ||
                    "Failed to create booking. Please try again.";
            }
        } catch (error) {
            console.error("Submission error:", error);
            submissionError = "An unexpected error occurred. Please try again.";
        } finally {
            isSubmitting = false;
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            // If we're at the info step and it's an email consultation,
            // go back to step 1 (course selection) instead of step 2 (date selection)
            if (currentStep === 3 && isEmailCourse) {
                currentStep = 1;
            } else {
                currentStep = currentStep - 1;
            }
        }
    }
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <Heading class="text-5xl font-bold my-8 text-slate-700">
            {$_("midwife.pageTitle")}
        </Heading>
        <PhotoCarousel />

        <div class="my-8">
            <Heading tag="h2" class="text-2xl font-bold mb-4 text-slate-700">
                {$_("midwife.project.title")}
            </Heading>
            <p class="text-slate-700 mb-6">
                {$_("midwife.project.description")}
            </p>

            <Heading
                tag="h3"
                class="text-lg font-semibold mt-6 mb-2 text-slate-700"
            >
                {$_("midwife.project.services.title")}
            </Heading>
            <List class="space-y-1 mb-4">
                <Li>{$_("midwife.project.services.item1")}</Li>
                <Li>{$_("midwife.project.services.item2")}</Li>
                <Li>{$_("midwife.project.services.item3")}</Li>
                <Li>{$_("midwife.project.services.item4")}</Li>
                <Li>{$_("midwife.project.services.item5")}</Li>
            </List>
        </div>
    </div>
    <div
        class="w-full md:w-1/2 p-4 md:px-10 md:sticky md:top-0 overflow-y-auto flex flex-col items-center"
    >
        <StepProgress {currentStep} {steps} {descriptions} color="blue" />
        <Hr class="mx-auto my-4 h-1 w-48 rounded-sm md:my-10" />

        <!-- select a course -->
        {#if currentStep === 1}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700"
                >
                    {$_("midwife.coursePicker.title")}
                </Heading>
                <CoursePicker
                    bind:selectedCourse
                    title={$_("midwife.coursePicker.title")}
                    courses={midwifeCourses}
                />
            </div>

            <!-- choose a date and time -->
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700"
                >
                    {$_("midwife.steps.chooseDate")}
                </Heading>

                <DatePicker
                    bind:selectedDate
                    bind:selectedTimeSlot
                    bind:dateSelected
                    context="consult"
                />
            </div>
            <!-- enter info -->
        {:else if currentStep === 3}
            <div in:fly={{ y: 50, duration: 300 }} class="flex flex-col w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700 w-full"
                >
                    {$_("midwife.steps.enterInfo")}
                </Heading>
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p class="font-medium text-blue-800">
                        {$_("midwife.appointment")}:
                    </p>
                    <p class="text-sm text-blue-700">
                        {activeCourse?.title || "-"}
                        {#if !isEmailCourse}
                            - {selectedDate?.toLocaleDateString() || "-"}
                            {selectedTimeSlot || "-"}
                        {/if}
                    </p>
                </div>
                <InfoForm
                    bind:name
                    bind:email
                    bind:phone
                    bind:paymentMethod
                    disablePayment={true}
                    requirePhone={false}
                />
            </div>
            <!-- confirm -->
        {:else if currentStep === 4}
            <div in:fly={{ y: 50, duration: 300 }} class="flex flex-col w-full">
                <ConfirmationScreen
                    selectedDate={isEmailCourse ? null : selectedDate}
                    selectedTimeSlot={isEmailCourse ? "N/A" : selectedTimeSlot}
                    {name}
                    {email}
                    {phone}
                    paymentMethod="credit"
                    coursePrice={activeCourse?.price}
                    course={activeCourse?.title}
                    title={$_("midwife.confirmation.title")}
                    detailsText={$_("midwife.confirmation.details")}
                    paymentInstructionsText={$_(
                        "midwife.confirmation.paymentInstructions",
                    )}
                    cashInstructionsText=""
                    creditInstructionsText={$_(
                        "midwife.confirmation.creditInstructions",
                    )}
                />
            </div>
            <!-- success -->
        {:else if currentStep === 5}
            <SuccessCard
                selectedDate={isEmailCourse ? null : selectedDate}
                selectedTimeSlot={isEmailCourse ? "N/A" : selectedTimeSlot}
                {name}
                {email}
                {phone}
                paymentMethod="credit"
                coursePrice={activeCourse?.price}
                course={activeCourse?.title}
                title={$_("midwife.success.title")}
                successMessage={$_("midwife.success.message")}
                nextStepsText={$_("midwife.success.nextSteps")}
            />
        {/if}

        {#if currentStep <= 4}
            <div
                class="flex gap-8 w-full items-center justify-center px-0 md:px-32"
            >
                <Button
                    color="primary"
                    onclick={prevStep}
                    disabled={currentStep <= 1}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    <ArrowLeftOutline class="me-2 h-5 w-5" />
                    {$_("midwife.buttons.previous")}
                </Button>
                <Button
                    color="primary"
                    onclick={nextStep}
                    disabled={currentStep === 1
                        ? !canProceedFromStep1
                        : currentStep === 2
                          ? !canProceedFromStep2
                          : currentStep === 3
                            ? !isFormValid
                            : isSubmitting}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    {#if currentStep === 4 && isSubmitting}
                        <Spinner class="me-3" size="4" color="white" />
                        送信中...
                    {:else}
                        {currentStep === 4
                            ? $_("midwife.buttons.complete")
                            : $_("midwife.buttons.next")}
                    {/if}
                    <ArrowRightOutline class="ms-2 h-5 w-5" />
                </Button>
            </div>

            {#if submissionError}
                <div
                    class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                    <p class="text-red-800 text-sm">{submissionError}</p>
                </div>
            {/if}
        {/if}
    </div>
</div>
