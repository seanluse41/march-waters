<script>
    import { _ } from "svelte-i18n";
    import { Button, Heading, Hr, List, Li } from "flowbite-svelte";
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
    import CoursePicker from "$lib/components/CoursePicker.svelte";

    // Persistent state
    let selectedDate = $state(null);
    let selectedTimeSlot = $state("");
    let dateSelected = $state(false);

    // Form validation states
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let paymentMethod = $state("cash");
    let selectedCourse = $state("");

    let currentStep = $state(1);

    // Define steps and descriptions
    let steps = [
        $_("midwife.steps.chooseCourse", { default: "Choose Course" }),
        $_("midwife.steps.chooseDate"),
        $_("midwife.steps.enterInfo"),
        $_("midwife.steps.confirm"),
    ];

    let descriptions = [
        $_("midwife.steps.chooseCourseDescription", {
            default: "Select your consultation type",
        }),
        $_("timeline.step1.description"),
        $_("timeline.step2.description"),
        $_("timeline.step3.description"),
    ];

    // Course options
    const midwifeCourses = [
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
            icon: EnvelopeSolid,
        },
    ];

    // Reactive derived state for the active course
    let activeCourse = $derived(
        midwifeCourses.find((c) => c.id === selectedCourse),
    );

    let isFormValid = $derived(
        name.trim() !== "" && email.trim() !== "" && phone.trim() !== "",
    );
    let canProceedFromStep1 = $derived(selectedCourse !== "");
    let canProceedFromStep2 = $derived(dateSelected && selectedTimeSlot !== "");

    function nextStep() {
        if (currentStep === 1 && canProceedFromStep1) {
            currentStep = 2;
        } else if (currentStep === 2 && canProceedFromStep2) {
            currentStep = 3;
        } else if (currentStep === 3 && isFormValid) {
            currentStep = 4;
        } else if (currentStep === 4) {
            // Handle submission and confirmation logic
            console.log("Booking complete!", {
                course: selectedCourse,
                courseName: activeCourse?.title,
                date: selectedDate,
                time: selectedTimeSlot,
                name,
                email,
                phone,
                paymentMethod,
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

            <div class="mt-6 bg-blue-50 p-4 rounded-lg">
                <Heading
                    tag="h3"
                    class="text-lg font-semibold mb-2 text-slate-700"
                >
                    {$_("midwife.project.pricing.title")}
                </Heading>
                <List class="space-y-1">
                    <Li>{$_("midwife.project.pricing.option1")}</Li>
                    <Li>{$_("midwife.project.pricing.option2")}</Li>
                    <Li>{$_("midwife.project.pricing.option3")}</Li>
                </List>
            </div>
        </div>
    </div>
    <div
        class="w-full md:w-1/2 p-4 md:px-10 md:sticky md:top-0 overflow-y-auto flex flex-col items-center"
    >
        <StepProgress {currentStep} {steps} {descriptions} color="blue" />
        <Hr class="mx-auto my-4 h-1 w-48 rounded-sm md:my-10" />

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
        {:else if currentStep === 2}
            <div in:fly={{ y: 50, duration: 300 }} class="w-full">
                <Heading
                    class="text-4xl font-bold my-8 text-center text-slate-700"
                >
                    {$_("midwife.steps.chooseDate")}
                </Heading>
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p class="font-medium text-blue-800">
                        {$_("midwife.selectedCourse")}:
                        <span class="ml-1">{activeCourse?.title || "-"}</span>
                    </p>
                    <p class="text-sm text-blue-700">
                        {activeCourse?.price || "-"} - {activeCourse?.duration ||
                            "-"}
                    </p>
                </div>
                <DatePicker
                    bind:selectedDate
                    bind:selectedTimeSlot
                    bind:dateSelected
                />
            </div>
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
                        {activeCourse?.title || "-"} - {selectedDate?.toLocaleDateString() ||
                            "-"}
                        {selectedTimeSlot || "-"}
                    </p>
                </div>
                <InfoForm bind:name bind:email bind:phone bind:paymentMethod />
            </div>
        {:else if currentStep === 4}
            <div in:fly={{ y: 50, duration: 300 }} class="flex flex-col w-full">
                <ConfirmationScreen
                    {selectedDate}
                    {selectedTimeSlot}
                    {name}
                    {email}
                    {phone}
                    {paymentMethod}
                    coursePrice={activeCourse?.price}
                    course={selectedCourse}
                />
            </div>
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
                            : false}
                    class="mt-8 w-1/2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                >
                    {currentStep === 4
                        ? $_("midwife.buttons.complete")
                        : $_("midwife.buttons.next")}
                    <ArrowRightOutline class="ms-2 h-5 w-5" />
                </Button>
            </div>
        {/if}
    </div>
</div>
