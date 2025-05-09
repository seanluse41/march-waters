<script>
    import { Heading } from "flowbite-svelte";
    import { fly } from "svelte/transition";
    import { _ } from "svelte-i18n";

    let { 
        selectedDate,
        selectedTimeSlot,
        name,
        email,
        phone, 
        paymentMethod = "cash",
        course = "",
        coursePrice = ""
    } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
    <Heading class="text-4xl font-bold my-8 text-slate-700">
        {$_("childcare.confirmation.title")}
    </Heading>
    <div class="bg-white p-6 rounded-lg border border-slate-200 mb-8">
        <p class="font-medium text-slate-800 mb-4">{$_("childcare.confirmation.details")}</p>
        <div class="space-y-3 text-slate-700">
            {#if course}
                <p><span class="font-semibold">{$_("confirmation.course")}:</span> {$_(`midwife.coursePicker.${course}.title`, { default: course })}</p>
            {/if}
            {#if selectedDate}
                <p><span class="font-semibold">{$_("childcare.confirmation.date")}:</span> {selectedDate?.toLocaleDateString()}</p>
            {/if}
            <p><span class="font-semibold">{$_("childcare.confirmation.time")}:</span> {selectedTimeSlot}</p>
            <p><span class="font-semibold">{$_("childcare.confirmation.name")}:</span> {name}</p>
            <p><span class="font-semibold">{$_("childcare.confirmation.email")}:</span> {email}</p>
            <p><span class="font-semibold">{$_("childcare.confirmation.phone")}:</span> {phone}</p>
            <p><span class="font-semibold">{$_("childcare.confirmation.paymentMethod")}:</span> {$_(`payment.${paymentMethod}`, { default: paymentMethod })}</p>
        </div>
    </div>

    <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <p class="font-medium text-blue-800 mb-4">{$_("childcare.confirmation.paymentInstructions")}</p>
        {#if paymentMethod === "cash"}
            <div class="text-slate-700">
                <p>{$_("childcare.confirmation.cashInstructions")}</p>
                <p class="mt-2">{$_("childcare.confirmation.amountDue")} <span class="font-bold">{coursePrice || "¥8,000"}</span></p>
            </div>
        {:else if paymentMethod === "credit"}
            <div class="text-slate-700">
                <p>{$_("childcare.confirmation.creditInstructions")}</p>
                <p class="mt-2">{$_("childcare.confirmation.amountCharged")} <span class="font-bold">{coursePrice || "¥8,000"}</span></p>
            </div>
        {/if}
    </div>
</div>