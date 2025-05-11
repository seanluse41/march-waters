<script>
    import { Timeline, TimelineItem } from "flowbite-svelte";
    import {
        CalendarEditSolid,
        UserEditSolid,
        ClipboardCheckSolid,
        BadgeCheckSolid,
        
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    let { currentStep = 1, totalSteps = 3 } = $props();

    // Define which steps to show
    let steps = $derived(() => {
        if (totalSteps === 4) {
            return [
                { 
                    key: "chooseCourse", 
                    icon: null, 
                    title: $_("midwife.steps.chooseCourse", { default: "Choose Course" }),
                    description: $_("midwife.steps.chooseCourseDescription", { default: "Select your consultation type" })
                },
                { 
                    key: "chooseDate", 
                    icon: CalendarEditSolid, 
                    title: $_("timeline.step1.title"),
                    description: $_("timeline.step1.description")
                },
                { 
                    key: "enterInfo", 
                    icon: UserEditSolid, 
                    title: $_("timeline.step2.title"),
                    description: $_("timeline.step2.description")
                },
                { 
                    key: "confirm", 
                    icon: ClipboardCheckSolid, 
                    title: $_("timeline.step3.title"),
                    description: $_("timeline.step3.description")
                }
            ];
        } else {
            return [
                { 
                    key: "chooseDate", 
                    icon: CalendarEditSolid, 
                    title: $_("timeline.step1.title"),
                    description: $_("timeline.step1.description")
                },
                { 
                    key: "enterInfo", 
                    icon: UserEditSolid, 
                    title: $_("timeline.step2.title"),
                    description: $_("timeline.step2.description")
                },
                { 
                    key: "confirm", 
                    icon: ClipboardCheckSolid, 
                    title: $_("timeline.step3.title"),
                    description: $_("timeline.step3.description")
                }
            ];
        }
    });
</script>

<Timeline order="horizontal">
    {#each steps as step, index}
    {@const Icon = step.icon}
        <TimelineItem title={step.title} liClass="w-full">
            {#snippet orientationSlot()}
                <div class="flex items-center">
                    {#if currentStep > index + 1}
                        <div
                            class="z-10 bg-green-500 flex h-10 w-12 items-center justify-center rounded-full my-2"
                        >
                            <BadgeCheckSolid class="text-white h-6 w-6" />
                        </div>
                    {:else if currentStep === index + 1}
                        <div
                            class="z-10 bg-blue-500 flex h-10 w-12 items-center justify-center rounded-full my-2"
                        >
                            <Icon class="text-white h-6 w-6" />
                        </div>
                    {:else}
                        <div
                            class="z-10 bg-gray-300 flex h-10 w-12 items-center justify-center rounded-full my-2"
                        >
                            <Icon class="text-white h-6 w-6" />
                        </div>
                    {/if}
                    {#if index < steps.length - 1}
                        <div class="hidden h-0.5 w-full bg-gray-200 sm:flex"></div>
                    {/if}
                </div>
            {/snippet}
            <p class="text-slate-700">
                {step.description}
            </p>
        </TimelineItem>
    {/each}
</Timeline>