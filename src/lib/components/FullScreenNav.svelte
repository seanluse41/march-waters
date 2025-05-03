<script>
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import { DotsVerticalOutline } from "flowbite-svelte-icons";

  let isOpen = $state(false);
  let highlight;
  let links = [];
  let menu;
  let dropdownOpen = $state(false);

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

<nav class="absolute z-20">
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
        class="no-underline text-slate-200  text-lg uppercase font-bold inline-block w-64 p-4"
        href="/"
        onclick={handleLinkClick}>{$_("nav.home")}</a
      >
    </li>
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-slate-200 text-lg uppercase font-bold inline-block w-64 p-4"
        href="/about"
        onclick={handleLinkClick}>{$_("nav.about")}</a
      >
    </li>
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-slate-200 text-lg uppercase font-bold inline-block w-64 p-4"
        href="/child-care"
        onclick={handleLinkClick}>{$_("nav.childcare")}</a
      >
    </li>
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-slate-200 text-lg uppercase font-bold inline-block w-64 p-4"
        href="/speak"
        onclick={handleLinkClick}>{$_("nav.speak")}</a
      >
    </li>
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-slate-200 text-lg uppercase font-bold inline-block w-64 p-4"
        href="/consult"
        onclick={handleLinkClick}>{$_("nav.consult")}</a
      >
    </li>
    <li class="relative z-10 nav-link">
      <a
        class="no-underline text-slate-200 text-lg uppercase font-bold inline-block w-64 p-4"
        href="/stories"
        onclick={handleLinkClick}>{$_("nav.stories")}</a
      >
    </li>

    <!-- Custom dropdown implementation -->
    <li class="relative z-10 nav-link">
      <div
        class:text-slate-700={dropdownOpen}
        class:text-slate-200={!dropdownOpen}
        class="cursor-pointer no-underline text-lg uppercase font-bold inline-block w-64 p-4 items-center justify-center"
        onclick={toggleDropdown}
      >
        {$_("nav.legal")}
        <svg
          class="w-6 h-6 ms-2 inline"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {#if dropdownOpen}
        <div class="absolute bg-white shadow-md rounded w-44 z-20">
          <a
            href="/terms"
            class="block px-4 py-2 text-lg hover:bg-blue-200 md:text-slate-700"
            onclick={(e) => {
              e.stopPropagation();
              handleLinkClick();
            }}
          >
            {$_("nav.terms")}
          </a>
          <a
            href="/privacy"
            class="block px-4 py-2 text-lg hover:bg-blue-200 md:text-slate-700"
            onclick={(e) => {
              e.stopPropagation();
              handleLinkClick();
            }}
          >
            {$_("nav.privacy")}
          </a>
          <a
            href="/commerce-disclosure"
            class="block px-4 py-2 text-lg hover:bg-blue-200 md:text-slate-700"
            onclick={(e) => {
              e.stopPropagation();
              handleLinkClick();
            }}
          >
            {$_("nav.commerceDisclosure")}
          </a>
        </div>
      {/if}
    </li>

    <div
      class="absolute top-4 left-[calc(100vw-5vw)] transform -translate-x-1/2 cursor-pointer z-30"
      onclick={(e) => {
        e.stopPropagation();
        toggleMenu(e);
      }}
    >
      <DotsVerticalOutline class="text-slate-200 w-8 h-8" />
    </div>
    <div
      bind:this={highlight}
      class="absolute top-0 w-0 h-0 bg-blue-500 transition-transform duration-300"
    ></div>
  </ul>
</nav>
