<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import {
		useAlarms,
		useDevices,
		useFields,
		useGeoJSONFeatures,
		useMetrics
	} from '../../../../stores';
	import { getDevicesByFieldId, plantationMetrics } from '../../../../utils/dummyData';
	import MapV2 from '../../../../components/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../../../components/wireframe/Section.svelte';
	import Tabs from '../../../../components/Tabs.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import AlertDialog from '../../../../components/AlertDialog.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import type { Alarm, GeoJSONFeature, Metric, Tab } from '../../../../utils/types';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { goto } from '$app/navigation';
	import Grid from '../../../../components/Grid.svelte';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import Input from '../../../../components/Input.svelte';

	const { fields, deleteField, updateField, addFieldLayers, removeFieldLayer } = useFields();
	const devices = useDevices();
	const features = useGeoJSONFeatures();
	const { metrics, addMetric, deleteMetric, getMetricsByFieldId } = useMetrics();
	const { alarms, addAlarm, removeAlarm, getAlarmsByFieldId } = useAlarms();

	const url = createUrlBuilder();
	const tabs: Tab[] = [
		{ value: 'analysis', label: 'Biosignals' },
		{ value: 'reports', label: 'Reports' },
		{ value: 'settings', label: 'Settings' }
	];

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, $page.params.fieldId);
	$: deviceMarkers = fieldDevices
		.filter((it) => it.location)
		.map((it) => ({ lngLat: it.location as LngLatLike, label: it.name }));
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];
	$: fieldAlarms = field && $alarms ? getAlarmsByFieldId(field.id) : [];
	$: selectedTab = tabs.find((it) => it.value === $page.data.tab) || tabs[0];

	let editMetadata: boolean = false;
	let editLayers: boolean = false;
	let editMetric: boolean = false;
	let editAlarms: boolean = false;
	let metricType: string | undefined = undefined;
	let selectedMetricFilter: Metric | undefined = undefined;
	let selectedFeatures: GeoJSONFeature[] = [];

	let newAlarm: Alarm | undefined = undefined;
</script>

