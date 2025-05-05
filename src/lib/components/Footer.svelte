<script>
    import {
        Footer,
        FooterCopyright,
        FooterLinkGroup,
        FooterLink,
        FooterIcon,
    } from "flowbite-svelte";
    import {
        NewspaperOutline,
        InstagramSolid,
        EnvelopeOutline
    } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";
</script>

<Footer color="primary" class="rounded-none bg-white">
    <FooterCopyright href="/" by={$_("footer.copyright")} year={2025} />
    <FooterLinkGroup
        class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0"
    >
        <FooterLink href="/about">{$_("nav.about")}</FooterLink>
        <FooterLink href="/privacy">{$_("nav.privacy")}</FooterLink>
        <FooterLink href="/contact">{$_("nav.contact")}</FooterLink>
    </FooterLinkGroup>
    <div
        class="mt-4 flex space-x-6 sm:mt-0 sm:justify-center rtl:space-x-reverse"
    >
        <FooterIcon href="https://www.instagram.com/marchwatersss/" aria-label={$_("footer.instagram")}>
            <InstagramSolid
                class="h-5 w-5 text-gray-500 hover:text-gray-900"
            />
        </FooterIcon>
        <FooterIcon href="https://note.com/kind_phlox908" aria-label={$_("footer.note")}>
            <NewspaperOutline
                class="h-5 w-5 text-gray-500 hover:text-gray-900"
            />
        </FooterIcon>
        <FooterIcon href="mailto:talk@march-waters.jp" aria-label={$_("footer.mail")}>
            <EnvelopeOutline
                class="h-5 w-5 text-gray-500 hover:text-gray-900"
            />
        </FooterIcon>
    </div>
</Footer>