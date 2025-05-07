<script>
    import { Label, Input, Textarea, Button, Radio } from "flowbite-svelte";
    import {
        EnvelopeSolid,
        PhoneSolid,
        UserSolid,
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    // Props with two-way binding for form validation
    let { 
        name = $bindable(""),
        email = $bindable(""),
        phone = $bindable(""),
        paymentMethod = $bindable("cash")
    } = $props();

    function handleSubmit(event) {
        event.preventDefault();
    }
</script>

<form onsubmit={handleSubmit} class="w-full">
    <!-- Name Field -->
    <div class="mb-6">
        <Label for="name" class="mb-2 block text-slate-700">{$_("contact.form.name")}</Label>
        <Input 
            id="name" 
            bind:value={name} 
            type="text" 
            required 
            class="pl-10"
        >
            {#snippet left()}
                <UserSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
    </div>

    <!-- Email Field -->
    <div class="mb-6">
        <Label for="email" class="mb-2 block text-slate-700">{$_("contact.form.email")}</Label>
        <Input
            id="email"
            bind:value={email}
            type="email"
            placeholder={$_("contact.form.emailPlaceholder")}
            required
            class="pl-10"
        >
            {#snippet left()}
                <EnvelopeSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
    </div>

    <!-- Phone Field -->
    <div class="mb-6">
        <Label for="phone" class="mb-2 block text-slate-700">{$_("contact.form.phone")}</Label>
        <Input
            id="phone"
            bind:value={phone}
            type="tel"
            placeholder={$_("contact.form.phonePlaceholder")}
            required
            class="pl-10"
        >
            {#snippet left()}
                <PhoneSolid class="h-5 w-5 text-slate-700" />
            {/snippet}
        </Input>
    </div>

    <!-- Payment Method -->
    <div class="mb-6">
        <Label class="mb-2 block text-slate-700">{$_("childcare.confirmation.paymentMethod")}</Label>
        <div class="flex items-center gap-4">
            <Radio id="cash" name="payment" value="cash" bind:group={paymentMethod}>
                {$_("payment.cash", { default: "Cash" })}
            </Radio>
            <Radio id="credit" name="payment" value="credit" bind:group={paymentMethod}>
                {$_("payment.credit", { default: "Credit Card" })}
            </Radio>
        </div>
    </div>
</form>