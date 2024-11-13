<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createId } from '@paralleldrive/cuid2';

	import Button from '../../../../../components/Button.svelte';
	import Checklist from '../../../../../components/Checklist.svelte';
	import Dropdown from '../../../../../components/Dropdown.svelte';
	import Info from '../../../../../components/Info.svelte';
	import MapV2 from '../../../../../components/MapV2.svelte';
	import Spacer from '../../../../../components/Spacer.svelte';
	import ButtonList from '../../../../../components/wireframe/ButtonList.svelte';
	import CenteredWrapper from '../../../../../components/wireframe/CenteredWrapper.svelte';
	import Image from '../../../../../components/wireframe/Image.svelte';
	import SaveSection from '../../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../../components/wireframe/Section.svelte';
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

	let map: MapV2 | undefined;
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

<CenteredWrapper>
	{#if $page.data.selectField}
		<Section title="Available fields:">
			<ButtonList
				items={$fields}
				let:item
				selectedItems={[selectedField]}
				onSelect={(field) => (selectedField = field)}
			>
				{item?.name}
			</ButtonList>
		</Section>

		<Section title="Confirm changes:">
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
		<Section
			title={`Activation Step ${stepIndex + 1}/${steps.length}: ${currentStep?.label}`}
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
				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Checks:" buttons={[{ label: 'Show live data' }]} />
				<Checklist
					points={[
						{ label: 'Correct device orientation', checked: true },
						{ label: 'Device is not moving', checked: true }
					]}
				/>
				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Review & confirm:" />
				<Button preventHistory href={nextHref}>Next step</Button>
			{:else if stepIndex === 1}
				<Image
					ratio={1}
					placeholder="Schema showing how to plug the jack into the device and install the probes on a plant"
				/>
				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Checks:" buttons={[{ label: 'Show live data' }]} />
				<Checklist
					points={[
						{ label: 'Plug the jack into the device', checked: true },
						{ label: 'Install probes', checked: true },
						{ label: 'Wait for signal', checked: true }
					]}
				/>
				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Review & confirm:" />
				<Button preventHistory href={nextHref}>Next step</Button>
			{:else if stepIndex === 2}
				<MapV2
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
				<Spacer />
				<Button
					on:click={() => {
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
				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Review & confirm:" />
				<Button preventHistory href={nextHref} disabled={!device?.location}>Next step</Button>
			{:else if stepIndex === 3 && device}
				<Info label="Note:" />
				<Spacer />

				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<textarea
					placeholder="Your note..."
					value={device?.note || ''}
					on:input={(event) => {
						if (device) {
							updateDevice({
								...device,
								note: event.currentTarget.value
							});
						}
					}}
				/>
				<Spacer />

				<Info label="Medias:" />
				<Spacer />

				<Dropdown label="Add media" items={mediaOptions}>
					<Button
						slot="item"
						let:item
						on:click={() => {
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
				</Dropdown>

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

				<Spacer size="calc(var(--gap) * 3)" />
				<Separation title="Review & confirm:" />
				<Button
					preventHistory
					href={`/mobile-wireframe/devices/${device?.id}?connected=true`}
					on:click={() => {
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
			<Spacer />
			<Button href={`/mobile-wireframe/devices/${device?.id}?connected=true`} preventHistory>
				Cancel
			</Button>
		</Section>
	{/if}
</CenteredWrapper>

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
