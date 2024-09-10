<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Button from '../Button.svelte';
	import SaveSection from './SaveSection.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createId } from '@paralleldrive/cuid2';
	import Image from './Image.svelte';
	import type { Device, Location } from '../../utils/types';
	import { useFields, useNetwork } from '../../stores';
	import Separation from '../Separation.svelte';
	import Info from '../Info.svelte';
	import { createUrlBuilder } from '../../utils/urls';
	import DeviceMetadata from './DeviceMetadata.svelte';
	import CenteredWrapper from './CenteredWrapper.svelte';
	import ButtonList from './ButtonList.svelte';
	import Legend from './Legend.svelte';

	export let device: Device;
	export let isNewDevice: boolean | undefined = undefined;
	export let onSave: ((device: Device) => void) | undefined = undefined;
	export let onDelete: ((device: Device) => void) | undefined = undefined;

	$: showMetadata = device?.status === 'active' && !isNewDevice;

	const network = useNetwork();
	const fields = useFields();
	$: selectedField = $fields.find((it) => it.id === device?.fieldId);

	let id = device?.id || `dev-${createId()}`;
	let name: HTMLInputElement;
	let note: HTMLTextAreaElement;
	let url = createUrlBuilder();
	let deviceUrl = createUrlBuilder(`/mobile-wireframe/devices/${id}`);
	let pairUrl = createUrlBuilder(`/mobile-wireframe/devices/pairing`);

	let firmwareVersion = device?.firmwareVersion || 'v1.0.9';
	let upgradeTimer: NodeJS.Timeout | undefined = undefined;
	let success = false;

	let fieldId: string | undefined = device?.fieldId;
	let currentMapLocation: Location = { x: -50, y: -50 };
	let location: Location = device?.location || {
		x: 40 + Math.random() * 20,
		y: 40 + Math.random() * 20
	};

	$: medias = device?.medias || [];
	$: currentMedia = medias.find((it) => it.name === $page.data.media);

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
	<CenteredWrapper>
		{#if success}
			<Info align="center" value="Firware successfully upgraded!" />
		{:else}
			<Info
				align="center"
				label="Upgrade started..."
				value="Keep your mobile close to the device or do not disconnect it"
			/>
		{/if}
		<Spacer />
		<Button
			on:click={() => {
				clearTimeout(upgradeTimer);
				goto(url.removeQuery({ name: 'firmwareUpdate' }));

				if (success) {
					setTimeout(() => {
						firmwareVersion = 'v1.1.0';
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
	</CenteredWrapper>
{:else if currentMedia}
	<CenteredWrapper>
		<Image placeholder="Media reader / player" ratio={1} />
		<Spacer />
		<Button href={url.removeQuery({ name: 'media' })}>Close</Button>
		<Spacer />
		<Button
			href={url.removeQuery({ name: 'media' })}
			on:click={() => {
				onSave?.({
					...device,
					medias: medias.filter((it) => it.name !== currentMedia?.name)
				});
			}}
		>
			Delete
		</Button>
	</CenteredWrapper>
{:else if $page.data.field}
	<CenteredWrapper>
		<Separation title="Available fields:" />
		<ButtonList
			let:item
			items={$fields}
			selectedItems={selectedField ? [selectedField] : []}
			onSelect={(field) => (selectedField = field)}
		>
			<span>{item.name}</span>
			<span>{item.name}</span>
		</ButtonList>
		<Spacer />
		<Spacer />
		<Spacer />
		<SaveSection
			onSave={() => {
				onSave?.({
					...device,
					fieldId: selectedField?.id
				});

				goto(url.removeQuery({ name: 'field' }));
			}}
			onCancel={() => goto(url.removeQuery({ name: 'field' }))}
		/>
	</CenteredWrapper>
{:else if $page.data.activation}
	<CenteredWrapper>
		<Separation title="Device activation:" />
		<DeviceMetadata
			{device}
			onLocation={(location) => (currentMapLocation = location)}
			onSetManualLocation={() => onSave?.({ ...device, location: currentMapLocation })}
			onChangeField={() => goto(url.addQuery({ name: 'field', value: true }))}
			onNote={(note) => onSave?.({ ...device, note })}
			onMedias={(medias) => onSave?.({ ...device, medias })}
			onMedia={(media) => goto(url.addQuery({ name: 'media', value: media.name }))}
		/>
		<Spacer />
		<Spacer />
		<Spacer />
		<Separation />
		<Spacer />
		<Spacer />
		<SaveSection
			saveLabel="Activate"
			onSave={() => {
				if (device) onSave?.({ ...device, status: 'active' });
				goto(url.removeQuery({ name: 'activation' }));
			}}
			onCancel={() => goto(url.removeQuery({ name: 'activation' }))}
		/>
	</CenteredWrapper>
{:else if $page.data.liveData}
	<CenteredWrapper>
		<Image placeholder="Console showing a stream of data coming from the device" ratio={1} />
		<Spacer />
		<Button href={url.removeQuery({ name: 'liveData' })}>Close</Button>
	</CenteredWrapper>
{:else}
	<div class="device-form">
		<Separation title="Device:" />

		<Info label="Name:" />
		<Spacer size="0.2rem" />
		<input
			type="text"
			placeholder="Comprehensive device name..."
			bind:this={name}
			value={device?.name || ''}
		/>
		<Spacer />

		<Info label="Id:" value={device?.id || 'dev-iros84fgka9mcka'} />
		<Spacer />

		<Info label="Paring status:" value={$page.data.connected ? 'connected' : 'not connected'} />
		<Spacer />

		{#if device?.status}
			<Info label="Device status:" value={device?.status} />
			<Spacer />
		{/if}

		{#if device}
			{#if !$page.data.connected}
				<Legend>You need to pair the device in order to activate or disactivate it</Legend>
				<Spacer />
			{/if}
			{#if device?.status === 'unactive'}
				<Button
					href={$page.data.connected
						? url.addQuery({ name: 'activation', value: true })
						: pairUrl.resetQueries([{ name: 'deviceId', value: device.id }])}
				>
					Activate device
				</Button>
			{:else}
				<Button
					on:click={() =>
						$page.data.connected
							? onSave?.({ ...device, status: 'unactive' })
							: goto(pairUrl.resetQueries([{ name: 'deviceId', value: device.id }]))}
				>
					Disable device
				</Button>
			{/if}

			<Spacer />
		{/if}

		{#if device?.firmwareVersion}
			<Info label="Firmware version:" value={device.firmwareVersion} />
			<Spacer />

			{#if firmwareVersion !== 'v1.1.0'}
				<Button
					href={url.addQuery({ name: 'firmwareUpdate', value: 'true' })}
					on:click={() => startUpgradeTimer()}
				>
					Upgrade to v1.1.0
				</Button>
			{/if}
		{/if}

		{#if showMetadata}
			<Spacer />
			<Spacer />
			<Spacer />

			<DeviceMetadata
				{device}
				onLocation={(location) => (currentMapLocation = location)}
				onSetManualLocation={() => onSave?.({ ...device, location: currentMapLocation })}
				onChangeField={() => goto(url.addQuery({ name: 'field', value: true }))}
				onNote={(note) => onSave?.({ ...device, note })}
				onMedias={(medias) => onSave?.({ ...device, medias })}
				onMedia={(media) => goto(url.addQuery({ name: 'media', value: media.name }))}
			/>
		{/if}

		{#if $page.data.connected}
			<Spacer />
			<Spacer />
			<Spacer />

			<Separation title="Advanced settings:" />
			<Info label="Current network gateway:" value={$network} />

			<Spacer />
			<Button href="/mobile-wireframe/settings?network=true">Change network gateway</Button>

			<Spacer />
			<Button href={url.addQuery({ name: 'liveData', value: true })}>Show live data</Button>
		{/if}

		{#if !isNewDevice}
			<Spacer />
			<Spacer />
			<Spacer />
			<Separation />
			<Spacer />
			<Spacer />
			<SaveSection
				onSave={() => {
					onSave?.({ ...device, name: name?.value });
					goto('/mobile-wireframe/devices');
				}}
				onCancel={() => goto('/mobile-wireframe/devices')}
				onDelete={() => {
					if (device) {
						onDelete?.(device);
					}
					goto('/mobile-wireframe/devices');
				}}
			/>
		{:else if isNewDevice}
			<Spacer />
			<Spacer />
			<Spacer />
			<Separation title="New device detected:" />

			<div class="device__footer">
				<Button
					href={deviceUrl.resetQueries([{ name: 'connected', value: true }])}
					on:click={() => {
						onSave?.({
							...device,
							id,
							name: name.value,
							note: note?.value,
							medias,
							fieldId,
							firmwareVersion,
							battery: device?.battery || 100,
							location,
							status: device?.status || 'unactive'
						});
					}}
				>
					Save new device to account
				</Button>
				<Spacer />
				<Button href="/mobile-wireframe/devices">Cancel</Button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.device-form {
		display: flex;
		flex-direction: column;
	}

	input {
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
