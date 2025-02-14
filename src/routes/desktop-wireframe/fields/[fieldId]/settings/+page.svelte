<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../../components/wireframe/Button.svelte';
	import Info from '../../../../../components/wireframe/Info.svelte';
	import Spacer from '../../../../../components/Spacer.svelte';
	import {
		useAlarms,
		useDevices,
		useFields,
		useGeoJSONFeatures,
		useMetrics
	} from '../../../../../stores';
	import { getDevicesByFieldId, plantationMetrics } from '../../../../../utils/dummyData';
	import Section from '../../../../../components/wireframe/Section.svelte';
	import AlertDialog from '../../../../../components/wireframe/AlertDialog.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import ButtonList from '../../../../../components/wireframe/ButtonList.svelte';
	import type { Alarm, GeoJSONFeature } from '../../../../../utils/types';
	import { goto } from '$app/navigation';
	import { getFeatureLayerName } from '../../../../../utils/geoJSON';
	import Input from '../../../../../components/wireframe/Input.svelte';
	import { createUrlBuilder } from '../../../../../utils/urls';
	import Dialog from '../../../../../components/wireframe/Dialog.svelte';
	import List from '../../../../../components/wireframe/List.svelte';

	const { fields, deleteField, updateField, addFieldLayers, removeFieldLayer } = useFields();
	const { devices } = useDevices();
	const features = useGeoJSONFeatures();
	const { metrics, addMetric, deleteMetric, getMetricsByFieldId, getMetricById } = useMetrics();
	const { alarms, addAlarm, removeAlarm, getAlarmsByFieldId } = useAlarms();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, $page.params.fieldId);
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];
	$: fieldAlarms = field && $alarms ? getAlarmsByFieldId(field.id) : [];
	$: longestDeviceName = Math.max(...fieldDevices.map((it) => it.name?.length || 0));

	const url = createUrlBuilder();

	let editMetadata: boolean = false;
	let editLayers: boolean = false;
	let editMetric: boolean = $page.data.createMetric;
	let editAlarms: boolean = false;
	let metricType: string | undefined = undefined;
	let selectedFeatures: GeoJSONFeature[] = [];
	let newAlarm: Alarm | undefined = undefined;
</script>

{#if field}
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
			<Dialog>
				<Section title="Layers:">
					<ButtonList items={$features} let:item>
						{#if getFeatureLayerName(item)}
							<div class="layer__button">
								<Button
									minimal
									selected={!!selectedFeatures.find((it) => it.id === item.id)}
									on:click={() =>
										selectedFeatures.find((it) => it.id === item.id)
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
			</Dialog>
		</AlertDialog>
	</Section>

	<Section
		title="Devices:"
		buttons={[{ label: 'See devices', href: `/desktop-wireframe/devices?fieldId=${field.id}` }]}
	>
		<List
			items={fieldDevices}
			headers={{
				name: { size: `${longestDeviceName * 0.6}rem`, label: 'Name' },
				status: { size: '10rem', label: 'Status' }
			}}
			let:item
			let:headerStyles
			onSelect={(device) => goto(`/desktop-wireframe/devices/${device.id}`)}
		>
			<div class="list__item" style={headerStyles.name}>{item.name}</div>
			<div class="list__item" style={headerStyles.status}>{item.status}</div>
		</List>
	</Section>

	<Section
		title="Metrics:"
		buttons={[
			{
				label: 'Add metric',
				onClick: () => {
					editMetric = !editMetric;
					goto(url.removeQuery({ name: 'createMetric' }));
				}
			}
		]}
	>
		{#if fieldMetrics.length > 0}
			<ButtonList items={fieldMetrics} let:item onSelect={(metric) => deleteMetric(metric.id)}>
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
				goto(url.removeQuery({ name: 'createMetric' }));
			}}
			onCancel={() => {
				metricType = undefined;
				editMetric = false;
				goto(url.removeQuery({ name: 'createMetric' }));
			}}
			cancelLabel="Cancel"
			actionLabel="Create metric"
		>
			<Dialog>
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
			</Dialog>
		</AlertDialog>
	</Section>

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
			<List
				items={fieldAlarms}
				headers={{
					name: { size: '7rem', label: 'Name' },
					metricId: { size: '14rem', label: 'Metric' },
					notificationStrategies: { size: '20rem', label: 'Notification Strategies' }
				}}
				let:item
				let:headerStyles
				onSelect={(item) => removeAlarm(item.id)}
			>
				<div class="list__item" style={headerStyles.name}>{item.name}</div>
				<div class="list__item" style={headerStyles.metricId}>
					{getMetricById(item.metricId || '')?.type}
				</div>
				<div class="list__item" style={headerStyles.notificationStrategies}>
					{item.notificationStrategies?.join(', ')}
				</div>
			</List>
		{:else}
			<span>No alarms</span>
		{/if}
		<AlertDialog
			open={editAlarms}
			actionDisabled={!newAlarm?.metricId ||
				!newAlarm.name ||
				!newAlarm.threshold ||
				!newAlarm.period ||
				!newAlarm.dataPoints ||
				!newAlarm?.notificationStrategies?.length}
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
			actionLabel="Create alarm"
		>
			<Dialog>
				<Section title="Alarm:">
					<Info label="Alarm name:" />
					<Spacer />
					<Input
						placeholder="Value..."
						onValue={(name) => (newAlarm = newAlarm ? { ...newAlarm, name } : undefined)}
					/>
					<Spacer />
					<Info label="Period:" />
					<Spacer />
					<Input
						placeholder="Value..."
						type="number"
						onValue={(period) =>
							(newAlarm = newAlarm ? { ...newAlarm, period: parseFloat(period) } : undefined)}
					/>
					<Spacer />
					<Info label="Data points:" />
					<Spacer />
					<Input
						placeholder="Value..."
						type="number"
						onValue={(dataPoints) =>
							(newAlarm = newAlarm
								? { ...newAlarm, dataPoints: parseFloat(dataPoints) }
								: undefined)}
					/>
					<Spacer />
					<Info label="Threshold:" />
					<Spacer />
					<Input
						placeholder="Value..."
						type="number"
						onValue={(threshold) =>
							(newAlarm = newAlarm ? { ...newAlarm, threshold: parseFloat(threshold) } : undefined)}
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
				<Section title="Notification strategies:">
					<ButtonList
						items={[
							'Email',
							'SMS',
							'Push Notification',
							'In-App Notification',
							'Web Push',
							'Slack',
							'Microsoft Teams',
							'Webhook',
							'WhatsApp',
							'Telegram',
							'Messenger',
							'Signal',
							'Voice Call'
						]}
						let:item
						selectedItems={newAlarm?.notificationStrategies}
						onSelect={(strategy) =>
							newAlarm
								? (newAlarm = {
										...newAlarm,
										notificationStrategies: newAlarm.notificationStrategies
											? newAlarm.notificationStrategies.includes(strategy)
												? newAlarm.notificationStrategies.filter((it) => it !== strategy)
												: [...newAlarm.notificationStrategies, strategy]
											: [strategy]
									})
								: undefined}
					>
						{item}
					</ButtonList>
				</Section>
			</Dialog>
		</AlertDialog>
	</Section>
{/if}

<style>
	.layer__button {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.list__item {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
