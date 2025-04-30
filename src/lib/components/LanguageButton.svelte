<script>
    import { onMount } from "svelte";
    import { Button } from "flowbite-svelte";
    import { LanguageOutline } from "flowbite-svelte-icons";
    import { locale } from "svelte-i18n";
    let currentLocale = $state();
    onMount(() => {
        currentLocale = window.navigator.language;
    });

    const changeLocale = () => {
        if (currentLocale == "en-US") {
            locale.set("ja");
            currentLocale = "ja-JP";
        } else if (currentLocale == "ja-JP") {
            locale.set("en");
            currentLocale = "en-US";
        }
    };
</script>

<Button
    class="absolute left-[calc(100vw-9vw)] transform -translate-x-1/2 z-20 top-16 md:top-3 focus:ring-0 border focus:bg-blue-600 bg-blue-500 hover:bg-blue-600"
    onclick={changeLocale}
    size="sm"
>
    <LanguageOutline class="w-6 h-6 text-white" />
</Button>