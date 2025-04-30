import adapter from '@sveltejs/adapter-netlify';

export default {
	kit: {
		adapter: adapter({
			edge: false,
			split: false
		})
	},
	compilerOptions: {
		// disable all warnings coming from node_modules and all accessibility warnings
		warningFilter: (warning) => !warning.filename?.includes('node_modules') && !warning.code.startsWith('a11y')
	  }
};