<script module lang="ts">
	export const LAYOUT_PORTAL = 'layout-portal';
	export const SUB_CONTENT_PORTAL = 'sub-content-portal';
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Mobile from '../../components/Mobile.svelte';
	import { iphone } from '../../utils/phones';
	import { goto, onNavigate } from '$app/navigation';
	import { createPortal } from '../../utils/portal';
	import { useApp, useNotifications, useReturnButton } from '../../stores';
	import Button from '../../components/mobile-layout/Button.svelte';
	import { addEllipsis } from '../../utils/strings';
	import { getCss } from '../../utils/css';

	let data: { children: Snippet } = $props();
	let showSplashscreen = $state(true);
	let showBreadcrumb = $state(false);
	let menuMode = $state<'default' | 'scrolled'>('default');
	const notifications = useNotifications();
	const pendingNotifications = $derived($notifications.filter((it) => it.status === 'pending'));
	const returnButton = useReturnButton();
	const { showAppMenu, hideContent } = useApp();

	onNavigate(() => {
		$hideContent = false;
	});

	const breadcrumbIcon = $derived(
		!showBreadcrumb ? undefined : $returnButton?.backHref ? 'back' : undefined
	);

	const breadcrumbContent = $derived(
		!showBreadcrumb ? 'vita/hub' : addEllipsis($returnButton?.label || 'vita/hub', 10)
	);

	onMount(() => {
		setTimeout(() => {
			showSplashscreen = false;
		}, 2000);

		setTimeout(() => {
			showBreadcrumb = true;
		}, 3000);
	});
</script>

<svelte:head>
	<title>Arboricrop - Mobile Layout</title>
</svelte:head>

<Mobile
	phone={iphone}
	backgroundColor="var(--green)"
	onscroll={(value) => {
		menuMode = value > 30 ? 'scrolled' : 'default';
	}}
