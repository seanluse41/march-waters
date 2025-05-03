<script>
    import LorumIspum from "$lib/components/LorumIpsum.svelte";
    import { Button, Heading } from "flowbite-svelte";
    import DatePicker from "../../../lib/components/DatePicker.svelte";
    import StepsTimeline from "../../../lib/components/StepsTimeline.svelte";

    const nextStep = () => {
        console.log("next")
    }
</script>

<div class="flex flex-col md:flex-row w-full md:overflow-hidden">
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:h-screen">
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
        <LorumIspum />
    </div>

    <div
        class="w-full md:w-1/2 p-4 md:p-8 md:sticky md:top-0 overflow-y-auto flex flex-col items-center justify-center"
    >
    <StepsTimeline />

        <h1 class="text-4xl font-bold my-8">
            Make a Reservation
        </h1>
        <DatePicker />
        <Button
            color="primary"
            onclick={nextStep}
            class="mt-8 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 text-white">Next</Button
        >
    </div>
</div>
