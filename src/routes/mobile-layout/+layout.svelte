<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Mobile from '../../components/Mobile.svelte';
	import { iphone } from '../../utils/phones';
	import { goto } from '$app/navigation';

	let data: { children: Snippet } = $props();
	let showSplashscreen = $state(false);
	let hideContent = $state(false);
	let menuMode = $state<'default' | 'scrolled'>('default');

	onMount(() => {
		setTimeout(() => {
			showSplashscreen = false;
		}, 2000);
	});
</script>

<svelte:head>
	<title>Arboricrop - Mobile Layout</title>
</svelte:head>

<Mobile
	phone={iphone}
	onscroll={(value) => {
		menuMode = value > 30 ? 'scrolled' : 'default';
	}}
>
	<div
		class="mobile-layout"
		class:mobile-layout--init={showSplashscreen}
		class:mobile-layout--hide-content={hideContent}
		class:mobile-layout--scrolled={menuMode === 'scrolled'}
	>
		<a class="mobile-layout__breadcrumb" href="/mobile-layout">vita/hub</a>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="mobile-layout__nav" onclick={() => (hideContent = !hideContent)}>
			<div class="mobile-layout__menu-button">
				<div class="mobile-layout__menu-line"></div>
				<div class="mobile-layout__menu-line"></div>
				<div class="mobile-layout__menu-line"></div>
			</div>
		</div>

		<div class="mobile-layout__wrapper">
			<div class="mobile-layout__content">
				{@render data.children()}
			</div>
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
		$this: &;
		font-family: Rubik;
		font-weight: 500;
		background-color: var(--accent-color);

		&__wrapper {
			min-height: 100%;
			position: relative;
			top: 0;
			border: solid transparent 0.1px;
			box-sizing: border-box;
		}

		&__nav,
		&__breadcrumb {
			text-decoration: none;
			font-size: var(--big-font-size);
			font-family: Rubik;
			font-weight: 500;
			z-index: 1;
			position: fixed;
			line-height: 1;
			color: var(--light-color);
		}

		&__breadcrumb {
			top: var(--layout-margin-top);
			left: 1rem;
			white-space: nowrap;
			transform: translate(0%, 0%);
			font-size: var(--big-font-size);
			transition:
				transform 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				top 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				left 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				font-size 0.7s cubic-bezier(0.83, 0, 0.17, 1);
		}

		&__nav {
			z-index: 10;
			right: 0;
			top: var(--layout-margin-top);
			right: 1.5rem;
			width: 2.5rem;
			height: 1.8rem;
			transition: opacity 0.7s cubic-bezier(0.83, 0, 0.17, 1);
			cursor: pointer;
		}

		&--init {
			#{$this}__content {
				transform: translate(0, 100%);
			}

			#{$this}__breadcrumb {
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 4rem;
			}

			#{$this}__nav {
				opacity: 0;
				pointer-events: none;
			}
		}

		&--hide-content {
			#{$this}__content {
				transform: translate(0, 100%);
			}
		}

		&--scrolled {
			#{$this}__menu-line {
				width: 100%;
				height: 3px;
				border-radius: 1px;
				background-color: black;
			}
		}

		&__menu-button {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		&__menu-line {
			transition: background-color 0.3s ease-in-out;
			width: 100%;
			height: 3px;
			border-radius: 1px;
			background-color: var(--light-color);
		}

		&__content {
			transition: transform 0.7s cubic-bezier(0.83, 0, 0.17, 1);
			position: relative;
			z-index: 2;
			background-color: var(--light-color);
			font-size: var(--main-font-size);
			margin-top: calc(var(--layout-margin-top) + var(--big-font-size) + 1rem);
			padding: 1.5rem;
			border-radius: 1.5rem;
			box-sizing: border-box;
			min-height: calc(
				var(--mobile-app-height) - var(--layout-margin-top) - var(--big-font-size) - 1rem
			);
		}
	}
</style>
