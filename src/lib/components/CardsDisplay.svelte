<script>
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { inview } from "svelte-inview";
  import TopCard from "./TopCard.svelte";
  import { _ } from "svelte-i18n";

  const cardDelay = 100;
  $: heading = $_("top.cards.heading");

  const inviewOptions = {
    rootMargin: "-50px",
    unobserveOnEnter: true,
  };

  // Track which cards are in view
  let cardVisibility = [];

  $: cardsData = [
    {
      title: $_("top.cards.card1.title"),
      text: $_("top.cards.card1.text"),
      iconName: "BriefcaseOutline",
      link: "/child-care",
    },
    {
      title: $_("top.cards.card6.title"),
      text: $_("top.cards.card6.text"),
      iconName: "MoonPlusOutline",
      link: "/dropoff",
    },
    {
      title: $_("top.cards.card2.title"),
      text: $_("top.cards.card2.text"),
      iconName: "UserGraduateOutline",
      link: "/speak",
    },
    {
      title: $_("top.cards.card3.title"),
      text: $_("top.cards.card3.text"),
      iconName: "HeadphonesOutline",
      link: "/consult",
    },
    // {
    //   title: $_('top.cards.card4.title'),
    //   text: $_('top.cards.card4.text'),
    //   iconName: "BookOpenOutline",
    //   link: "/stories"
    // },
    {
      title: $_("top.cards.card5.title"),
      text: $_("top.cards.card5.text"),
      iconName: "GlobeOutline",
      link: "/contact",
    },
  ];

  // Initialize the visibility array
  $: {
    if (cardsData.length > 0) {
      cardVisibility = Array(cardsData.length).fill(false);
    }
  }

  // Handle inview change for each card
  const handleInviewChange = (index) => (event) => {
    const { inView } = event.detail;
    cardVisibility[index] = inView;
    cardVisibility = [...cardVisibility]; // Trigger reactivity
  };
</script>

<section class="mt-8 mb-8">
  <div class="container mx-auto">
    <h2 class="text-3xl font-bold text-slate-700 my-8">{heading}</h2>

    <div class="grid md:grid-cols-3 gap-8">
      {#each cardsData as card, i}
        <div
          use:inview={inviewOptions}
          on:inview_change={handleInviewChange(i)}
        >
          {#if cardVisibility[i]}
            <div
              in:fly={{
                delay: i * cardDelay,
                duration: 500,
                y: 50,
                opacity: 0.5,
                easing: quintOut,
              }}
            >
              <TopCard
                title={card.title}
                text={card.text}
                iconName={card.iconName}
                link={card.link}
              />
            </div>
          {:else}
            <TopCard
              title={card.title}
              text={card.text}
              iconName={card.iconName}
              link={card.link}
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
