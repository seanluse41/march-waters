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
        coursePrice = "",
        childCount = null,
        // Address props
        showAddress = false,
        address = "",
        // Text props
        title = "",
        detailsText = "",
        paymentInstructionsText = "",
        cashInstructionsText = "",
        creditInstructionsText = "",
    } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
    <Heading class="text-4xl font-bold my-8 text-slate-700 text-center">
        {title}
    </Heading>
    <div class="bg-white p-6 rounded-lg border border-slate-200 mb-8">
        <p class="font-medium text-slate-800 mb-4">
            {detailsText}
        </p>
        <div class="space-y-3 text-slate-700">
            {#if course}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.course")}:</span
                    >
                    {course}
                </p>
            {/if}
            {#if selectedDate}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.date")}:</span
                    >
                    {selectedDate?.toLocaleDateString()}
                </p>
            {/if}
            {#if selectedTimeSlot && selectedTimeSlot !== "TBD" && selectedTimeSlot !== "N/A"}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.time")}:</span
                    >
                    {selectedTimeSlot}
                </p>
            {/if}
            {#if childCount}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.childCount")}:</span
                    >
                    {childCount}
                    {$_("helpers.personCounter")}
                </p>
            {/if}
            <p>
                <span class="font-semibold"
                    >{$_("confirmationscreen.name")}:</span
                >
                {name}
            </p>
            <p>
                <span class="font-semibold"
                    >{$_("confirmationscreen.email")}:</span
                >
                {email}
            </p>
            <p>
                <span class="font-semibold"
                    >{$_("confirmationscreen.phone")}:</span
                >
                {phone}
            </p>
            {#if showAddress && address}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.address")}:</span
                    >
                    {address}
                </p>
            {/if}
            {#if paymentMethod}
                <p>
                    <span class="font-semibold"
                        >{$_("confirmationscreen.paymentMethod")}:</span
                    >
                    {$_(`payment.${paymentMethod}`)}
                </p>
            {/if}
        </div>
    </div>

    <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <p class="font-medium text-blue-800">
            {paymentInstructionsText}
        </p>
        {#if paymentMethod === "cash"}
            <div class="text-slate-700">
                <p>{cashInstructionsText}</p>
                <p class="mt-2">
                    {$_("confirmationscreen.amountDue")}
                    <span class="font-bold">{coursePrice}</span>
                </p>
            </div>
        {:else if paymentMethod === "credit"}
            <div class="text-slate-700">
                <p>{creditInstructionsText}</p>
                <p class="mt-2">
                    {$_("confirmationscreen.amountCharged")}
                    <span class="font-bold">{coursePrice}</span>
                </p>
            </div>
        {/if}
    </div>
</div>
