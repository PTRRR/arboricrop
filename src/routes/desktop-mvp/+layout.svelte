<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Section from '../../components/desktop/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import Button from '../../components/layout/Button.svelte';
	import { useAccounts, useCurrentAccount, useUser } from '../../stores';
	import Stack from '../../components/desktop/Stack.svelte';
	import StepSeparation from '../../components/layout/StepSeparation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { goto } from '$app/navigation';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
	const { accounts } = useAccounts();
	const { currentAccount } = useCurrentAccount();

	const { email } = useUser();
	let newEmail = $state('');
	let password = $state('');

	onMount(() => {
		newEmail = $accounts[0].email;
	});
</script>

<div class="desktop-mvp">
	<Section sticky="0px" padding="0.5rem 1rem" backgroundColor="transparent">
		<div class="desktop-mvp__main-menu">
			<a class="desktop-mvp__home-button" href="/desktop-mvp">vita/dashboard</a>
		</div>
	</Section>

	<div class="desktop-mvp__inner">
		{#if !$currentAccount}
			<Section backgroundColor="var(--light-grey)" height="var(--content-min-height)">
				<Stack style={{ width: '100%', maxWidth: '50rem' }}>
					<TextInput label="email" name={createId()} bind:value={newEmail} />
					<TextInput type="password" label="password" bind:value={password} />
					<Button
						icon="navigate"
						disabled={!newEmail || !password}
						onclick={() => {
							const account = $accounts.find((it) => it.email === newEmail);
							$currentAccount = account;
						}}>Login</Button
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
						<StepSeparation label="Entities" />
						<Button href="/desktop-mvp/projects">Projects</Button>
						<Button href="/desktop-mvp/trials">Trials</Button>
						<Button href="/desktop-mvp/devices">Devices</Button>
						<Spacer />
						<StepSeparation label="Account" />
						<Button href="/desktop-mvp/settings">Settings</Button>
						<Button>Account</Button>
						<Button onclick={() => ($email = '')}>Logout</Button>
						<Spacer />
						<StepSeparation label="Admin" />
						<Button href="/desktop-mvp/earmark-devices">Earmark</Button>
					</Stack>

					<a href="https://vivent-biosignals.com/">
						<img class="desktop-mvp__logo" src="/images/logo-black.svg" alt="" />
					</a>
				</Section>
				{@render children()}
			</Stack>
		{/if}
	</div>
	<div class="desktop-mvp__footer">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad accusamus dolorum eos atque libero
			repellendus sit consequatur tenetur eveniet totam reprehenderit adipisci sapiente, similique
			maxime magnam delectus harum rem possimus!
		</p>
	</div>
</div>

<button
	class="clear-local-storage"
	onclick={async () => {
		if (typeof Storage !== 'undefined') {
			// Reload the page
			await goto('/desktop-mvp');
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
	:global(html, body) {
		background-color: var(--green);
	}

	.clear-local-storage {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}

	:root {
		--content-offset-top: 1rem;
		--content-min-height: calc(100vh - 2rem);
	}

	* {
		text-transform: lowercase;
	}

	.desktop-mvp {
		font-family: Rubik, Arial, Helvetica, sans-serif;
		font-weight: 500;

		min-height: 100svh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;

		&__inner {
			// width: calc(100% + 2 * var(--section-padding));
			width: 100%;
			/* max-width: 100rem; */
			height: 100%;
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			padding: 1rem;
			// margin: calc(var(--section-padding) * -1);
			background-color: var(--white);
			border-radius: 2rem;
			box-sizing: border-box;
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

		&__footer {
			padding: 1rem;
			text-align: left;
			width: 100%;
			box-sizing: border-box;

			p {
				max-width: 40rem;
				color: var(--white);
			}
		}
	}
</style>
