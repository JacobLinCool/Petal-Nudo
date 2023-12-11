import type { Handle } from "@sveltejs/kit";
import { locale } from "svelte-i18n";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	await locale.set(lang);

	const result = await resolve(event);
	return result;
};
