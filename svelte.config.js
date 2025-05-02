import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { preprocess } from 'svelte/compiler';

export default {
	kit: {
		adapter: adapter({
			edge: false,
			split: false
		})
	},
	preprocess: [vitePreprocess()],
	compilerOptions: {
		// disable all warnings coming from node_modules and all accessibility warnings
		warningFilter: (warning) => !warning.filename?.includes('node_modules') && !warning.code.startsWith('a11y')
	  }
};