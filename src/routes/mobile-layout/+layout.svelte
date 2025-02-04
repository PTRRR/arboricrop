<script lang="ts">
	import type { Snippet } from 'svelte';
	import Mobile from '../../components/Mobile.svelte';
	import { iphone } from '../../utils/phones';

	let data: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Arboricrop - Mobile Layout</title>
</svelte:head>

<Mobile phone={iphone}>
	<span class="mobile-layout__breadcrumb">vita/hub</span>
	<div class="mobile-layout__nav">
		<div class="mobile-layout__menu-button">
			<div class="mobile-layout__menu-line"></div>
			<div class="mobile-layout__menu-line"></div>
			<div class="mobile-layout__menu-line"></div>
		</div>
	</div>

	<div class="mobile-layout">
		<div class="mobile-layout__content">
			{@render data.children()}
		</div>
	</div>
</Mobile>

<style lang="scss">
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
		--main-font-size: 1.5rem;
		--big-font-size: 2rem;
		--layout-margin-top: 5rem;
		--accent-color: #00cc5c;
		--light-color: white;
	}

	.mobile-layout {
		border: solid;
		font-family: Rubik;
		font-weight: 500;
		background-color: var(--accent-color);
		min-height: 100%;
		position: relative;

		&__nav,
		&__breadcrumb {
			font-size: var(--big-font-size);
			font-family: Rubik;
			font-weight: 500;
			z-index: 1;
			position: fixed;
			line-height: 1;
			top: 0;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			padding: var(--layout-margin-top) 2rem 1rem 2rem;
			color: var(--light-color);
		}

		&__nav {
			z-index: 10;
		}

		&__menu-button {
			position: absolute;
			top: var(--layout-margin-top);
			right: 2rem;
			width: 3rem;
			height: 2rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		&__menu-line {
			width: 100%;
			height: 4px;
			border-radius: 1px;
			background-color: black;
		}

		&__content {
			position: relative;
			z-index: 2;
			background-color: var(--light-color);
			font-size: var(--main-font-size);
			margin-top: calc(var(--layout-margin-top) + var(--big-font-size) + 1rem);
			padding: 2rem;
			border-radius: 2rem;
		}
	}
</style>
