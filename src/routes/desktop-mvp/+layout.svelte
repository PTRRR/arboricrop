<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Section from '../../components/desktop/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import Button from '../../components/layout/Button.svelte';
	import { useAccounts, useUser } from '../../stores';
	import Stack from '../../components/desktop/Stack.svelte';
	import StepSeparation from '../../components/layout/StepSeparation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import { createId } from '@paralleldrive/cuid2';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
	const { accounts } = useAccounts();

	const { email } = useUser();
	let newEmail = $state('');
	let password = $state('');

	onMount(() => {
		newEmail = $accounts[0].email;
	});
</script>

<div class="desktop-mvp">
	<div class="desktop-mvp__inner">
		<Section
			sticky="calc(1rem - var(--section-padding))"
			zIndex="10"
			padding="0.5rem 1rem"
			backgroundColor="var(--green)"
		>
			<div class="desktop-mvp__main-menu">
				<a class="desktop-mvp__home-button" href="/desktop-mvp">vita/dashboard</a>
			</div>
		</Section>

		{#if !$email}
			<Section backgroundColor="var(--light-grey)" height="var(--content-min-height)">
				<Stack style={{ width: '100%', maxWidth: '50rem' }}>
					<TextInput label="email" name={createId()} bind:value={newEmail} />
					<TextInput type="password" label="password" bind:value={password} />
					<Button
						icon="navigate"
						disabled={!newEmail || !password}
						onclick={() => ($email = newEmail)}>Login</Button
					>
				</Stack>
			</Section>
		{:else}
			<Stack direction="horizontal">
				<Section
					width="20rem"
					height="var(--content-min-height)"
					sticky="var(--content-offset-top)"
					backgroundColor="var(--light-grey)"
					innerStyle={{ justifyContent: 'space-between' }}
				>
					<Stack gap="0.5rem">
						<StepSeparation label="Admin Settings" />
						<Button href="/desktop-mvp/earmark-devices">Earmark Devices</Button>
						<Spacer />
						<StepSeparation label="Entities" />
						<Button href="/desktop-mvp/fields">Projects</Button>
						<Button href="/desktop-mvp/settings">Trials</Button>
						<Button href="/desktop-mvp/devices">Devices</Button>
						<Spacer />
						<StepSeparation label="Account" />
						<Button>Settings</Button>
						<Button>Account</Button>
						<Button onclick={() => ($email = '')}>Logout</Button>
					</Stack>

					<a href="https://vivent-biosignals.com/">
						<img class="desktop-mvp__logo" src="/images/logo-black.svg" alt="" />
					</a>
				</Section>
				{@render children()}
			</Stack>
		{/if}
	</div>
</div>

<style lang="scss">
	:global(html, body) {
		font-family: Rubik;
		font-weight: 500;
		background-color: var(--white);
	}

	:root {
		--section-padding: 0.3rem;
		--content-offset-top: calc(2rem + var(--section-padding) + var(--big-font-size));
		--content-min-height: calc(100vh - 3rem - var(--big-font-size));
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
			width: calc(100% + 2 * var(--section-padding));
			/* max-width: 100rem; */
			height: 100%;
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			margin: calc(var(--section-padding) * -1);
		}

		&__main-menu {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}

		&__home-button {
			display: block;
			color: var(--white);
			text-decoration: none;
			font-size: var(--big-font-size);
			height: var(--big-font-size);
			line-height: 1;
		}

		&__logo {
			height: 3rem;
			width: 5rem;
		}
	}
</style>
