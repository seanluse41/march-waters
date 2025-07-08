<script>
    import { Heading, Button } from "flowbite-svelte";
    import { CheckCircleSolid, HomeOutline } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import { _ } from "svelte-i18n";

    let {
        selectedDate,
        selectedTimeSlot,
        name,
        email,
        phone,
        paymentMethod = "credit",
        course = "",
        coursePrice = "",
        childCount = null,
        // Text props
        title = "",
        successMessage = "",
        nextStepsText = "",
    } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
    <div class="text-center mb-6">
        <CheckCircleSolid class="h-16 w-16 text-green-500 mx-auto mb-4" />
        <Heading class="text-4xl font-bold text-slate-700">
            {title}
        </Heading>
        <p class="text-green-600 font-medium mt-2">
            {successMessage}
        </p>
    </div>

    <div class="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <p class="font-medium text-slate-800 mb-4">
            {$_("confirmationscreen.details")}
        </p>
        <div class="space-y-3 text-slate-700">
            {#if course}
                <p>
                    <span class="font-semibold">{$_("confirmationscreen.course")}:</span>
                    {course}
                </p>
            {/if}
            {#if selectedDate}
                <p>
                    <span class="font-semibold">{$_("confirmationscreen.date")}:</span>
                    {selectedDate?.toLocaleDateString()}
                </p>
            {/if}
            <p>
                <span class="font-semibold">{$_("confirmationscreen.time")}:</span>
                {selectedTimeSlot}
            </p>
            {#if childCount}
                <p>
                    <span class="font-semibold">{$_("confirmationscreen.childCount")}:</span>
                    {childCount}
                    {$_("helpers.personCounter")}
                </p>
            {/if}
            <p>
                <span class="font-semibold">{$_("confirmationscreen.name")}:</span>
                {name}
            </p>
            <p>
                <span class="font-semibold">{$_("confirmationscreen.email")}:</span>
                {email}
            </p>
            <p>
                <span class="font-semibold">{$_("confirmationscreen.phone")}:</span>
                {phone}
            </p>
            {#if paymentMethod}
                <p>
                    <span class="font-semibold">{$_("confirmationscreen.paymentMethod")}:</span>
                    {$_(`payment.${paymentMethod}`)}
                </p>
            {/if}
            {#if coursePrice}
                <p>
                    <span class="font-semibold">{$_("confirmationscreen.amountDue")}:</span>
                    <span class="font-bold text-blue-600">{coursePrice}</span>
                </p>
            {/if}
        </div>
    </div>

    <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <p class="font-medium text-blue-800 mb-2">
            {nextStepsText}
        </p>
    </div>

    <div class="text-center">
        <Button href="/" color="blue" class="inline-flex items-center">
            <HomeOutline class="me-2 h-5 w-5" />
            {$_("success.returnHome")}
        </Button>
    </div>
</div>