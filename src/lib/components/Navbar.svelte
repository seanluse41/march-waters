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
  import { ChevronDownOutline, LanguageOutline } from "flowbite-svelte-icons";
  import { _, locale } from "svelte-i18n";
  import { page } from "$app/state";
    import { onMount } from "svelte";
  let activeUrl = $derived(page.url.pathname);
  let currentLocale = $state();
  onMount(() => {
    currentLocale = window.navigator.language
  })

  const changeLocale = () => {
    console.log("clicked")
    console.log(currentLocale)
    if (currentLocale == "en-US") {
      locale.set("ja");
      currentLocale = "ja-JP";
    } else if (currentLocale == "ja-JP") {
      locale.set("en");
      currentLocale = "en-US";
    }
  };

  let loggedIn = $state(true);
</script>

<div id="top">
  <Navbar class="bg-blue-300 p-1 border-b border-slate-700">
    <NavBrand href="/">
      <LogoAnimation />
      <span class="font-sofia text-2xl md:text-3xl">March Waters</span>
    </NavBrand>
    <div class="flex md:order-2">
      <Button class="focus:ring-0 focus:bg-blue-400 bg-blue-400 border hover:bg-blue-500" onclick={changeLocale} size="sm">
        <LanguageOutline class="w-6 h-6 text-white" />
      </Button>
      <NavHamburger />
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
