<script>
    import { Label, Input, Radio, P, Helper } from "flowbite-svelte";
    import {
        EnvelopeSolid,
        PhoneSolid,
        UserSolid,
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";
    import { validateEmail } from "$lib/helpers/emailHelpers.js";
    
    let {
        name = $bindable(""),
        email = $bindable(""),
        phone = $bindable(""),
        paymentMethod = $bindable("cash"),
        disableCash,
        disablePayment,
        requirePhone,
        dinner = $bindable(false), // honeypot checkbox
    } = $props();

    // Email validation using helper function
    let emailError = $derived(validateEmail(email));

    function handleSubmit(event) {
        event.preventDefault();
    }
</script>

<form onsubmit={handleSubmit} class="w-full">
    <!-- Honeypot field - hidden checkbox -->
    <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
        <label for="dinner">I would like dinner information</label>
        <input 
            id="dinner" 
            name="dinner" 
            type="checkbox" 
            bind:checked={dinner}
            tabindex="-1"
            autocomplete="off"
        />
    </div>

    <!-- Name Field -->
    <div class="mb-6">
        <Label for="name" class="mb-2 block text-slate-700"
            >{$_("contact.form.name")}</Label
        >
        <Input id="name" bind:value={name} type="text" required class="pl-10">
            {#snippet left()}
                <UserSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
    </div>

    <!-- Email Field -->
    <div class="mb-6">
        <Label 
            for="email" 
            color={emailError ? "red" : undefined}
            class="mb-2 block"
        >
            {$_("contact.form.email")}
        </Label>
        <Input
            id="email"
            bind:value={email}
            type="email"
            placeholder={$_("contact.form.emailPlaceholder")}
            required
            class="pl-10"
            color={emailError ? "red" : undefined}
        >
            {#snippet left()}
                <EnvelopeSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
        {#if emailError}
            <Helper class="mt-2" color="red">
                {emailError}
            </Helper>
        {/if}
    </div>

    <!-- Phone Field -->
    <div class="mb-6">
        <Label for="phone" class="mb-2 block text-slate-700"
            >{$_("contact.form.phone")}</Label
        >
        <Input
            id="phone"
            bind:value={phone}
            type="tel"
            placeholder={$_("contact.form.phonePlaceholder")}
            required={requirePhone}
            class="pl-10"
        >
            {#snippet left()}
                <PhoneSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
    </div>

    <!-- Payment Method -->
    {#if !disablePayment}
        <div class="mb-6">
            <Label class="mb-2 block text-slate-700"
                >{$_("childcare.confirmation.paymentMethod")}</Label
            >
            <div class="flex items-center gap-4">
                <div class="rounded-sm border border-gray-200 px-8 py-4">
                    <Radio
                        disabled={disableCash}
                        id="cash"
                        name="payment"
                        value="cash"
                        color="blue"
                        bind:group={paymentMethod}
                        class="scale-125"
                    >
                        {$_("payment.cash")}
                    </Radio>
                </div>
                <div
                    class="rounded-sm border border-gray-200 px-8 md:px-8 py-4"
                >
                    <Radio
                        id="credit"
                        name="payment"
                        value="credit"
                        color="blue"
                        bind:group={paymentMethod}
                        class="scale-125"
                    >
                        {$_("payment.credit")}
                    </Radio>
                </div>
            </div>
            {#if disableCash}
                <P class="text-red-500 text-sm mt-2">{$_("payment.note")}</P>
            {/if}
        </div>
    {/if}
</form>