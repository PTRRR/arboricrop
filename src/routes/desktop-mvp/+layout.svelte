<script lang="ts">
	import type { Snippet } from 'svelte';
	import Section from '../../components/desktop/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import Button from '../../components/layout/Button.svelte';
	import { useUser } from '../../stores';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	const { email } = useUser();
	let newEmail = $state('');
</script>

<div class="desktop-mvp">
	<div class="desktop-mvp__inner">
		<Section sticky="0.5rem" zIndex="10" padding="0.5rem 2rem" backgroundColor="var(--green)">
			<div class="desktop-mvp__main-menu">
				<a class="desktop-mvp__home-button" href="/desktop-mvp">vita/dashboard</a>

				{#if $email}
					<div class="desktop-mvp__sub-menu">
						<a href="/desktop-mvp/devices">Devices</a>
						<a href="/desktop-mvp/fields">Fields</a>
						<a href="/desktop-mvp/settings">Settings</a>
					</div>
				{/if}
			</div>
		</Section>

		{#if !$email}
			<Section>
				<div class="desktop-mvp__login-form">
					<TextInput label="email" bind:value={newEmail} />
					<TextInput type="password" label="password" />
					<Button icon="navigate" onclick={() => ($email = newEmail)}>Login</Button>
				</div>
			</Section>
		{:else}
			{@render children()}
		{/if}
		<Section>
			<img class="desktop-mvp__logo" src="/images/logo-black.svg" alt="" />
		</Section>
	</div>
</div>

<style lang="scss">
	:global(html, body) {
		font-family: Rubik;
		font-weight: 500;
		/* background-color: var(--light-grey); */
	}

	* {
		text-transform: lowercase;
	}

	.desktop-mvp {
		padding: 1rem;
		min-height: 100svh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;

		&__inner {
			width: calc(100% + 1rem);
			max-width: 100rem;
			height: 100%;
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			margin: -0.5rem;
		}

		&__main-menu {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			a {
				color: var(--white);
			}
		}

		&__login-form {
			max-width: 50rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 2rem;
		}

		&__sub-menu {
			display: flex;
			gap: 1rem;

			a {
				text-decoration: none;
				font-size: var(--mid-font-size);

				&:hover {
					color: var(--grey);
				}
			}
		}

		&__home-button {
			color: var(--green);
			text-decoration: none;
			font-size: var(--big-font-size);
		}

		&__logo {
			height: 4rem;
			width: 7rem;
		}
	}
</style>
