<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createId } from '@paralleldrive/cuid2';

	import Button from '../../../../../components/mobile-layout/Button.svelte';
	import Checklist from '../../../../../components/mobile-layout/Checklist.svelte';
	import Dropdown from '../../../../../components/mobile-layout/Dropdown.svelte';
	import Map from '../../../../../components/mobile-layout/Map.svelte';
	import ButtonList from '../../../../../components/wireframe/ButtonList.svelte';
	import CenteredWrapper from '../../../../../components/mobile-layout/CenteredWrapper.svelte';
	import Image from '../../../../../components/mobile-layout/Image.svelte';
	import SaveSection from '../../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../../components/mobile-layout/Section.svelte';
	import {
		useDeviceIllustration,
		useDevices,
		useFields,
		useNavigationHistory,
		useReturnButton
	} from '../../../../../stores';
	import { swissBounds } from '../../../../../utils/dummyData';
	import type { Device, Field, MediaType } from '../../../../../utils/types';
	import { createUrlBuilder } from '../../../../../utils/urls';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import StepSeparation from '../../../../../components/mobile-layout/StepSeparation.svelte';
	import PageHeader from '../../../../../components/mobile-layout/PageHeader.svelte';
	import TextareaInput from '../../../../../components/mobile-layout/TextareaInput.svelte';
	import Table from '../../../../../components/mobile-layout/Table.svelte';

	const { data }: { data: PageData } = $props();

	type Step = { label: string; checked: boolean };

	const { preventNavigationHistory } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setJack, setBlink } = useDeviceIllustration();
	const { devices } = useDevices();
	const returnButton = useReturnButton();
	const { fields } = useFields();
	const url = createUrlBuilder();
	const steps: Step[] = [
		{ label: 'Install device', checked: false },
		{ label: 'Connect probes', checked: false },
		{ label: 'Set location', checked: false },
		{ label: 'Add metadata', checked: false }
	];

	const mediaOptions: { label: string; type: MediaType }[] = [
		{ label: 'Image', type: 'image' },
		{ label: 'Audio note', type: 'audio-note' },
		{ label: 'File', type: 'file' }
	];

	let map: Map | undefined = $state(undefined);
	let selectedField: Field | undefined = $state(undefined);

	const stepIndex = $derived(($page.data.step || 0) as number);
	const currentStep = $derived(steps[stepIndex]);
	const device = $derived($devices.find((it) => it.id === $page.params.id));
	const field = $derived($fields.find((it) => it.id === device?.fieldId));

	$effect(() => {
		if (device) {
			returnButton.set({
				label: `Device ${device?.name || 'Unknown'}`,
				href: `/mobile-wireframe/devices/${device.id}?connected=true`
			});
		} else {
			returnButton.set({
				label: 'Device Unknown',
				href: `/mobile-wireframe/devices`
			});
		}
	});

	const nextHref = $derived(
		url.resetQueries([
			{ name: 'connected', value: true },
			{ name: 'step', value: stepIndex + 1 }
		])
	);

	const previousHref = $derived(
		url.resetQueries([
			{ name: 'connected', value: true },
			{ name: 'step', value: stepIndex - 1 }
		])
	);

	const updateDevice = $derived((device: Device) => {
		const deviceIndex = $devices.findIndex((it) => it.id === device?.id);
		const newDevices = [...$devices];
		newDevices[deviceIndex] = {
			...newDevices[deviceIndex],
			...device
		};
		devices.set(newDevices);
	});

	$effect(() => {
		setJack(stepIndex > 0);
	});

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

