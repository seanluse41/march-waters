<script>
    import { Heading, Button } from "flowbite-svelte";
    import { CheckCircleSolid, HomeOutline } from "flowbite-svelte-icons";
    import { fly } from "svelte/transition";
    import { _ } from "svelte-i18n";

    let {
        name,
        email,
        phone,
        preferredDate,
        notes
    } = $props();
</script>

<div in:fly={{ y: 50, duration: 300 }}>
    <div class="text-center mb-6">
        <CheckCircleSolid class="h-16 w-16 text-green-500 mx-auto mb-4" />
        <Heading class="text-4xl font-bold text-slate-700">
            {$_("bodychoice.success.title")}
        </Heading>
        <p class="text-green-600 font-medium mt-2">
            {$_("bodychoice.success.message")}
        </p>
    </div>

    <div class="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <p class="font-medium text-slate-800 mb-4">
            {$_("bodychoice.success.details")}
        </p>
        <div class="space-y-3 text-slate-700">
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
            {#if preferredDate}
                <p>
                    <span class="font-semibold">{$_("bodychoice.form.preferredDate")}:</span>
                    {preferredDate.toLocaleDateString()}
                </p>
            {/if}
            {#if notes?.trim()}
                <div>
                    <p class="font-semibold">{$_("bodychoice.form.notes")}:</p>
                    <p class="whitespace-pre-wrap pl-4 mt-1">{notes}</p>
                </div>
            {/if}
        </div>
    </div>

    <div class="text-center">
        <Button href="/" color="blue" class="inline-flex items-center">
            <HomeOutline class="me-2 h-5 w-5" />
            {$_("success.returnHome")}
        </Button>
    </div>
</div>