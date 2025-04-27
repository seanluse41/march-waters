// hooks.server.js
import { redirect } from "@sveltejs/kit";
import { locale } from 'svelte-i18n';

export const handle = async ({ event, resolve }) => {
    // Handle internationalization
    const lang = event.request.headers.get('accept-language')?.split(',')[0];
    if (lang) {
        locale.set(lang);
    }

    // Check auth and get user data
    const userData = { isAuthenticated: true };

    // Set locals
    event.locals.user = userData;

    // Protected routes check
    if (event.url.pathname.startsWith("/account") && !userData?.isAuthenticated) {
        throw redirect(303, "/");
    }

    const result = await resolve(event);
    return result;
}