{#snippet mediaOptionItem(item: { label: string; type: MediaType })}
	{#if device}
		<Button
			onclick={() => {
				const medias =
					item.type === 'image'
						? [...device.medias, { name: `${createId()}.jpg`, type: item.type }]
						: item.type === 'audio-note'
							? [...device.medias, { name: `${createId()}.mp3`, type: item.type }]
							: [...device.medias, { name: `${createId()}.pdf`, type: item.type }];

				if (device) {
					updateDevice({
						...device,
						medias
					});
				}
			}}
		>
			{item.label}
		</Button>
	{/if}
{/snippet}

{#if data.advanced && device}
	{#snippet advancedActivationTitle()}
		<span>Device Activation</span>
		<Button>Live Data</Button>
	{/snippet}

	<PageHeader title={advancedActivationTitle} />
	<Section>
		<Checklist
			points={[
				{ label: 'Correct device orientation', checked: true },
				{ label: 'Device is not moving', checked: true },
				{ label: 'Plug the jack into the device', checked: true },
				{ label: 'Install probes', checked: true },
				{ label: 'Wait for signal', checked: true }
			]}
		/>
		<Map
			bind:this={map}
			maxBounds={swissBounds}
			zoom={15}
			minZoom={8}
			maxZoom={18.5}
			center={device?.location || field?.center}
			showTarget
			markers={device?.location ? [{ lngLat: device.location }] : []}
			geoJSONs={field?.layers}
		/>
		<Button
			onclick={() => {
				const center = map?.getCenter();
				if (device && center) {
					updateDevice({
						...device,
						location: [center.lng, center.lat]
					});
				}
			}}
		>
			Validate location
		</Button>
		<StepSeparation label="Note" />
		<TextareaInput
			placeholder="Your note..."
			defaultValue={device?.note || ''}
			onvalue={(value) => {
				if (device) {
					updateDevice({
						...device,
						note: value
					});
				}
			}}
		/>

		<StepSeparation label="Medias" />

		{#if device.medias.length > 0}
			<Table
				headers={[
					{ label: 'Name', width: '50%' },
					{ label: 'Type', width: '30%' }
				]}
				rows={device.medias.map((it) => ({
					cells: [
						{ label: it.name.length > 25 ? `${it.name.slice(0, 25)}...` : it.name },
						{ label: it.type }
					]
				}))}
			/>
		{:else}
			<Dropdown label="Add media" items={mediaOptions} renderItem={mediaOptionItem} />
		{/if}

		<StepSeparation label="Review & confirm" />
		<Button
			preventHistory
			href={`/mobile-layout/devices/${device?.id}?connected=true`}
			onclick={() => {
				if (device) {
					updateDevice({
						...device,
						status: 'active'
					});
				}
			}}
		>
			Activate device
		</Button>
	</Section>
{:else if $page.data.selectField}
	<Section label="Available fields">
		<ButtonList
			items={$fields}
			let:item
			selectedItems={[selectedField]}
			onSelect={(field) => (selectedField = field)}
		>
			{item?.name}
		</ButtonList>
	</Section>

	<Section label="Confirm changes">
		<SaveSection
			saveDisabled={!selectedField}
			onSave={() => {
				if (device && selectedField) {
					updateDevice({ ...device, fieldId: selectedField.id });
				}

				$preventNavigationHistory = true;
				goto(url.removeQuery({ name: 'selectField' }));
			}}
			onCancel={() => {
				selectedField = undefined;
				$preventNavigationHistory = true;
				goto(url.removeQuery({ name: 'selectField' }));
			}}
		/>
	</Section>
{:else}
	{#snippet stepHeader()}
		<span>{currentStep?.label}</span>
		<Button>Live Data</Button>
	{/snippet}

	<PageHeader title={stepHeader} subTitle={`Step ${stepIndex + 1}/${steps.length}`} />
	{#if stepIndex === 0}
		<Section>
			<Image ratio={1} placeholder="Schema showing how to attach the device on a plant" />
		</Section>
		<Section label="Checks">
			<Checklist
				points={[
					{ label: 'Correct device orientation', checked: true },
					{ label: 'Device is not moving', checked: true }
				]}
			/>
		</Section>
		<Section label="Review & confirm">
			<Button preventHistory href={nextHref}>Next</Button>
			<Button href={`/mobile-layout/devices/${device?.id}?connected=true`} preventHistory>
				Cancel
			</Button>
		</Section>
	{:else if stepIndex === 1}
		<Section>
			<Image
				ratio={1}
				placeholder="Schema showing how to plug the jack into the device and install the probes on a plant"
			/>
		</Section>
		<Section label="Checks">
			<Checklist
				points={[
					{ label: 'Plug the jack into the device', checked: true },
					{ label: 'Install probes', checked: true },
					{ label: 'Wait for signal', checked: true }
				]}
			/>
		</Section>
		<Section label="Review & confirm">
			<Button preventHistory href={nextHref}>Next</Button>
			<Button href={previousHref} preventHistory>Previous</Button>
		</Section>
	{:else if stepIndex === 2}
		<Section>
			<Map
				bind:this={map}
				maxBounds={swissBounds}
				zoom={15}
				minZoom={8}
				maxZoom={18.5}
				center={device?.location || field?.center}
				showTarget
				markers={device?.location ? [{ lngLat: device.location }] : []}
				geoJSONs={field?.layers}
			/>
			<Button
				onclick={() => {
					const center = map?.getCenter();
					if (device && center) {
						updateDevice({
							...device,
							location: [center.lng, center.lat]
						});
					}
				}}
			>
				Validate location
			</Button>
		</Section>
		<Section label="Review & confirm">
			<Button preventHistory href={nextHref} disabled={!device?.location}>Next</Button>
			<Button href={previousHref} preventHistory>Previous</Button>
		</Section>
	{:else if stepIndex === 3 && device}
		<Section>
			<TextareaInput
				placeholder="Your note..."
				defaultValue={device?.note || ''}
				onvalue={(value) => {
					if (device) {
						console.log(value);
						updateDevice({
							...device,
							note: value
						});
					}
				}}
			/>
		</Section>

		<Section label="Medias" actions={device.medias.length > 0 ? [{ label: 'Add' }] : []}>
			{#if device.medias.length > 0}
				<Table
					headers={[
						{ label: 'Name', width: '50%' },
						{ label: 'Type', width: '30%' }
					]}
					rows={device.medias.map((it) => ({
						cells: [
							{ label: it.name.length > 25 ? `${it.name.slice(0, 25)}...` : it.name },
							{ label: it.type }
						]
					}))}
				/>
			{:else}
				<Dropdown label="Add media" items={mediaOptions} renderItem={mediaOptionItem} />
			{/if}
		</Section>

		<Section label="Review & confirm">
			<Button
				preventHistory
				href={`/mobile-layout/devices/${device?.id}?connected=true`}
				onclick={() => {
					if (device) {
						updateDevice({
							...device,
							status: 'active'
						});
					}
				}}
			>
				Activate
			</Button>
			<Button href={previousHref} preventHistory>Previous</Button>
		</Section>
	{/if}
{/if}
