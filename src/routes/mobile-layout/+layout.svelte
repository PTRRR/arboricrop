<script lang="ts">
	import type { Snippet } from 'svelte';
	import Mobile from '../../components/Mobile.svelte';
	import { iphone } from '../../utils/phones';
	import { goto } from '$app/navigation';

	let data: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Arboricrop - Mobile Layout</title>
</svelte:head>

<Mobile phone={iphone}>
	<a class="mobile-layout__breadcrumb" href="/mobile-layout">vita/hub</a>
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

<button
	class="clear-local-storage"
	onclick={async () => {
		if (typeof Storage !== 'undefined') {
			// Reload the page
			await goto('/mobile-layout');
			localStorage.clear();
			window.location.reload();
		} else {
			console.log('localStorage is not supported in this browser');
		}
	}}
>
	Reset DB
</button>

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
		--main-gap: 1rem;
		--main-font-size: 1.2rem;
		--big-font-size: 2rem;
		--layout-margin-top: 6vh;
		--accent-color: #00cc5c;
		--light-color: white;
	}

	.clear-local-storage {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}

	.mobile-layout {
		font-family: Rubik;
		font-weight: 500;
		background-color: var(--accent-color);
		min-height: 100%;
		position: relative;
		top: 0;
		border: solid transparent 0.1px;
		box-sizing: border-box;

		&__nav,
		&__breadcrumb {
			text-decoration: none;
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
			padding: var(--layout-margin-top) 1rem 1rem 1rem;
			color: var(--light-color);
		}

		&__nav {
			z-index: 10;
		}

		&__menu-button {
			position: absolute;
			top: var(--layout-margin-top);
			right: 1rem;
			width: 2.5rem;
			height: 2rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		&__menu-line {
			width: 100%;
			height: 3px;
			border-radius: 1px;
			background-color: black;
		}

		&__content {
			position: relative;
			z-index: 2;
			background-color: var(--light-color);
			font-size: var(--main-font-size);
			margin-top: calc(var(--layout-margin-top) + var(--big-font-size) + 1rem);
			padding: 1rem;
			border-radius: 1rem;
			box-sizing: border-box;
			min-height: calc(
				var(--mobile-app-height) - var(--layout-margin-top) - var(--big-font-size) - 1rem
			);
		}
	}
</style>
