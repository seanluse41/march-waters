<!-- DirectorMessage.svelte -->
<script>
    import { Heading, P, Img } from "flowbite-svelte";
    import { _ } from "svelte-i18n";
    import stock2 from "$lib/assets/photos/stock2.png";
</script>

<div class="flex flex-col space-y-6">
    <Heading
        tag="h2"
        class="text-2xl md:text-3xl font-bold text-slate-700 mb-4 md:self-end self-center"
    >
        {$_("about.director.heading")}
    </Heading>

    <!-- Mobile layout: centered image, then text -->
    <div class="md:hidden text-center">
        <Img src={stock2} alt="Director" class="w-full mx-auto mb-4" />
        <div class="text-slate-700 leading-relaxed space-y-4 text-left">
            <P>{$_("about.director.message.1")}</P>
            <P>{$_("about.director.message.2")}</P>
            <P>{$_("about.director.message.3")}</P>
            <P>{$_("about.director.message.4")}</P>
            <P>{$_("about.director.message.5")}</P>
            <P>{$_("about.director.message.6")}</P>
            <P>{$_("about.director.message.7")}</P>
            <P>{$_("about.director.message.8")}</P>
            <P>{$_("about.director.message.9")}</P>
            <P>{$_("about.director.message.10")}</P>
            <P>{$_("about.director.message.11")}</P>
            <P>{$_("about.director.message.12")}</P>
            <P>{$_("about.director.message.13")}</P>
        </div>
    </div>

    <!-- Desktop layout: floating image with text wrap -->
    <div class="hidden md:block relative">
        <Img
            src={stock2}
            alt="Director"
            class="h-64 w-64 rounded-full border-4 border-blue-500 object-cover float-left mr-6 mb-4"
            style="shape-outside: circle(50%); shape-margin: 0.5rem;"
        />
        <div class="text-slate-700 leading-relaxed text-justify space-y-4">
            <P>{$_("about.director.message.1")}</P>
            <P>{$_("about.director.message.2")}</P>
            <P>{$_("about.director.message.3")}</P>
            <P>{$_("about.director.message.4")}</P>
            <P>{$_("about.director.message.5")}</P>
            <P>{$_("about.director.message.6")}</P>
            <P>{$_("about.director.message.7")}</P>
            <P>{$_("about.director.message.8")}</P>
            <P>{$_("about.director.message.9")}</P>
            <P>{$_("about.director.message.10")}</P>
            <P>{$_("about.director.message.11")}</P>
            <P>{$_("about.director.message.12")}</P>
            <P>{$_("about.director.message.13")}</P>
        </div>
        <Img
            src={stock2}
            alt="Director"
            class="w-full object-cover my-8"
        />
    </div>
</div>