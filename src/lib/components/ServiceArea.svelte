<script>
    import { Button, Modal, Img, Card } from "flowbite-svelte";
    import { MapPinOutline } from "flowbite-svelte-icons";
    import { _ } from "svelte-i18n";
    import areaImage from "$lib/assets/photos/area.png";

    let showModal = $state(false);
    const mapsLink = "https://maps.app.goo.gl/AhtAgjtPDFns3m6M8";

    function openMaps() {
        window.open(mapsLink, "_blank");
    }
</script>

<!-- Desktop View -->
<div class="hidden lg:block">
    <div class="cursor-pointer" onclick={() => (showModal = true)}>
        <Img
            src={areaImage}
            alt={$_("top.serviceArea.altText")}
            caption={$_("top.serviceArea.caption")}
            class="rounded-lg hover:opacity-90 transition-opacity"
        />
    </div>
</div>

<!-- Mobile View -->
<div class="lg:hidden">
    <Card class="cursor-pointer" onclick={() => (showModal = true)}>
        <div class="flex items-center justify-center p-4">
            <div class="text-center">
                <MapPinOutline class="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p class="text-slate-700 font-medium mb-1">
                    {$_("top.serviceArea.caption")}
                </p>
                <p class="text-sm text-slate-500">
                    {$_("top.serviceArea.tapToCheck")}
                </p>
            </div>
        </div>
    </Card>
</div>

<!-- Modal -->
<Modal
    title={$_("top.serviceArea.modalTitle")}
    bind:open={showModal}
    size="lg"
    class="w-full"
>
    <div class="text-center">
        <div class="cursor-pointer" onclick={openMaps}>
            <Img
                src={areaImage}
                alt={$_("top.serviceArea.altText")}
                class="rounded-lg hover:opacity-90 transition-opacity"
                caption={$_("top.serviceArea.modalDescription")}
            />
        </div>
    </div>
</Modal>
