<script lang="ts">
	import { t } from "svelte-i18n";
	import "../app.css";
</script>

<svelte:head>
	<title>{$t("petal")}</title>
	<meta name="description" content={$t("description")} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="og:image" content="/banner.png" />
</svelte:head>

<slot />
