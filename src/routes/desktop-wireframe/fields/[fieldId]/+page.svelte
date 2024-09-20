<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import { useDevices, useFields, useMetrics } from '../../../../stores';
	import { getDevicesByFieldId, plantationMetrics } from '../../../../utils/dummyData';
	import MapV2 from '../../../../components/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../../../components/wireframe/Section.svelte';
	import Tabs from '../../../../components/Tabs.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import AlertDialog from '../../../../components/AlertDialog.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import type { Metric, Tab } from '../../../../utils/types';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { goto } from '$app/navigation';

	const fields = useFields();
	const devices = useDevices();
	const { metrics, addMetric, deleteMetric, getMetricsByFieldId } = useMetrics();

	const url = createUrlBuilder();
	const tabs: Tab[] = [
		{ value: 'analysis', label: 'Biosignals' },
		{ value: 'settings', label: 'Settings' }
	];

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, $page.params.fieldId);
	$: deviceMarkers = fieldDevices
		.filter((it) => it.location)
		.map((it) => ({ lngLat: it.location as LngLatLike, label: it.name }));
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];

	$: selectedTab = tabs.find((it) => it.value === $page.data.tab) || tabs[0];

	let editMetric: boolean = false;
	let metricType: string | undefined = undefined;
	let selectedMetricFilter: Metric | undefined = undefined;
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
					zoom={15}
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
					<div class="fields__analysis">
						{#each fieldMetrics as metric}
							<Image ratio={3} placeholder={`Graph: ${metric.type}`} />
						{/each}
					</div>
				</Section>
			{:else if selectedTab?.value === 'settings'}
				<Section title="Metadata:" buttons={[{ label: 'Edit' }]}>
					<Info label="Name:" value={field.name} />
					<Spacer />
					<Info label="Type:" value={field.type} />
					<Spacer />
					<Info label="Id:" value={field.id} />
				</Section>

				<Section title="Layers" buttons={[{ label: 'Add layer' }]}>
					<span>No layers</span>
				</Section>

				<Section title="Devices:" buttons={[{ label: 'See devices' }]}>
					{#each fieldDevices as device}
						{#if device}
							<Button minimal href={`/desktop-wireframe/devices/${device.id}`}>
								<div class="device">
									<span class="device-name">{device.name}</span>
									<span class="device-id">{device.status}</span>
								</div>
							</Button>
						{/if}
					{/each}
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

				<Section title="Monitoring:" buttons={[{ label: 'Add metric monitor' }]}>
					<span>No metric monitors</span>
				</Section>

				<Section title="Alarms:" buttons={[{ label: 'Create alarm' }]}>
					<span>No alarms</span>
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

	.fields__analysis {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap);
		align-items: center;
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
</style>
