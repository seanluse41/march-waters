<script>
    import { _ } from "svelte-i18n";
    import {
        Heading,
        P,
        Card,
        Accordion,
        AccordionItem,
    } from "flowbite-svelte";

    let termsSections = $derived([
        {
            title: $_("terms.purpose.title"),
            content: $_("terms.purpose.content"),
        },
        {
            title: $_("terms.membership.title"),
            content: $_("terms.membership.content"),
        },
        {
            title: $_("terms.member_responsibilities.title"),
            content: $_("terms.member_responsibilities.content"),
        },
        {
            title: $_("terms.prohibited_actions.title"),
            content: $_("terms.prohibited_actions.content"),
        },
        {
            title: $_("terms.facility_usage.title"),
            content: $_("terms.facility_usage.content"),
        },
        {
            title: $_("terms.membership_suspension.title"),
            content: $_("terms.membership_suspension.content"),
        },
        {
            title: $_("terms.online_reservation.title"),
            content: $_("terms.online_reservation.content"),
        },
        {
            title: $_("terms.privacy.title"),
            content: $_("terms.privacy.content"),
        },
        { title: $_("terms.fees.title"), content: $_("terms.fees.content") },
        {
            title: $_("terms.terms_revision.title"),
            content: $_("terms.terms_revision.content"),
        },
        {
            title: $_("terms.effective_date.title"),
            content: $_("terms.effective_date.content"),
        },
    ]);
</script>

<div class="container mx-auto px-4 py-8">
    <Card
        color="primary"
        class="p-4 md:p-10 bg-white border-0 max-w-none shadow-2xl"
    >
        <Heading class="text-3xl font-bold mb-6 text-slate-700"
            >{$_("terms.title")}</Heading
        >
        <Accordion>
            {#each termsSections as section}
                <AccordionItem>
                    {#snippet header()}
                        {section.title}
                    {/snippet}
                    <P class="mb-3 text-slate-700">
                        {section.content}
                    </P>
                </AccordionItem>
            {/each}
        </Accordion>
    </Card>
</div>
