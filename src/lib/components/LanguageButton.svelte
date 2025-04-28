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
    class="focus:ring-0 focus:bg-blue-400 bg-blue-400 border hover:bg-blue-500"
    onclick={changeLocale}
    size="sm"
>
    <LanguageOutline class="w-6 h-6 text-white" />
</Button>
