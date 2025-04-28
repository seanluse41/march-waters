<script>
  import { onMount, onDestroy } from "svelte";

  import { Dropdown, DropdownItem } from "flowbite-svelte";

  let isOpen = $state(false);
  let highlight;
  let links = [];
  let menu;

  // logged in
  let loggedIn = $state(true);

  // i18n
  import { _ } from "svelte-i18n";

  function toggleMenu() {
    isOpen = !isOpen;

    if (!isOpen) {
      if (highlight) {
        highlight.style = "";
      }
    }
  }

  function handleLinkHover(event) {
    const link = event.currentTarget;
    const w = link.offsetWidth;
    const h = link.offsetHeight;
    const t = link.offsetTop;

    if (highlight) {
      highlight.style.cssText = `transform: translateY(${t}px); width: ${w}px; height: ${h}px`;
    }
  }

  onMount(() => {
    links = Array.from(document.querySelectorAll(".nav-link"));
    links.forEach((link) => {
      link.addEventListener("pointerover", handleLinkHover);
    });
  });

  onDestroy(() => {
    links.forEach((link) => {
      link.removeEventListener("pointerover", handleLinkHover);
    });
  });
</script>

<nav>
  <ul
  bind:this={menu}
    class="fixed inset-0 p-0 m-0 list-none flex flex-col justify-center items-center gap-5 bg-blue-500 transition-[clip-path] duration-500"
    style:clip-path={isOpen
      ? "circle(100% at 50% 50%)"
      : "circle(20px at calc(100vw - 5vw) 31px)"}
  >
    {#if loggedIn}
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/account">{$_("nav.account")}</a
        >
      </li>
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/logout">{$_("nav.logout")}</a
        >
      </li>
    {:else}
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/login">{$_("nav.login")}</a
        >
      </li>
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/register">{$_("nav.register")}</a
        >
      </li>
    {/if}
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
        href="/about">{$_("nav.about")}</a
      >
    </li>
    <!-- <Dropdown class="w-44">
      <DropdownItem class="text-lg md:text-xl" href="/terms"
        >{$_("nav.terms")}</DropdownItem
      >
      <DropdownItem class="text-lg md:text-xl" href="/privacy"
        >{$_("nav.privacy")}</DropdownItem
      >
      <DropdownItem class="text-lg md:text-xl" href="/commerce-disclosure"
        >{$_("nav.commerceDisclosure")}</DropdownItem
      >
    </Dropdown> -->
    <div
      class="absolute top-5 left-[calc(100vw-5vw)] transform -translate-x-1/2 cursor-pointer"
      onclick={toggleMenu}
    >
      <span class="w-3 h-3 block border-2 border-white rounded-full mb-px"
      ></span>
      <span class="w-3 h-3 block border-2 border-white rounded-full mb-px"
      ></span>
      <span class="w-3 h-3 block border-2 border-white rounded-full mb-px"
      ></span>
    </div>
    <div
      bind:this={highlight}
      class="absolute top-0 w-0 h-0 bg-white transition-transform duration-300"
    ></div>
  </ul>
</nav>
