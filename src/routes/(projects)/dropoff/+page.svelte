<script>
    import { _ } from "svelte-i18n";
    import {
        Button,
        Heading,
        Hr,
        List,
        Li,
        Radio,
        Spinner,
        P,
    } from "flowbite-svelte";
    import {
        ArrowRightOutline,
        ArrowLeftOutline,
        BowlRiceOutline,
        CloseCircleOutline,
    } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import PhotoCarousel from "$lib/components/PhotoCarousel.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import StepProgress from "$lib/components/StepProgress.svelte";
    import InfoForm from "$lib/components/InfoForm.svelte";
    import ConfirmationScreen from "$lib/components/ConfirmationScreen.svelte";
    import CoursePicker from "$lib/components/CoursePicker.svelte";
    import {
        addCalendarEvent,
        createDropoffEventData,
    } from "$lib/requests/addCalendarEvent.js";
    import { sendReservationRequestEmail } from "$lib/requests/sendReservationRequestEmail.js";
    import SuccessCard from "$lib/components/SuccessCard.svelte";
    import { validateEmail } from "$lib/helpers/emailHelpers.js";

    // Persistent state
    let selectedDate = $state(null);
    let dateSelected = $state(false);

    // Form validation states
    let dinner = $state(false);
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let paymentMethod = $state("cash");
    let selectedCourse = $state("normal");
    let childCount = $state(1);
    let isSubmitting = $state(false);
    let submissionError = $state("");

    let currentStep = $state(1);

    // Define courses
    let dropoffCourses = $derived([
        {
            id: "dropoff-dinnner",
            title: $_("dropoff.courses.normal.title"),
            description: $_("dropoff.courses.normal.description"),
            price: "¥8,000",
            icon: BowlRiceOutline,
        },
        {
            id: "dropoff-nodinner",
            title: $_("dropoff.courses.allergy.title"),
            description: $_("dropoff.courses.allergy.description"),
            price: "¥7,500",
            icon: CloseCircleOutline,
        },
    ]);

    // Define steps and descriptions
    let steps = $derived([
        $_("dropoff.steps.chooseCourse", { default: "Choose Course" }),
        $_("dropoff.steps.chooseDate"),
        $_("dropoff.steps.enterInfo"),
        $_("dropoff.steps.confirm"),
    ]);

    let descriptions = $derived([
        $_("dropoff.steps.chooseCourseDescription"),
        $_("timeline.step1.description"),
        $_("timeline.step2.description"),
        $_("timeline.step3.description"),
    ]);

    // Reactive derived state for the active course
    let activeCourse = $derived(
        dropoffCourses.find((c) => c.id === selectedCourse),
    );

    let isFormValid = $derived(
        name.trim() !== "" &&
            email.trim() !== "" &&
            !validateEmail(email) &&
            phone.trim() !== "",
    );
    let canProceedFromStep1 = $derived(selectedCourse !== "");
    let canProceedFromStep2 = $derived(dateSelected);

    function nextStep() {
        if (currentStep === 1 && canProceedFromStep1) {
            currentStep = 2;
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
            const eventData = createDropoffEventData({
                selectedDate,
                name,
                email,
                phone,
                childCount,
                selectedCourse: activeCourse?.title,
                paymentMethod,
            });

            const result = await addCalendarEvent(
                eventData
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
            currentStep = currentStep - 1;
        }
    }
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <Heading class="text-5xl font-bold my-8 text-slate-700">
            {$_("dropoff.pageTitle")}
        </Heading>
        <PhotoCarousel />

        <div class="my-8">
            <Heading tag="h2" class="text-2xl font-bold mb-4 text-slate-700">
                {$_("dropoff.project.title")}
            </Heading>
            <p class="text-slate-700 mb-6">
                {$_("dropoff.project.description")}
            </p>

            <Heading
                tag="h3"
                class="text-lg font-semibold mt-6 mb-2 text-slate-700"
            >
                {$_("dropoff.project.services.title")}
            </Heading>
            <List class="space-y-1 mb-4">
                <Li>{$_("dropoff.project.services.item1")}</Li>
                <Li>{$_("dropoff.project.services.item2")}</Li>
                <Li>{$_("dropoff.project.services.item3")}</Li>
            </List>

            <div class="mt-6 bg-blue-50 p-4 rounded-lg">
                <Heading
                    tag="h3"
                    class="text-lg font-semibold mb-2 text-slate-700"
                >
                    {$_("dropoff.project.details.title")}
                </Heading>
                <p class="font-medium">
                    {$_("dropoff.project.details.place")}:
                </p>
                <p class="text-slate-700 mb-2">
                    {$_("dropoff.project.details.placeValue")}
                </p>
                <p class="text-slate-700 mb-2">
                    <span class="font-medium"
                        >{$_("dropoff.project.details.cost")}:</span
                    >
                    {$_("dropoff.project.details.costValue")}
                </p>
                <p class="text-slate-700">
                    <span class="font-medium"
                        >{$_("dropoff.project.details.capacity")}:</span
                    >
                    {$_("dropoff.project.details.capacityValue")}
                </p>
            </div>
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
                    {$_("dropoff.steps.chooseCourse")}
                </Heading>

                <CoursePicker
                    bind:selectedCourse
                    title={$_("dropoff.coursePicker.title")}
                    courses={dropoffCourses}
                />
            </div>

            <!-- choose a date -->
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700"
                >
                    {$_("dropoff.steps.chooseDate")}
                </Heading>
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p class="font-medium text-blue-800">
                        {$_("dropoff.selectedCourse")}:
                    </p>
                    <p class="text-sm text-blue-700">
                        {activeCourse?.title || "-"} ({activeCourse?.price ||
                            "-"})
                    </p>
                </div>

                <DatePicker
                    bind:selectedDate
                    bind:dateSelected
                    showTimePicker={false}
                    context="child-care"
                />
                <div class="mt-4 text-center">
                    <p class="font-medium text-slate-700">
                        {$_("dropoff.fixedTime")}
                    </p>
                </div>
            </div>

            <!-- enter info -->
        {:else if currentStep === 3}
            <div in:fly={{ y: 50, duration: 300 }} class="flex flex-col w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700 w-full"
                >
                    {$_("dropoff.steps.enterInfo")}
                </Heading>
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p class="font-medium text-blue-800">
                        {$_("dropoff.appointment")}:
                    </p>
                    <p class="text-sm text-blue-700">
                        {activeCourse?.title || "-"} - {selectedDate?.toLocaleDateString() ||
                            "-"} 17:00-21:30
                    </p>
                </div>

                <InfoForm
                    bind:name
                    bind:email
                    bind:phone
                    bind:paymentMethod
                    requirePhone={true}
                    isEmail={false}
                />

                <!-- Number of children selector -->
                <div class="mb-6">
                    <label class="mb-2 block text-slate-700">
                        {$_("dropoff.childCount")}
                    </label>
                    <div class="flex gap-4">
                        {#each [1, 2, 3] as count}
                            <Radio
                                name="childCount"
                                value={count}
                                bind:group={childCount}
                            >
                                {count}
                                {count === 1
                                    ? $_("dropoff.child")
                                    : $_("dropoff.children")}
                            </Radio>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- confirm -->
        {:else if currentStep === 4}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <ConfirmationScreen
                    {selectedDate}
                    selectedTimeSlot="17:00 - 21:30"
                    {name}
                    {email}
                    {phone}
                    {paymentMethod}
                    showAddress={false}
                    coursePrice={activeCourse?.price}
                    course={activeCourse?.title}
                    {childCount}
                    confirmationText={$_("dropoff.confirmation.title")}
                    detailsText={$_("dropoff.confirmation.details")}
                    paymentInstructionsText={$_(
                        "dropoff.confirmation.paymentInstructions",
                    )}
                    cashInstructionsText={$_(
                        "dropoff.confirmation.cashInstructions",
                    )}
                    creditInstructionsText={$_(
                        "dropoff.confirmation.creditInstructions",
                    )}
                />
            </div>
        {:else if currentStep === 5}
            <SuccessCard
                {selectedDate}
                selectedTimeSlot="17:00 - 21:30"
                {name}
                {email}
                {phone}
                {paymentMethod}
                coursePrice={activeCourse?.price}
                course={activeCourse?.title}
                {childCount}
                title={$_("dropoff.success.title")}
                successMessage={$_("dropoff.success.message")}
            />
        {/if}

        {#if currentStep <= 4}
            <div
                class="flex gap-8 w-full items-center justify-center px-2 md:px-32"
            >
                <Button
                    color="primary"
                    onclick={prevStep}
                    disabled={currentStep <= 1}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    <ArrowLeftOutline class="me-2 h-5 w-5" />
                    {$_("dropoff.buttons.previous")}
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
                            ? $_("dropoff.buttons.complete")
                            : $_("dropoff.buttons.next")}
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
