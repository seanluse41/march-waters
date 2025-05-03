<script>
  import { Carousel } from "flowbite-svelte";
  import stock1 from "$lib/assets/photos/stock1.png"
  import stock2 from "$lib/assets/photos/stock2.png"

  export const images = [
      {
          alt: "Midwife Services",
          src: stock2,
      },
      {
          alt: "Women and stuff",
          src: stock1,
      },
  ];
</script>

<div class="my-8">
  <Carousel {images} duration="3000" />
</div>