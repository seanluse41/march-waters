<script>
    import { _ } from "svelte-i18n";
    import { A, Card, Listgroup } from "flowbite-svelte";
    import { onMount } from "svelte";

    let articles = $state([]);
    let isLoading = $state(true);
    let error = $state(null);

    onMount(async () => {
        try {
            const response = await fetch("/api/get-news-notes");

            if (!response.ok) {
                throw new Error("Failed to fetch articles");
            }

            const data = await response.json();
            articles = data.data.contents.slice(0, 3);
            isLoading = false;
        } catch (err) {
            error = err.message;
            isLoading = false;
        }
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<Card
    color="primary"
    class="p-4 md:p-10 bg-white border-0 max-w-none shadow-2xl"
>
    <div class="mb-4 flex items-center justify-between">
        <h5 class="text-xl leading-none font-bold text-slate-700">
            {$_("top.news.heading")}
        </h5>
        <A
            href="https://note.com/kind_phlox908"
            target="_blank"
            class="text-blue-500 text-sm font-medium hover:underline"
            >{$_("top.news.all")}</A
        >
    </div>

    {#if isLoading}
        <p class="text-slate-500">{$_("top.news.loading")}</p>
    {:else if error}
        <p class="text-red-500">{$_("top.news.error")} {error}</p>
    {:else if articles.length === 0}
        <p class="text-slate-500">{$_("top.news.none")}</p>
    {:else}
        <Listgroup items={articles} class="border-0 w-full max-w-none">
            {#snippet children(article)}
                <A
                    href={`https://note.com/kind_phlox908/n/${article.key}`}
                    target="_blank"
                    class="w-full flex bg-white hover:bg-slate-100 hover:no-underline"
                >
                    <div
                        class="flex flex-col space-y-2 p-3 border-b last:border-b-0 border-slate-100"
                    >
                        <p class="text-sm font-medium text-slate-700">
                            {article.name}
                        </p>
                        <div class="flex justify-between">
                            <p class="text-xs text-slate-500">
                                {formatDate(article.publishAt)}
                            </p>
                        </div>
                    </div>
                </A>
            {/snippet}
        </Listgroup>
    {/if}
</Card>
