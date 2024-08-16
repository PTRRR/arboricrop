<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import Dropdown from './Dropdown.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createId } from '@paralleldrive/cuid2';

	let selectedGroup: string | undefined = undefined;
	let upgradeTimer: NodeJS.Timeout | undefined = undefined;
	let success = false;
	let files: string[] = [];

	const startUpgradeTimer = () => {
		success = false;
		upgradeTimer = setTimeout(() => (success = true), 3000);
	};

	onMount(() => {
		if ($page.data.firmwareUpdate) {
			startUpgradeTimer();
		}
	});
</script>

{#if $page.data.firmwareUpdate}
	<div class="device-upgrade">
		{#if success}
			<p>Firware successfully upgraded!</p>
		{:else}
			<p>Upgrade started...</p>
			<span>Keep your mobile close to the device or do not disconnect it</span>
		{/if}

		<Button
			on:click={() => {
				clearTimeout(upgradeTimer);
				goto(window.location.pathname);
			}}
		>
			{#if success}
				Done
			{:else}
				Cancel
			{/if}
		</Button>
	</div>
{:else}
	<div class="device-form">
		<label for="">Device id:</label>
		<input type="text" value="dev-iros84fgka9mcka" />
		<label for="">Firmware version:</label>
		<input type="text" value="v1.0.9" />
		<label for="">Device name:</label>
		<input type="text" placeholder="Comprehensive device name..." />
		<label for="">Personal note:</label>
		<textarea placeholder="Your note..." />
		<Spacer size="2rem" />
		<label for="">Files:</label>
		<Dropdown label="Add media file" items={[{ label: 'Image' }, { label: 'Audio note' }]}>
			<Button
				slot="item"
				let:item
				on:click={() => {
					files =
						item.label === 'Image'
							? [...files, `${createId()}.jpg`]
							: [...files, `${createId()}.mp3`];
				}}
			>
				{item.label}
			</Button>
		</Dropdown>
		<div class="device-form__files">
			{#each files as file}
				<Spacer size="0.5rem" />
				<Button minimal>{file}</Button>
			{/each}
		</div>

		<Spacer size="2rem" />
		<label for="">Group:</label>
		<Dropdown
			label={selectedGroup || 'Select group'}
			items={[{ label: 'Tomatoes' }, { label: 'Vignard' }, { label: 'Fruits plantation' }]}
		>
			<Button slot="item" let:item on:click={() => (selectedGroup = item.label)}
				>{item.label}</Button
			>
		</Dropdown>

		<Spacer size="5rem" />
		<label for="">New firmware version available:</label>
		<Button href="?firmwareUpdate=true" on:click={() => startUpgradeTimer()}>
			Upgrade to v1.1.0
		</Button>
	</div>
{/if}

<style>
	.device-upgrade {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex: 1 1 auto;
		text-align: center;
	}

	.device-upgrade span {
		max-width: 20rem;
		color: var(--dark-gray);
	}

	.device-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
	textarea {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
