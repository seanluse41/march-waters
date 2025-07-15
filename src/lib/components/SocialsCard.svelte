<script>
  import { _ } from "svelte-i18n";
  import ServiceArea from "$lib/components/ServiceArea.svelte";
  import {
    NewspaperOutline,
    EnvelopeOutline,
    InstagramSolid
  } from "flowbite-svelte-icons";
    import { Card } from "flowbite-svelte";

  let socials = $state([
    {
      name: "instagram",
      icon: InstagramSolid,
      url: "https://www.instagram.com/marchwatersss/",
      handle: "@marchwatersss",
    },
    {
      name: "note",
      icon: NewspaperOutline,
      url: "https://note.com/kind_phlox908",
      handle: $_("top.socials.note.handle"),
    },
    {
      name: "mail",
      icon: EnvelopeOutline,
      url: "/contact",
      handle: $_("top.socials.mail.handle"),
    },
  ]);
</script>

<Card color="primary" class="p-8 border-0 bg-white max-w-none">
  <h2 class="text-2xl font-bold mb-4">{$_("top.socials.heading")}</h2>
  <div class="flex flex-col md:flex-row gap-8">
    <div class="w-full md:w-2/3">
      <p class="text-lg">{$_("top.socials.text")}</p>

      <!-- Goals Section -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold">{$_("top.socials.goals.heading")}</h3>
        <ul class="mt-2 space-y-2">
          <li class="flex items-start">
            <span class="mr-2">・</span>
            <span>{$_("top.socials.goals.1")}</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">・</span>
            <span>{$_("top.socials.goals.2")}</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">・</span>
            <span>{$_("top.socials.goals.3")}</span>
          </li>
        </ul>
      </div>

      <!-- Ideals Section -->
      <div class="mt-4">
        <h1 class="text-lg font-semibold">
          {$_("top.socials.ideals.heading")}
        </h1>
        <ul class="mt-2 space-y-2">
          <li class="flex items-start">
            <span class="mr-2">・</span>

            <span>{$_("top.socials.ideals.1")}</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">・</span>

            <span>{$_("top.socials.ideals.2")}</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">・</span>

            <span>{$_("top.socials.ideals.3")}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col space-y-3 w-full md:w-1/2">
      {#each socials as social}
      {@const Icon = social.icon}
        <a
          href={social.url}
          class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-4"
          >
            <Icon
              class="w-5 h-5 text-gray-700"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-sm"
              >{$_(`top.socials.${social.name}.title`)}</span
            >
            <span class="text-xs text-gray-500">{social.handle}</span>
          </div>
        </a>
      {/each}
      <ServiceArea />
    </div>
  </div>
</Card>
