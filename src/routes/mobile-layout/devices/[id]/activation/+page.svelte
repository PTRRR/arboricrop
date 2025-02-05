<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createId } from '@paralleldrive/cuid2';

	import Button from '../../../../../components/mobile-layout/Button.svelte';
	import Checklist from '../../../../../components/mobile-layout/Checklist.svelte';
	import Dropdown from '../../../../../components/mobile-layout/Dropdown.svelte';
	import Info from '../../../../../components/Info.svelte';
	import Map from '../../../../../components/mobile-layout/Map.svelte';
	import Spacer from '../../../../../components/Spacer.svelte';
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
	import Separation from '../../../../../components/Separation.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import StepSeparation from '../../../../../components/mobile-layout/StepSeparation.svelte';
	import PageHeader from '../../../../../components/mobile-layout/PageHeader.svelte';
	import TextareaInput from '../../../../../components/mobile-layout/TextareaInput.svelte';
	import Table from '../../../../../components/mobile-layout/Table.svelte';

	export let data: PageData;

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

	let map: Map | undefined;
	let selectedField: Field | undefined = undefined;

	$: stepIndex = ($page.data.step || 0) as number;
	$: currentStep = steps[stepIndex];
	$: device = $devices.find((it) => it.id === $page.params.id);
	$: field = $fields.find((it) => it.id === device?.fieldId);

	$: {
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
	}

	$: nextHref = url.resetQueries([
		{ name: 'connected', value: true },
		{ name: 'step', value: stepIndex + 1 }
	]);

	$: updateDevice = (device: Device) => {
		const deviceIndex = $devices.findIndex((it) => it.id === device?.id);
		const newDevices = [...$devices];
		newDevices[deviceIndex] = {
			...newDevices[deviceIndex],
			...device
		};
		devices.set(newDevices);
	};

	$: {
		setJack(stepIndex > 0);
	}

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

{#if data.advanced && device}
	{#snippet advancedActivationTitle()}
		<span>Device Activation</span>
		<Button>Live Data</Button>
	{/snippet}

	{#snippet mediaOptionItem(item: { label: string; type: MediaType })}
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
	{/snippet}

	<PageHeader title={advancedActivationTitle} />
	<Section buttons={[{ label: 'See live data' }]}>
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
	<Section
		buttons={[
			{
				label: stepIndex > 0 ? 'Previous' : 'Cancel',
				onClick: () => {
					if (stepIndex > 0) {
						$preventNavigationHistory = true;
						goto(url.addQuery({ name: 'step', value: stepIndex - 1 }));
					} else {
						$preventNavigationHistory = true;
						goto(`/mobile-wireframe/devices/${device?.id}?connected=true`);
					}
				}
			}
		]}
	>
		{#if stepIndex === 0}
			<Image ratio={1} placeholder="Schema showing how to attach the device on a plant" />
			<StepSeparation label="Checks" />
			<Checklist
				points={[
					{ label: 'Correct device orientation', checked: true },
					{ label: 'Device is not moving', checked: true }
				]}
			/>
			<StepSeparation label="Review & confirm" />
			<Button preventHistory href={nextHref}>Next step</Button>
		{:else if stepIndex === 1}
			<Image
				ratio={1}
				placeholder="Schema showing how to plug the jack into the device and install the probes on a plant"
			/>
			<StepSeparation label="Checks" />
			<Checklist
				points={[
					{ label: 'Plug the jack into the device', checked: true },
					{ label: 'Install probes', checked: true },
					{ label: 'Wait for signal', checked: true }
				]}
			/>
			<StepSeparation label="Review & confirm" />
			<Button preventHistory href={nextHref}>Next step</Button>
		{:else if stepIndex === 2}
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
			<StepSeparation label="Review & confirm" />
			<Button preventHistory href={nextHref} disabled={!device?.location}>Next step</Button>
		{:else if stepIndex === 3 && device}
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

			<StepSeparation label="Medias" />
			<!-- <Dropdown label="Add media" items={mediaOptions}>
				<Button
					slot="item"
					let:item
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
			</Dropdown> -->

			{#if device.medias.length > 0}
				<Spacer />
				<ButtonList
					items={device.medias}
					let:item
					onSelect={(media) => {
						if (device) {
							updateDevice({
								...device,
								medias: (device.medias || []).filter((it) => it !== media)
							});
						}
					}}
				>
					<span>{item.name}</span>
					<span>{item.type}</span>
				</ButtonList>
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
		{/if}
		<Button href={`/mobile-wireframe/devices/${device?.id}?connected=true`} preventHistory>
			Cancel
		</Button>
	</Section>
{/if}

<style>
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
