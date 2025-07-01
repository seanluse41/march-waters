<script>
  import {
    Heading,
    P,
    Card,
    Label,
    Input,
    Textarea,
    Helper,
    Checkbox,
    Button,
  } from "flowbite-svelte";
  import { EnvelopeSolid, PhoneSolid, UserSolid } from "flowbite-svelte-icons";
  import { enhance } from "$app/forms";
  import { _ } from "svelte-i18n";

  // Form data
  let { form } = $props(); // Access form data returned by the action

  // Reason for contact checkboxes - just need this one for the UI toggle
  let reasons = $state({
    other: false,
  });

  // Function to handle the enhance progressive enhancement
  function handleEnhance() {
    return async ({ update }) => {
      // Wait for the form action to complete and update the form data
      await update();

      // Log to client console for debugging
      console.log("Form submitted via enhance!");
    };
  }
</script>

<Card color="primary" class="p-8 bg-white max-w-none">
  <form method="POST" use:enhance={handleEnhance}>
    <Heading class="mb-6 text-slate-700">
      {$_("contact.heading")}
    </Heading>

    <!-- Honeypot field - hidden from users -->
    <div
      style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;"
      aria-hidden="true"
    >
      <label for="dinner">I would like dinner information</label>
      <input
        id="dinner"
        name="dinner"
        type="checkbox"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    {#if form?.success}
      <div class="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50">
        <span class="font-medium">{$_("contact.success.title")}</span>
        {$_("contact.success.message")}
      </div>
    {/if}

    <!-- Name Field -->
    <div class="mb-6">
      <Label for="name" class="mb-2 block text-slate-700"
        >{$_("contact.form.name")}</Label
      >
      <Input id="name" name="name" type="text" class="pl-10">
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
        name="email"
        type="email"
        placeholder={$_("contact.form.emailPlaceholder")}
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
        name="phone"
        type="tel"
        placeholder={$_("contact.form.phonePlaceholder")}
        class="pl-10"
      >
        {#snippet left()}
          <PhoneSolid class="h-5 w-5 text-slate-700" />
        {/snippet}
      </Input>
    </div>

    <!-- Reason for Contact -->
    <div class="mb-6">
      <p class="mb-4 font-semibold text-slate-700">
        {$_("contact.form.reasonHeading")}
      </p>
      <div class="flex flex-wrap gap-4">
        <Checkbox inline name="childcare" class="me-2"
          >{$_("nav.childcare")}</Checkbox
        >
        <Checkbox inline name="bodyChoice" class="me-2"
          >{$_("nav.speak")}</Checkbox
        >
        <Checkbox inline name="midwife" class="me-2"
          >{$_("nav.consult")}</Checkbox
        >
        <Checkbox inline name="event" class="me-2"
          >{$_("contact.form.event")}</Checkbox
        >
        <Checkbox inline name="other" bind:checked={reasons.other} class="me-2"
          >{$_("contact.form.other")}</Checkbox
        >
      </div>
      {#if reasons.other}
        <div class="mt-2">
          <Input
            name="otherReason"
            type="text"
            placeholder={$_("contact.form.otherPlaceholder")}
          />
        </div>
      {/if}
    </div>

    <!-- Message Field -->
    <div class="mb-6">
      <Label for="message" class="mb-2 block text-slate-700"
        >{$_("contact.form.message")}</Label
      >
      <Textarea
        id="message"
        name="message"
        placeholder={$_("contact.form.messagePlaceholder")}
        rows={4}
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <Button type="submit" color="blue">{$_("contact.form.submit")}</Button>
    </div>
  </form>
</Card>
