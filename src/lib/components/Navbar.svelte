<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Button,
  } from "flowbite-svelte";
  import LogoAnimation from "$lib/components/LogoAnimation.svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";
  import { _ } from "svelte-i18n";
  import { page } from "$app/state";
    import LanguageButton from "./LanguageButton.svelte";
  let activeUrl = $derived(page.url.pathname);

  let loggedIn = $state(true);
</script>

<div id="top">
  <Navbar class="bg-blue-300 p-1 border-b border-slate-700">
    <NavBrand href="/">
      <LogoAnimation />
      <span class="font-sofia text-2xl md:text-3xl">March Waters</span>
    </NavBrand>
    <div class="flex md:order-2">
      <NavHamburger class="m-0" />
      <LanguageButton />
    </div>
    <NavUl>
      <NavLi class="text-lg md:text-xl" href="/about">{$_("nav.about")}</NavLi>
      {#if !loggedIn}
        <NavLi class="text-lg md:text-xl" href="/register"
          >{$_("nav.register")}</NavLi
        >
        <NavLi class="text-lg md:text-xl" href="/login">{$_("nav.login")}</NavLi
        >
      {:else}
        <NavLi class="text-lg md:text-xl" href="/account"
          >{$_("nav.account")}</NavLi
        >
        <NavLi class="text-lg md:text-xl" href="/logout"
          >{$_("nav.logout")}</NavLi
        >
      {/if}
      <NavLi class="text-lg md:text-xl" href="/events">{$_("nav.events")}</NavLi
      >
      <NavLi class="text-lg md:text-xl cursor-pointer">
        {$_("nav.legal")}<ChevronDownOutline class="w-6 h-6 ms-2 inline" />
      </NavLi>
      <Dropdown class="w-44">
        <DropdownItem class="text-lg md:text-xl" href="/terms"
          >{$_("nav.terms")}</DropdownItem
        >
        <DropdownItem class="text-lg md:text-xl" href="/privacy"
          >{$_("nav.privacy")}</DropdownItem
        >
        <DropdownItem class="text-lg md:text-xl" href="/commerce-disclosure"
          >{$_("nav.commerceDisclosure")}</DropdownItem
        >
      </Dropdown>
    </NavUl>
  </Navbar>
</div>
