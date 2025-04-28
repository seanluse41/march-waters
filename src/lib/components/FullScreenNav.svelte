<script>
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  let isOpen = $state(false);
  let highlight;
  let links = [];
  let menu;
  let dropdownOpen = $state(false);

  // logged in
  let loggedIn = $state(true);

  function toggleMenu(e) {
    // Prevent event propagation
    e && e.stopPropagation();
    
    isOpen = !isOpen;

    if (!isOpen) {
      if (highlight) {
        highlight.style = "";
      }
      // Also close dropdown when menu closes
      dropdownOpen = false;
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

  function toggleDropdown(event) {
    event.stopPropagation();
    dropdownOpen = !dropdownOpen;
  }

  function handleBackdropClick(event) {
    // Check if the click is on the background (not on navigation items)
    if (event.target === menu) {
      toggleMenu();
    }
  }

  // Handle direct link clicks to close the menu
  function handleLinkClick() {
    toggleMenu();
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
    class="fixed inset-0 p-0 m-0 list-none flex flex-col justify-center items-center gap-5 bg-blue-500 hover:bg-blue-600 transition-[clip-path] duration-500"
    style:clip-path={isOpen
      ? "circle(100% at 50% 50%)"
      : "circle(20px at calc(100vw - 5vw) 31px)"}
    onclick={handleBackdropClick}
  >
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
        href="/"
        onclick={handleLinkClick}>{$_("nav.home")}</a
      >
    </li>
    {#if loggedIn}
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/account"
          onclick={handleLinkClick}>{$_("nav.account")}</a
        >
      </li>
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/logout"
          onclick={handleLinkClick}>{$_("nav.logout")}</a
        >
      </li>
    {:else}
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/login"
          onclick={handleLinkClick}>{$_("nav.login")}</a
        >
      </li>
      <li class="relative z-10 nav-link">
        <a
          class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
          href="/register"
          onclick={handleLinkClick}>{$_("nav.register")}</a
        >
      </li>
    {/if}
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1"
        href="/about"
        onclick={handleLinkClick}>{$_("nav.about")}</a
      >
    </li>
    
    <!-- Custom dropdown implementation -->
    <li class="relative z-10 nav-link">
      <div 
        class="cursor-pointer no-underline text-gray-800 text-lg uppercase font-bold inline-block w-32 p-1 items-center justify-center"
        onclick={toggleDropdown}
      >
        {$_("nav.legal")}
        <svg class="w-6 h-6 ms-2 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {#if dropdownOpen}
        <div class="absolute bg-white shadow-md rounded w-44 z-20">
          <a 
            href="/terms" 
            class="block px-4 py-2 text-lg hover:bg-blue-200 text-gray-800"
            onclick={(e) => { e.stopPropagation(); handleLinkClick(); }}>
            {$_("nav.terms")}
          </a>
          <a 
            href="/privacy" 
            class="block px-4 py-2 text-lg hover:bg-blue-200 text-gray-800"
            onclick={(e) => { e.stopPropagation(); handleLinkClick(); }}>
            {$_("nav.privacy")}
          </a>
          <a 
            href="/commerce-disclosure" 
            class="block px-4 py-2 text-lg hover:bg-blue-200 text-gray-800"
            onclick={(e) => { e.stopPropagation(); handleLinkClick(); }}>
            {$_("nav.commerceDisclosure")}
          </a>
        </div>
      {/if}
    </li>
    
    <div
      class="absolute top-5 left-[calc(100vw-5vw)] transform -translate-x-1/2 cursor-pointer z-30"
      onclick={(e) => { e.stopPropagation(); toggleMenu(e); }}
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