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
	import PageHeader from '../../components/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import { getCss } from '../../utils/css';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
	const { accounts, addAccount } = useAccounts();
	const { currentAccount } = useCurrentAccount();

	const { email } = useUser();
	let newEmail = $state('');
	let password = $state('');
	let resetEmail = $state('');
	let resetPassword = $state('');
	let resetPasswordState = $state<'email' | 'password' | undefined>(undefined);

	onMount(() => {
		newEmail = $accounts[0].email;
	});
</script>

<div class="desktop-mvp">
	<Section sticky="0px" padding="1rem 1rem" backgroundColor="transparent">
		<div class="desktop-mvp__main-menu">
			<a class="desktop-mvp__home-button" href="/desktop-mvp">vita/dashboard</a>
		</div>
	</Section>

	<div class="desktop-mvp__inner">
		{#if resetPasswordState === 'email'}
			<Section>
				<Stack style={{ width: '100%', maxWidth: '50rem' }} gap="1rem">
					<PageHeader title="Reset Password" />
					<TextInput label="email address" bind:value={resetEmail} />
					<Button
						icon="navigate"
						onclick={() => (resetPasswordState = 'password')}
						disabled={!resetEmail}>Sent email</Button
					>
				</Stack>
			</Section>
		{:else if resetPasswordState === 'password'}
			<Section>
				<Stack style={{ width: '100%', maxWidth: '50rem' }} gap="1rem">
					<PageHeader title="Reset Password" />
					<TextInput type="password" label="new password" bind:value={resetPassword} />
					<TextInput type="password" label="repeat password" />
					<Button
						icon="check"
						onclick={() => (resetPasswordState = undefined)}
						disabled={!resetPassword}>Save</Button
					>
				</Stack>
			</Section>
		{:else if !$currentAccount}
			<Section height="var(--content-min-height)">
				<PageHeader title="Login" />
				<Stack style={{ width: '100%', maxWidth: '50rem' }} gap="1rem">
					<TextInput label="email" name={createId()} bind:value={newEmail} />
					<TextInput type="password" label="password" bind:value={password} />
					<Button
						icon="login"
						disabled={!newEmail || !password}
						onclick={() => {
							const account = $accounts.find((it) => it.email === newEmail);

							if (!account) {
								const newAccount = {
									id: `acc-${createId()}`,
									email: newEmail
								};

								addAccount(newAccount);
								$currentAccount = newAccount;
							} else {
								$currentAccount = account;
							}
						}}
					>
						Login
					</Button>
					<Spacer size="2rem" />
					<p style={getCss({ color: 'var(--grey)' })}>Forgot your password?</p>
					<Button icon="refresh" onclick={() => (resetPasswordState = 'email')}
						>Reset Password</Button
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
						<Button href="/desktop-mvp" underline={$page.route.id === '/desktop-mvp'}>
							Dashboard
						</Button>
						<Button
							href="/desktop-mvp/projects"
							underline={$page.route.id?.startsWith('/desktop-mvp/projects')}>Projects</Button
						>
						<Button
							href="/desktop-mvp/devices"
							underline={$page.route.id?.startsWith('/desktop-mvp/devices')}>Devices</Button
						>
						<Button
							href="/desktop-mvp/notifications"
							underline={$page.route.id?.startsWith('/desktop-mvp/notifications')}
						>
							Notifications
						</Button>

						{#if $currentAccount.email.includes('vivent')}
							<Spacer />
							<StepSeparation label="Admin" />
							<Button
								href="/desktop-mvp/earmark-devices"
								underline={$page.route.id?.startsWith('/desktop-mvp/earmark-devices')}
							>
								Earmark
							</Button>
							<Button
								href="/desktop-mvp/organizations"
								underline={$page.route.id?.startsWith('/desktop-mvp/organizations')}
							>
								Organizations
							</Button>
						{/if}

						<Spacer />
						<StepSeparation label="Settings" />
						<Button
							href="/desktop-mvp/account"
							underline={$page.route.id?.startsWith('/desktop-mvp/account')}>Account</Button
						>
						<Button
							onclick={() => {
								$email = '';
								$currentAccount = null;
							}}>Logout</Button
						>
					</Stack>

					<a href="https://vivent-biosignals.com/">
						<img class="desktop-mvp__logo" src="/images/logo-black.svg" alt="" />
					</a>
				</Section>
				{@render children()}
			</Stack>
		{/if}
	</div>
	<!-- <div class="desktop-mvp__footer">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad accusamus dolorum eos atque libero
			repellendus sit consequatur tenetur eveniet totam reprehenderit adipisci sapiente, similique
			maxime magnam delectus harum rem possimus!
		</p>
	</div> -->
</div>

<style lang="scss">
	:global(html, body) {
		background-color: var(--green);
	}

	:root {
		--content-offset-top: 1rem;
		--content-min-height: calc(100vh - 2rem);
	}

	* {
		text-transform: lowercase;
	}

	:global([data-melt-scroll-lock]) .desktop-mvp {
		&::after {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(255, 255, 255, 0.8);
			// backdrop-filter: blur(8px);
		}
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