>
	<div
		class="mobile-layout"
		class:mobile-layout--init={showSplashscreen}
		class:mobile-layout--show-app-menu={$showAppMenu}
		class:mobile-layout--scrolled={menuMode === 'scrolled'}
	>
		<div class="mobile-layout__breadcrumb">
			<Button
				preventHistory
				href={$returnButton?.backHref || '/mobile-layout'}
				color="var(--white)"
				fontSize="inherit"
				icon={breadcrumbIcon}
				iconBackgroundColor="var(--white)"
				iconColor="var(--green)"
			>
				<div class="mobile-layout__breadcrumb-inner">
					{breadcrumbContent}
				</div>
			</Button>
		</div>

		<img class="mobile-layout__logo" src="/images/logo.svg" alt="" />

		{#if pendingNotifications.length > 0}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="mobile-layout__notifications"
				onclick={() => goto('/mobile-layout/notifications')}
			>
				<div class="mobile-layout__notifications-inner">
					{pendingNotifications.length}
				</div>
			</div>
		{/if}

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="mobile-layout__hamburger" onclick={() => ($showAppMenu = !$showAppMenu)}>
			<div class="mobile-layout__hamburger-inner">
				<div class="mobile-layout__hamburger-line"></div>
				<div class="mobile-layout__hamburger-line"></div>
				<div class="mobile-layout__hamburger-line"></div>
			</div>
		</div>

		<div class="mobile-layout__links">
			<a href="/mobile-layout" onclick={() => ($showAppMenu = false)}>Fields</a>
			<a href="/mobile-layout/notifications" onclick={() => ($showAppMenu = false)}>Notifications</a
			>
			<a href="/mobile-layout/settings" onclick={() => ($showAppMenu = false)}>Settings</a>
			<a href="/mobile-layout/account" onclick={() => ($showAppMenu = false)}>Account</a>
		</div>

		<div class="mobile-layout__wrapper">
			<div class="mobile-layout__content">
				<div
					class="mobile-layout__content-inner"
					style={getCss({ display: $hideContent ? 'none' : undefined })}
				>
					{@render data.children()}
				</div>
				<div class="mobile-layout__portal" use:createPortal={SUB_CONTENT_PORTAL}></div>
			</div>
		</div>

		<div class="mobile-layout__portal" use:createPortal={LAYOUT_PORTAL}></div>
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
		--mid-font-size: 1.5rem;
		--big-font-size: 2.6rem;
		--layout-margin-top: 6vh;
		--green: #00cc5d;
		--light-green: #dbffeb;
		--red: #ff2900;
		--light-red: #ffd5cc;
		--yellow: #fecc00;
		--blue: #009fe3;
		--black: #000000;
		--grey: #dadada;
		--dark-grey: #878787;
		--white: white;
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
		background-color: var(--green);

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

			#{$this}__notifications,
			#{$this}__hamburger {
				opacity: 0;
				pointer-events: none;
			}

			#{$this}__links {
				opacity: 0;
				pointer-events: none;
			}

			#{$this}__action-menu {
				opacity: 0;
				pointer-events: none;
				transform: translate(0, 150%);
			}
		}

		&--show-app-menu {
			#{$this}__wrapper {
				pointer-events: none;
			}

			#{$this}__content {
				transform: translate(0, 100%);
			}
		}

		&--scrolled {
			#{$this}__hamburger-line {
				background-color: black;
			}
		}

		&__links {
			position: fixed;
			top: 50%;
			left: 0;
			transform: translate(0, -50%);
			display: flex;
			flex-direction: column;
			font-size: var(--big-font-size);
			font-weight: inherit;
			padding: 1rem;
			gap: 0.2rem;
			transition: opacity 1s 0.7s cubic-bezier(0.83, 0, 0.17, 1);

			a {
				text-decoration: none;
				color: var(--white);
			}
		}

		&__wrapper {
			min-height: 100%;
			position: relative;
			top: 0;
			border: solid transparent 0.1px;
			box-sizing: border-box;
		}

		&__breadcrumb {
			display: flex;
			text-decoration: none;
			font-family: Rubik;
			font-weight: 500;
			z-index: 1;
			position: fixed;
			line-height: 1;
			color: var(--white);
			top: var(--layout-margin-top);
			left: 1.5rem;
			white-space: nowrap;
			transform: translate(0%, 0%);
			font-size: var(--big-font-size);
			line-height: 1;
			transition:
				transform 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				top 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				left 0.7s cubic-bezier(0.83, 0, 0.17, 1),
				font-size 0.7s cubic-bezier(0.83, 0, 0.17, 1);

			&-inner {
				transform: translate(0, -5%);
			}
		}

		&__hamburger {
			cursor: pointer;
			position: absolute;
			right: 1.5rem;
			top: var(--layout-margin-top);
			height: var(--big-font-size);
			width: 2.5rem;
			transition: opacity 0.7s cubic-bezier(0.83, 0, 0.17, 1);
			z-index: 10;
			padding: 0.3rem 0;
			box-sizing: border-box;

			&-inner {
				width: 100%;
				height: 100%;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

			&-line {
				transition: background-color 0.3s ease-in-out;
				width: 100%;
				height: 4px;
				border-radius: 2px;
				background-color: var(--white);
			}
		}

		&__notifications {
			cursor: pointer;
			z-index: 1;
			top: var(--layout-margin-top);
			right: 5rem;
			height: var(--big-font-size);
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: var(--main-font-size);
			transition: opacity 0.7s cubic-bezier(0.83, 0, 0.17, 1);

			&-inner {
				background-color: var(--white);
				color: var(--green);
				padding: 5px;
				border-radius: 5px;
				height: 1em;
				width: 1em;
				text-align: center;
			}
		}

		&__content {
			transition: transform 0.7s cubic-bezier(0.83, 0, 0.17, 1);
			position: relative;
			z-index: 2;
			background-color: var(--white);
			font-size: var(--main-font-size);
			margin-top: calc(var(--layout-margin-top) + var(--big-font-size) + 1rem);
			padding: 1.5rem;
			padding-bottom: 5rem;
			border-radius: 1.5rem;
			overflow: hidden;
			box-sizing: border-box;
			min-height: calc(
				var(--mobile-app-height) - var(--layout-margin-top) - var(--big-font-size) - 1rem
			);
		}

		&__logo {
			position: absolute;
			bottom: 2rem;
			left: 50%;
			width: 5rem;
			object-fit: contain;
			transform: translate(-50%, 0);
		}

		&__portal {
			display: contents;
		}
	}
</style>
