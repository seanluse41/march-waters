<script>
    import { Heading, P, Card, Label, Input, Textarea, Helper, Checkbox, Button } from "flowbite-svelte";
    import { EnvelopeSolid, PhoneSolid, UserSolid } from "flowbite-svelte-icons";
    import { enhance } from '$app/forms';
  
    // Form data
    let { form } = $props(); // Access form data returned by the action
  
    // Reason for contact checkboxes - just need this one for the UI toggle
    let reasons = $state({
      other: false
    });
    
    // Function to handle the enhance progressive enhancement
    function handleEnhance() {
      return async ({ update }) => {
        // Wait for the form action to complete and update the form data
        await update();
        
        // Log to client console for debugging
        console.log('Form submitted via enhance!');
      };
    }
  </script>
  
  <Card color="primary" class="p-8 bg-white max-w-none">
    <form method="POST" use:enhance={handleEnhance}>
      <Heading class="mb-6 text-slate-700">
        Contact Us
      </Heading>
      
      {#if form?.success}
        <div class="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50">
          <span class="font-medium">Success!</span> Your message has been sent.
        </div>
      {/if}
      
      <!-- Name Field -->
      <div class="mb-6">
        <Label for="name" class="mb-2 block text-slate-700">Your Name</Label>
        <Input id="name" name="name" type="text" class="pl-10">
          {#snippet left()}
            <UserSolid class="h-5 w-5 text-slate-700" />
          {/snippet}
        </Input>
      </div>
      
      <!-- Email Field -->
      <div class="mb-6">
        <Label for="email" class="mb-2 block text-slate-700">Your Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" class="pl-10">
          {#snippet left()}
            <EnvelopeSolid class="h-5 w-5 text-slate-700" />
          {/snippet}
        </Input>
      </div>
      
      <!-- Phone Field -->
      <div class="mb-6">
        <Label for="phone" class="mb-2 block text-slate-700">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+81 90-1234-5678" class="pl-10">
          {#snippet left()}
            <PhoneSolid class="h-5 w-5 text-slate-700" />
          {/snippet}
        </Input>
      </div>
      
      <!-- Reason for Contact -->
      <div class="mb-6">
        <p class="mb-4 font-semibold text-slate-700">Reason for Contact</p>
        <div class="flex flex-wrap gap-4">
          <Checkbox inline name="childcare" class="me-2">Childcare Service</Checkbox>
          <Checkbox inline name="bodyChoice" class="me-2">My Body My Choice Project</Checkbox>
          <Checkbox inline name="midwife" class="me-2">Talk with a Midwife</Checkbox>
          <Checkbox inline name="event" class="me-2">Book for Event</Checkbox>
          <Checkbox inline name="other" bind:checked={reasons.other} class="me-2">Other</Checkbox>
        </div>
        {#if reasons.other}
          <div class="mt-2">
            <Input 
              name="otherReason"
              type="text" 
              placeholder="Please specify" 
            />
          </div>
        {/if}
      </div>
      
      <!-- Message Field -->
      <div class="mb-6">
        <Label for="message" class="mb-2 block text-slate-700">Your Message</Label>
        <Textarea 
          id="message" 
          name="message"
          placeholder="Your message or additional notes" 
          rows={4}
        />
      </div>
      
      <!-- Submit Button -->
      <div class="flex justify-end">
        <Button type="submit" color="blue">Submit</Button>
      </div>
    </form>
  </Card>