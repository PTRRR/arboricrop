<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import Button from '../../../../components/Button.svelte';
	import Line from '../../../../components/Line.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../../stores';
	import { getDevicesByFieldId, swissBounds } from '../../../../utils/dummyData';
	import type { Device, Marker } from '../../../../utils/types';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import FieldGeneralSettings from '../../../../components/wireframe/FieldGeneralSettings.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import MapV2 from '../../../../components/MapV2.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import MapLayers from '../../../../components/wireframe/MapLayers.svelte';
	import type { GeoJSON as GeoJSONType, Feature, Geometry, GeoJsonProperties } from 'geojson';

	const { fields } = useFields();
	const devices = useDevices();
	const returnButton = useReturnButton();

	let map: MapV2;
	let generalSettings: FieldGeneralSettings;
	let selectedDevices: Device[] = [];
	let editGeneralSettings: boolean = false;
	let editMap: boolean = false;
	let editLayers: boolean = false;
	let selectedFeature: Feature<Geometry, GeoJsonProperties> | undefined | null = undefined;

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, field?.id);
	$: deviceMarkers = fieldDevices
		.map((it) => ({ lngLat: it.location as LngLatLike, label: it.name }))
		.filter((it) => it.lngLat) as Marker[];

	$: {
		if (field) {
			returnButton.set({
				label: field.name,
				href: '/mobile-wireframe/fields'
			});
		}
	}

	onMount(() => {
		selectedDevices = fieldDevices;
	});
</script>

<div class="field">
	{#if $page.data.devices}
		<ButtonList items={$devices} selectedItems={selectedDevices} let:item>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="device"
				on:click={() => {
					let selected = selectedDevices.some((it) => it.id === item.id);
					selectedDevices = selected
						? selectedDevices.filter((it) => it.id !== item.id)
						: [...selectedDevices, item];
				}}
			>
				<span class="device-name">{item.name}</span>
				<span class="device-id">{item.status}</span>
			</div>
		</ButtonList>
		<Spacer size="1.5rem" />
		<Line />
		<div class="cancel">
			<Spacer size="2rem" />
			<Button
				href={window.location.pathname}
				on:click={() => {
					const fieldDevicesIds = fieldDevices.map((it) => it.id);
					const selectedIds = selectedDevices.map((it) => it.id);

					const newDevices = [...$devices];

					for (let i = 0; i < newDevices.length; i++) {
						if (
							fieldDevicesIds.includes(newDevices[i].id) &&
							!selectedIds.includes(newDevices[i].id)
						) {
							newDevices[i] = {
								...newDevices[i],
								fieldId: undefined
							};
						}

						if (selectedIds.includes(newDevices[i].id)) {
							newDevices[i] = {
								...newDevices[i],
								fieldId: field?.id
							};
						}
					}

					devices.set(newDevices);
				}}
			>
				Save
			</Button>
			<Spacer size="0.5rem" />
			<Button href={window.location.pathname} on:click={() => (selectedDevices = [])}>
				Cancel
			</Button>
		</div>
	{:else if typeof field !== 'undefined'}
		<Section
			title="General settings:"
			buttons={[
				{
					label: editGeneralSettings ? 'Cancel' : 'Edit',
					onClick: () => (editGeneralSettings = !editGeneralSettings)
				}
			]}
		>
			<FieldGeneralSettings bind:this={generalSettings} {field} editable={editGeneralSettings} />
		</Section>

		<Section
			title="Map:"
			buttons={[{ label: editMap ? 'Cancel' : 'Edit', onClick: () => (editMap = !editMap) }]}
		>
			<MapV2
				bind:this={map}
				maxBounds={swissBounds}
				zoom={15}
				minZoom={3}
				maxZoom={18.5}
				center={field.center}
				showTarget={editMap}
				markers={editMap ? [{ lngLat: field.center }] : deviceMarkers}
				geoJSONs={selectedFeature ? [selectedFeature] : field.layers}
			/>
			{#if editMap}
				<Spacer />
				<Button
					on:click={() => {
						const center = map.getCenter();
						if (field) {
							field = {
								...field,
								center
							};
						}
					}}
				>
					Reset Location
				</Button>
			{/if}
		</Section>

		<Section
			title="Layers:"
			buttons={[
				{ label: editLayers ? 'Cancel' : 'Edit', onClick: () => (editLayers = !editLayers) }
			]}
		>
			{#if field.layers.length > 0}
				<MapLayers geoJSONs={field.layers} onSelect={(feature) => (selectedFeature = feature)} />
			{:else}
				<span>No layers</span>
			{/if}
		</Section>

		<Section
			title="Devices:"
			buttons={[{ label: 'See all devices', href: '/mobile-wireframe/devices' }]}
		>
			{#if fieldDevices.length > 0}
				<ButtonList
					items={fieldDevices}
					onSelect={(item) => {
						goto(`/mobile-wireframe/devices/${item.id}`);
					}}
					let:item
				>
					<div class="device">
						<span class="device-name">{item.name}</span>
						<span class="device-id">{item.status}</span>
					</div>
				</ButtonList>
			{:else}
				<span>No devices in this field</span>
			{/if}
		</Section>

		{#if editGeneralSettings || editMap}
			<Section title="Confirm Changes:">
				<SaveSection
					onSave={() => {
						if (editGeneralSettings && field) {
							field = {
								...field,
								...generalSettings.getValues()
							};
						}

						const newFields = $fields.map((it) => (it.id === field?.id ? field : it));
						fields.set(newFields);
						editGeneralSettings = false;
						editMap = false;
					}}
					onCancel={() => {
						editGeneralSettings = false;
						editMap = false;
					}}
				/>
			</Section>
		{/if}

		<Section title={'Danger zone:'}>
			<SaveSection
				deleteLabel="Permanently delete field"
				onDelete={() => {
					fields.set($fields.filter((it) => it.id !== field?.id));
					goto('/mobile-wireframe/fields');
				}}
			/>
		</Section>
	{/if}
</div>

<style>
	.field {
		position: relative;
	}
	.device {
		display: flex;
		max-width: 100%;
		justify-content: space-between;
	}

	.device-name {
		flex: 0 0 auto;
		width: 30%;
		text-align: left;
	}

	.device-id {
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1 1 auto;
		white-space: nowrap;
		text-align: right;
	}

	.device {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.cancel {
		position: sticky;
		bottom: 5rem;
		width: 100%;
	}
</style>
