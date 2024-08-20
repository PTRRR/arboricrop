<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import Dropdown from './Dropdown.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createId } from '@paralleldrive/cuid2';
	import Image from './Image.svelte';
	import type { Device, Media, MediaType, Location } from '../../utils/types';
	import Map from './Map.svelte';
	import { useFields, useNetwork } from '../../stores';
	import Separation from './Separation.svelte';

	export let device: Device | undefined = undefined;
	export let onUpdate: ((device: Device) => void) | undefined = undefined;
	export let isNewDevice: boolean | undefined = undefined;

	const network = useNetwork();
	const fields = useFields();
	$: selectedField = $fields.find((it) => it.id === device?.fieldId);

	let name: HTMLInputElement;
	let note: HTMLTextAreaElement;
	let firmwareVersion = device?.firmwareVersion || 'v1.0.9';
	let upgradeTimer: NodeJS.Timeout | undefined = undefined;
	let success = false;
	let mediaOptions: { label: string; type: MediaType }[] = [
		{ label: 'Image', type: 'image' },
		{ label: 'Audio note', type: 'audio-note' },
		{ label: 'File', type: 'file' }
	];

	let fieldId: string | undefined = device?.fieldId;
	let currentMapLocation: Location = { x: -50, y: -50 };
	let location: Location = device?.location || {
		x: 40 + Math.random() * 20,
		y: 40 + Math.random() * 20
	};

	let medias: Media[] = device?.medias || [];
	$: currentMedia = medias.find((it) => it.name === $page.data.media);
	$: showAdvancedSettings = isNewDevice || firmwareVersion !== 'v1.1.0';

	const updateDevice = () => {
		device = {
			...device,
			id: device?.id || `dev-${createId()}`,
			name: name.value,
			note: note.value,
			medias,
			fieldId,
			firmwareVersion,
			battery: device?.battery || 100,
			location
		};

		onUpdate?.(device);
	};

	const startUpgradeTimer = () => {
		success = false;
		upgradeTimer = setTimeout(() => {
			success = true;
		}, 3000);
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

				if (success) {
					setTimeout(() => {
						firmwareVersion = 'v1.1.0';
						updateDevice();
					}, 100);
				}
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
					setTimeout(() => {
						updateDevice();
					}, 100);
				}}
			>
				Delete
			</Button>
		</div>
	</div>
{:else if $page.data.liveData}
	<div class="device-live-data">
		<Image placeholder="Console showing a stream of data coming from the device" ratio={1} />
		<Button href={window.location.pathname}>Close</Button>
	</div>
{:else}
	<div class="device-form">
		<Separation title="Global settings:" />
		<label for="">Device id:</label>
		<input type="text" value={device?.id || 'dev-iros84fgka9mcka'} />
		<label for="">Firmware version:</label>
		<input type="text" value={device?.firmwareVersion || 'v1.0.9'} />
		<label for="">Device name:</label>
		<input
			type="text"
			placeholder="Comprehensive device name..."
			bind:this={name}
			value={device?.name || ''}
			on:input={() => updateDevice()}
		/>

		<Spacer size="var(--gap)" />
		<Separation title="Device metadata:" />

		<Map
			showTarget
			locations={[location]}
			onChange={(location) => (currentMapLocation = location)}
		/>
		<Button
			on:click={() => {
				location = currentMapLocation;
				updateDevice();
			}}
		>
			Set manual location
		</Button>

		<Spacer size="var(--gap)" />

		<label for="">Personal note:</label>
		<textarea
			placeholder="Your note..."
			bind:this={note}
			value={device?.note || ''}
			on:input={() => updateDevice()}
		/>

		<Spacer size="var(--gap)" />

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
					updateDevice();
				}}
			>
				{item.label}
			</Button>
		</Dropdown>

		{#if medias.length > 0}
			<div class="device-form__files">
				{#each medias as media}
					<Spacer size="0.5rem" />
					<Button minimal href={`?media=${encodeURIComponent(media.name)}`}>{media.name}</Button>
				{/each}
			</div>
			<Spacer size="var(--gap)" />
		{/if}

		<Spacer size="var(--gap)" />

		<label for="">Field:</label>
		<Dropdown
			label={selectedField?.name || 'Select a field'}
			items={[
				...$fields.map((it) => ({ label: it.name, id: it.id })),
				{ id: undefined, label: 'Clear' }
			]}
		>
			<Button
				slot="item"
				let:item
				on:click={() => {
					fieldId = item.id;
					updateDevice();
				}}
			>
				{item.label}
			</Button>
		</Dropdown>

		<Spacer size="var(--gap)" />
		<Separation title="Troubleshooting:" />

		<Button href="?liveData=true">Show live data</Button>

		{#if showAdvancedSettings}
			<Spacer size="var(--gap)" />
			<Separation title="Advanced settings:" />

			{#if firmwareVersion !== 'v1.1.0'}
				<label for="">New firmware version available:</label>
				<Button href="?firmwareUpdate=true" on:click={() => startUpgradeTimer()}>
					Upgrade to v1.1.0
				</Button>
			{/if}

			<Spacer />
			<label for="">Current network gateway:</label>
			<input type="text" value={$network} />
			<Button href="/mobile-wireframe/settings?network=true">Configure LoRa gateway</Button>
		{/if}

		{#if !isNewDevice}
			<Spacer size="var(--gap)" />
			<Separation />
			<Spacer size="0" />
			<Button href="/mobile-wireframe/devices">Remove device</Button>
		{/if}
	</div>
{/if}

<style>
	.device-upgrade,
	.device-file,
	.device-live-data {
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
		gap: var(--gap);
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
