<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import Dropdown from './Dropdown.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createId } from '@paralleldrive/cuid2';
	import Image from './Image.svelte';

	let selectedGroup: string | undefined = undefined;
	let upgradeTimer: NodeJS.Timeout | undefined = undefined;
	let success = false;
	type MediaType = 'image' | 'audio-note' | 'file';
	let mediaOptions: { label: string; type: MediaType }[] = [
		{ label: 'Image', type: 'image' },
		{ label: 'Audio note', type: 'audio-note' },
		{ label: 'File', type: 'file' }
	];

	let medias: { name: string; type: MediaType }[] = [];
	$: currentMedia = medias.find((it) => it.name === $page.data.media);

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
{:else if currentMedia}
	<div class="device-file">
		<Image placeholder="Media reader / player" ratio={1} />
		<div class="device-file__actions">
			<Button href={window.location.pathname}>Close</Button>
			<Button
				href={window.location.pathname}
				on:click={() => {
					medias = medias.filter((it) => it.name !== currentMedia?.name);
				}}
			>
				Delete
			</Button>
		</div>
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
		<label for="">Medias:</label>
		<Dropdown label="Add media" items={mediaOptions}>
			<Button
				slot="item"
				let:item
				on:click={() => {
					medias =
						item.type === 'image'
							? [...medias, { name: `${createId()}.jpg`, type: item.type }]
							: item.type === 'audio-note'
								? [...medias, { name: `${createId()}.mp3`, type: item.type }]
								: [...medias, { name: `${createId()}.pdf`, type: item.type }];
				}}
			>
				{item.label}
			</Button>
		</Dropdown>
		<div class="device-form__files">
			{#each medias as media}
				<Spacer size="0.5rem" />
				<Button minimal href={`?media=${encodeURIComponent(media.name)}`}>{media.name}</Button>
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
	.device-upgrade,
	.device-file {
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

	.device-file__actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.device-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.device-form__files {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
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
