<script>
    import { Label, Input, Textarea, Button, Radio } from "flowbite-svelte";
    import {
        EnvelopeSolid,
        PhoneSolid,
        UserSolid,
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";

    // Props
    let { onNext = () => {}, onBack = () => {} } = $props();

    // Form data binding
    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let message = $state("");
    let paymentMethod = $state("cash");

    function handleSubmit() {
        // Here you would typically validate the form data
        // For now, we'll just call the onNext function
        onNext();
    }
</script>

<form onsubmit={handleSubmit} class="w-full">
    
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
        <Label for="email" class="mb-2 block text-slate-700"
            >{$_("contact.form.email")}</Label
        >
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
        <Label for="phone" class="mb-2 block text-slate-700"
            >{$_("contact.form.phone")}</Label
        >
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

    <!-- Message Field -->
    <div class="mb-6">
        <Label for="message" class="mb-2 block text-slate-700"
            >{$_("contact.form.message")}</Label
        >
        <Textarea
            id="message"
            bind:value={message}
            placeholder={$_("contact.form.messagePlaceholder")}
            rows={3}
        />
    </div>

    <!-- Payment Method -->
    <div class="mb-6">
        <Label class="mb-2 block text-slate-700">Payment Method</Label>
        <div class="flex items-center gap-4">
            <Radio name="payment" value="cash" bind:group={paymentMethod}
                >Cash</Radio
            >
            <Radio name="payment" value="credit" bind:group={paymentMethod}
                >Credit Card</Radio
            >
        </div>
    </div>
</form>
