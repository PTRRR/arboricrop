<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

{@render children()}

<style lang="scss">
	/* Rubik Regular */
	@font-face {
		font-family: 'Rubik';
		font-style: normal;
		font-weight: 300;
		font-display: swap;
		src: url(/fonts/Rubik-Light.woff) format('woff2');
	}

	@font-face {
		font-family: 'Rubik';
		font-style: italic;
		font-weight: 300;
		font-display: swap;
		src: url(/fonts/Rubik-LightItalic.woff) format('woff2');
	}

	/* Rubik Regular */
	@font-face {
		font-family: 'Rubik';
		font-style: normal;
		font-weight: 400;
		font-display: swap;
		src: url(/fonts/Rubik-Regular.woff) format('woff2');
	}

	/* Rubik Medium */
	@font-face {
		font-family: 'Rubik';
		font-style: normal;
		font-weight: 500;
		font-display: swap;
		src: url(/fonts/Rubik-Medium.woff) format('woff2');
	}

	/* Rubik Bold */
	@font-face {
		font-family: 'Rubik';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url(/fonts/Rubik-Bold.woff) format('woff2');
	}

	/* Rubik Italic */
	@font-face {
		font-family: 'Rubik';
		font-style: italic;
		font-weight: 400;
		font-display: swap;
		src: url(/fonts/Rubik-Italic.woff) format('woff2');
	}

	/* Rubik Medium Italic */
	@font-face {
		font-family: 'Rubik';
		font-style: italic;
		font-weight: 500;
		font-display: swap;
		src: url(/fonts/Rubik-MediumItalic.woff) format('woff2');
	}

	/* Rubik Bold Italic */
	@font-face {
		font-family: 'Rubik';
		font-style: italic;
		font-weight: 700;
		font-display: swap;
		src: url(/fonts/Rubik-BoldItalic.woff) format('woff2');
	}

	:root {
		--main-gap: 1rem;
		--main-font-size: 1rem;
		--mid-font-size: 1.5rem;
		--big-font-size: 2.6rem;
		--layout-margin-top: 6vh;
		--green: #00cc5d;
		--light-green: #bdfad8;
		--red: #ff2900;
		--light-red: #ffd5cc;
		--yellow: #fecc00;
		--light-yellow: #ffec9f;
		--blue: #009fe3;
		--black: #000000;
		--light-grey: #eaeaea;
		--grey: #d8d8d8;
		--dark-grey: #afafaf;
		--white: white;
	}
</style>