{#if field}
	<Tabs
		{tabs}
		selected={selectedTab}
		onSelect={(tab) => goto(url.addQuery({ name: 'tab', value: tab.value }))}
	>
		{#if field}
			<Section title="Map:" buttons={[{ label: 'Edit' }]}>
				<MapV2
					ratio={3}
					center={field.center}
					interactive={false}
					zoom={15.5}
					minZoom={10}
					maxZoom={19}
					geoJSONs={field.layers}
					markers={deviceMarkers}
				/>
			</Section>

			{#if selectedTab?.value === 'analysis'}
				<Section title="Metrics filters:">
					<div class="filters">
						{#each fieldMetrics as metric}
							<Button
								selected={metric === selectedMetricFilter}
								on:click={() =>
									(selectedMetricFilter = selectedMetricFilter === metric ? undefined : metric)}
							>
								{metric.type}
							</Button>
						{/each}
					</div>
				</Section>
				<Section
					title={selectedTab?.label}
					buttons={[
						{
							label: 'Create metric',
							onClick: () => {
								goto(url.addQuery({ name: 'tab', value: 'settings' }));
								editMetric = true;
							}
						}
					]}
				>
					<Grid columns={3}>
						{#each fieldMetrics as metric}
							<div>
								<Image ratio={3} placeholder="Graph:" />
								<Spacer />
								<Info label="Metric:" value={metric.type} />
							</div>
						{/each}
					</Grid>
				</Section>
			{:else if selectedTab?.value === 'settings'}
				<Section
					title="Metadata:"
					buttons={[
						{
							label: editMetadata ? 'Cancel' : 'Edit',
							onClick: () => (editMetadata = !editMetadata)
						}
					]}
				>
					<Info label="Id:" value={field.id} />
					<Spacer />
					{#if editMetadata}
						<Info label="Name:" />
						<Spacer />
						<Input value={field.name} onValue={(name) => updateField({ ...field, name })} />
						<Spacer />
						<Info label="Type:" />
						<Spacer />
						<Input value={field.type} onValue={(type) => updateField({ ...field, type })} />
					{:else}
						<Info label="Name:" value={field.name} />
						<Spacer />
						<Info label="Type:" value={field.type} />
					{/if}
					{#if editMetadata}
						<Spacer />
						<Button
							on:click={() => {
								deleteField(field.id);
								goto('/desktop-wireframe/dashboard');
							}}
						>
							Permanently delete field
						</Button>
					{/if}
				</Section>

				<Section
					title="Layers"
					buttons={[
						{
							label: editLayers ? 'Cancel' : 'Add layer',
							onClick: () => {
								editLayers = !editLayers;
								selectedFeatures = field.layers;
							}
						}
					]}
				>
					{#if field.layers.length > 0}
						<ButtonList
							items={field.layers}
							let:item
							onSelect={(layer) => removeFieldLayer(field, layer.id)}
						>
							{item.properties?.layerName}
						</ButtonList>
					{:else}
						<span>No layers</span>
					{/if}
					<AlertDialog
						open={editLayers}
						actionLabel="Save"
						onAction={() => {
							addFieldLayers(field, selectedFeatures);
							selectedFeatures = [];
							editLayers = false;
						}}
						onCancel={() => {
							editLayers = false;
							selectedFeatures = [];
						}}
						cancelLabel="Cancel"
					>
						<div class="metric-form">
							<Section title="Layers:">
								<ButtonList items={$features} let:item>
									{#if getFeatureLayerName(item)}
										<div class="layer__button">
											<Button
												minimal
												selected={!!selectedFeatures.find((it) => it.id === item.id)}
												on:click={() =>
													!!selectedFeatures.find((it) => it.id === item.id)
														? (selectedFeatures = selectedFeatures.filter((it) => it !== item))
														: (selectedFeatures = [...selectedFeatures, item])}
											>
												{getFeatureLayerName(item)}
											</Button>
											<div>GeoJSON</div>
										</div>
									{/if}
								</ButtonList>
							</Section>
						</div>
					</AlertDialog>
				</Section>

				<Section
					title="Devices:"
					buttons={[{ label: 'See devices', href: '/desktop-wireframe/devices' }]}
				>
					<ButtonList
						items={fieldDevices}
						let:item
						onSelect={(device) => goto(`/desktop-wireframe/devices/${device.id}`)}
					>
						<div class="device">
							<span class="device-name">{item.name}</span>
							<span class="device-id">{item.status}</span>
						</div>
					</ButtonList>
				</Section>

				<Section
					title="Metrics:"
					buttons={[{ label: 'Add metric', onClick: () => (editMetric = !editMetric) }]}
				>
					{#if fieldMetrics.length > 0}
						<ButtonList
							items={fieldMetrics}
							let:item
							onSelect={(metric) => deleteMetric(metric.id)}
						>
							<span>{item.type}</span>
						</ButtonList>
					{:else}
						<span>No metrics</span>
					{/if}

					<AlertDialog
						open={editMetric}
						actionDisabled={!metricType}
						onAction={() => {
							if (metricType) {
								addMetric({
									id: createId(),
									fieldId: field.id,
									type: metricType
								});
							}

							metricType = undefined;
							editMetric = false;
						}}
						onCancel={() => {
							metricType = undefined;
							editMetric = false;
						}}
						cancelLabel="Cancel"
						actionLabel="Create metric"
					>
						<div class="metric-form">
							<Section title="Metric type:">
								<ButtonList
									items={plantationMetrics}
									let:item
									selectedItems={[metricType]}
									onSelect={(metric) => (metricType = metric)}
								>
									{item}
								</ButtonList>
							</Section>
						</div>
					</AlertDialog>
				</Section>

				<!-- <Section title="Monitoring:" buttons={[{ label: 'Add metric monitor' }]}>
					<span>No metric monitors</span>
				</Section> -->

				<Section
					title="Alarms:"
					buttons={[
						{
							label: editAlarms ? 'Cancel' : 'Create alarm',
							onClick: () => {
								editAlarms = !editAlarms;
								newAlarm = editAlarms
									? {
											id: createId(),
											fieldId: field.id
										}
									: undefined;
							}
						}
					]}
				>
					{#if fieldAlarms.length > 0}
						<ButtonList items={fieldAlarms} let:item onSelect={(alarm) => removeAlarm(alarm.id)}>
							{item.name}
						</ButtonList>
					{:else}
						<span>No alarms</span>
					{/if}
					<AlertDialog
						open={editAlarms}
						actionDisabled={!newAlarm?.metricId || !newAlarm.name || !newAlarm.threshold}
						onAction={() => {
							if (newAlarm) {
								addAlarm(newAlarm);
							}

							newAlarm = undefined;
							editAlarms = false;
						}}
						onCancel={() => {
							newAlarm = undefined;
							editAlarms = false;
						}}
						cancelLabel="Cancel"
						actionLabel="Create metric"
					>
						<div class="metric-form">
							<Section title="Alarm:">
								<Info label="Alarm name:" />
								<Spacer />
								<Input
									placeholder="Value..."
									onValue={(name) => (newAlarm = newAlarm ? { ...newAlarm, name } : undefined)}
								/>
								<Spacer />
								<Info label="Threshold:" />
								<Spacer />
								<Input
									placeholder="Value..."
									type="number"
									onValue={(threshold) =>
										(newAlarm = newAlarm
											? { ...newAlarm, threshold: parseFloat(threshold) }
											: undefined)}
								/>
							</Section>
							<Section title="Metrics:">
								<ButtonList
									items={fieldMetrics}
									let:item
									onSelect={(metric) =>
										(newAlarm = newAlarm ? { ...newAlarm, metricId: metric.id } : undefined)}
									selectedItems={fieldMetrics.filter((it) => it.id === newAlarm?.metricId)}
								>
									{item.type}
								</ButtonList>
							</Section>
						</div>
					</AlertDialog>
				</Section>
			{:else if selectedTab?.value === 'reports'}
				<Section title=" Analysis reports:">
					<Grid columns={2}>
						{#each fieldMetrics as metric}
							<Section title={metric.type}>
								<Info label="Date:" value="10/09/2024" />
								<Spacer />
								<p>
									Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia quaerat laboriosam
									animi culpa eligendi quod veritatis nam omnis, fugiat quibusdam reprehenderit odio
									quidem voluptatem autem exercitationem iure! Eos, alias maiores!
								</p>
								<Spacer />
								<div>
									<Button minimal>Acknowledge report</Button>
								</div>
							</Section>
						{/each}
					</Grid>
				</Section>
			{/if}
		{/if}
	</Tabs>
{/if}

<style>
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

	.filters {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.metric-form {
		width: 30rem;
		max-width: calc(100svw - 4rem);
	}

	.layer__button {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
