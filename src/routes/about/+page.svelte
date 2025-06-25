<script>
    import { Card, Heading, P, Span, Hr } from "flowbite-svelte";
    import CareerTimeline from "$lib/components/CareerTimeline.svelte";
    import AboutTabs from "$lib/components/AboutTabs.svelte";
    import { _ } from "svelte-i18n";
</script>

<Card color="primary" class="p-4 md:p-16 border-0 bg-white max-w-none mt-16">
    <!-- Blockquote Section -->
    <div class="md:mb-12 text-center">
        <Heading tag="h1" class="mb-4 text-2xl md:text-5xl">
            {$_("about.heading.prefix")}
            <Span highlight="blue">{$_("about.heading.highlight")}</Span>
            {$_("about.heading.suffix")}
        </Heading>
        <P class="text-xl text-slate-600 text-center">
            {$_("about.subheading")}
        </P>
    </div>
    <Hr class="mx-auto h-1 w-48 rounded-sm" />

    <!-- Desktop: Two-column layout -->
    <div class="hidden md:block">
        <div class="grid grid-cols-2 gap-8 mb-12">
            <!-- Left column - empty for now -->
            <div class="space-y-6">
                <!-- Placeholder for future content -->
            </div>

            <!-- Right column - Career Timeline -->
            <div>
                <CareerTimeline />
            </div>
        </div>

        <Hr class="mx-auto h-1 w-48 rounded-sm" />

        <!-- Customer Reviews Section -->
        <div class="mt-16">
            <Heading
                tag="h2"
                class="text-2xl font-bold text-slate-700 mb-8 text-center"
            >
                Customer Reviews
            </Heading>
            <!-- Placeholder for customer reviews -->
            <div class="text-center text-slate-500">
                Customer reviews will be displayed here
            </div>
        </div>
    </div>

    <!-- Mobile: Tabs layout -->
    <div class="md:hidden">
        <AboutTabs />
    </div>
</Card>
