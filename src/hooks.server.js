// hooks.server.js
import { locale } from 'svelte-i18n';

export const handle = async ({ event, resolve }) => {
    // Handle internationalization
    const lang = event.request.headers.get('accept-language')?.split(',')[0];
    if (lang) {
        locale.set(lang);
    }
    const result = await resolve(event);
    return result;
}