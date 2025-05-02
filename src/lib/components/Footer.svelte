<script>
    import {
        Footer,
        FooterCopyright,
        FooterLinkGroup,
        FooterLink,
        FooterIcon,
    } from "flowbite-svelte";
    import {
        FacebookSolid,
        TwitterSolid,
        ImageOutline,
        NewspaperOutline,
        InstagramSolid,
    } from "flowbite-svelte-icons";
</script>

<Footer color="primary" class="rounded-none bg-white">
    <FooterCopyright href="/" by="March Waters" year={2025} />
    <FooterLinkGroup
        class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400"
    >
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/privacy">Privacy Policy</FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
    </FooterLinkGroup>
    <div
        class="mt-4 flex space-x-6 sm:mt-0 sm:justify-center rtl:space-x-reverse"
    >
        <FooterIcon href="https://www.instagram.com/marchwatersss/">
            <InstagramSolid
                class="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
            />
        </FooterIcon>
        <FooterIcon href="/https://note.com/kind_phlox908">
            <NewspaperOutline
                class="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
            />
        </FooterIcon>
    </div>
</Footer>
