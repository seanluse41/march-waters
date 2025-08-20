<!-- src/routes/contact/+page.svelte -->
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
    Spinner,
  } from "flowbite-svelte";
  import {
    EnvelopeSolid,
    PhoneSolid,
    UserSolid,
    HomeOutline,
  } from "flowbite-svelte-icons";
  import { enhance } from "$app/forms";
  import { _ } from "svelte-i18n";

  // Form data
  let { form } = $props(); // Access form data returned by the action
  let isSubmitting = $state(false);
  let success = $state(false);

  let reasons = $state({
    other: false,
  });

  // Function to handle the enhance progressive enhancement
  function handleEnhance() {
    isSubmitting = true;
    return async ({ update }) => {
      try {
        // Wait for the form action to complete and update the form data
        await update();
        console.log("Form submitted via enhance!");
        success = true;
      } finally {
        isSubmitting = false;
      }
    };
  }
</script>

{#if isSubmitting}
  <div
    class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg"
  >
    <div class="text-center">
      <Spinner size="8" />
      <p class="mt-4 text-slate-700 font-medium">送信中...</p>
    </div>
  </div>
{/if}

<Card color="primary" class="p-8 bg-white max-w-none relative">
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
      <Input
        id="name"
        name="name"
        type="text"
        class="pl-10"
        disabled={isSubmitting}
      >
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
        disabled={isSubmitting}
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
        disabled={isSubmitting}
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
        <Checkbox inline name="childcare" class="me-2" disabled={isSubmitting}
          >{$_("nav.childcare")}</Checkbox
        >
        <Checkbox inline name="bodyChoice" class="me-2" disabled={isSubmitting}
          >{$_("nav.speak")}</Checkbox
        >
        <Checkbox inline name="midwife" class="me-2" disabled={isSubmitting}
          >{$_("nav.consult")}</Checkbox
        >
        <Checkbox inline name="event" class="me-2" disabled={isSubmitting}
          >{$_("contact.form.event")}</Checkbox
        >
        <Checkbox
          inline
          name="other"
          bind:checked={reasons.other}
          class="me-2"
          disabled={isSubmitting}>{$_("contact.form.other")}</Checkbox
        >
      </div>
      {#if reasons.other}
        <div class="mt-2">
          <Input
            name="otherReason"
            type="text"
            placeholder={$_("contact.form.otherPlaceholder")}
            disabled={isSubmitting}
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
        disabled={isSubmitting}
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      {#if success}
        <Button href="/" color="blue" class="inline-flex items-center">
          <HomeOutline class="me-2 h-5 w-5" />
          {$_("success.returnHome")}
        </Button>
      {:else}
        <Button type="submit" color="blue" disabled={isSubmitting}>
          {$_("contact.form.submit")}
        </Button>
      {/if}
    </div>
  </form>
</Card>
