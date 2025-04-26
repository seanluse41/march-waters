<script>
    import { _, locale } from "svelte-i18n";
    import {
      Navbar,
      NavBrand,
      NavLi,
      NavUl,
      NavHamburger,
      Button,
      Dropdown,
      DropdownItem,
    } from "flowbite-svelte";
    import { LanguageOutline, ChevronDownOutline } from "flowbite-svelte-icons";
    import LogoAnimation from "$lib/components/LogoAnimation.svelte";
    
    let currentLocale = $state("en");
    let loggedIn = $state(false);
    let hamburgerMenuHidden = $state(true);
  
    const toggleHamburgerMenu = () => {
      hamburgerMenuHidden = !hamburgerMenuHidden;
    };
  
    const changeLocale = () => {
      if (currentLocale == "en") {
        locale.set("ja");
        currentLocale = "ja";
      } else if (currentLocale == "ja") {
        locale.set("en");
        currentLocale = "en";
      }
    };
  </script>
  
  <div class="flex" id="top">
    <Navbar class="p-0 fixed w-full z-20 border-b border-stone-700">
      <NavBrand href="/" class="font-bold">
        <LogoAnimation /> March Waters
      </NavBrand>
      <div class="flex md:order-2">
        <Button class="focus:ring-0" on:click={changeLocale} size="sm">
          <LanguageOutline class="w-6 h-6 text-stone-800 hover:text-rojo" />
        </Button>
        <NavHamburger class="hover:bg-inherit" onClick={toggleHamburgerMenu} />
      </div>
      <NavUl ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium items-center" hidden={hamburgerMenuHidden}>
        <NavLi class="text-stone-800" href="/about">{$_("nav.about")}</NavLi>
        {#if !loggedIn}
          <NavLi class="text-stone-800" href="/register">{$_("nav.register")}</NavLi>
          <NavLi class="text-stone-800" href="/login">{$_("nav.login")}</NavLi>
        {:else}
          <NavLi class="text-stone-800" href="/account">{$_("nav.account")}</NavLi>
          <NavLi class="text-stone-800" href="/logout">{$_("nav.logout")}</NavLi>
        {/if}
        <NavLi class="text-stone-800" href="/events">{$_("nav.events")}</NavLi>
        <NavLi class="cursor-pointer text-stone-800">
          {$_("nav.legal")}<ChevronDownOutline
            class="w-6 h-6 ms-2 text-stone-800 inline"
          />
        </NavLi>
        <Dropdown class="w-44 z-20">
          <DropdownItem class="text-stone-800" href="/terms">{$_("nav.terms")}</DropdownItem>
          <DropdownItem class="text-stone-800" href="/privacy">{$_("nav.privacy")}</DropdownItem>
          <DropdownItem class="text-stone-800" href="/commerce-disclosure">{$_("nav.commerceDisclosure")}</DropdownItem>
        </Dropdown>
      </NavUl>
    </Navbar>
  </div>