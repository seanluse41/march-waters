<script>
    import { Datepicker, P } from "flowbite-svelte";
    let selectedDate = $state(undefined);
</script>

<div class="md:w-1/2">
    <Datepicker inline bind:value={selectedDate} />
    <p class="mt-4"
        >Selected date: {selectedDate
            ? selectedDate.toLocaleDateString()
            : "None"}</p
    >
</div>
