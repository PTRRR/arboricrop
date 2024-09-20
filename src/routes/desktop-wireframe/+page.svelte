<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Separation from '../../components/Separation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import Image from '../../components/wireframe/Image.svelte';
	import { useDevices, useFields } from '../../stores';
	import AlertDialog from '../../components/AlertDialog.svelte';
	import Input from '../../components/Input.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { changinCenter } from '../../utils/dummyData';
	import MapV2 from '../../components/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../components/wireframe/Section.svelte';
	import Info from '../../components/Info.svelte';
	import { goto } from '$app/navigation';

	const { fields } = useFields();
	const devices = useDevices();

	$: getFieldDeviceCount = (fieldId: string) => {
		return $devices.filter((it) => it.fieldId === fieldId).length;
	};

	$: getFieldMarkers = (fieldId: string) =>
		$devices
			.filter((it) => it.location && it.fieldId === fieldId)
			.map((it) => ({ lngLat: it.location as LngLatLike }));

	let newFieldName: string | undefined = undefined;
	let newFieldType: string | undefined = undefined;
</script>

<!-- <Separation title="Analysis Feed:" /> -->

<Section title="Fields:" buttons={[{ label: 'Create new field' }]}>
	<!-- <AlertDialog
		triggerLabel="Create new field"
		cancelLabel="Cancel"
		actionLabel="Create"
		onCancel={() => {
			newFieldName = undefined;
			newFieldType = undefined;
		}}
		onAction={() => {
			if (newFieldName && newFieldType) {
				fields.set([
					...$fields,
					{
						id: `fie-${createId()}`,
						name: newFieldName,
						type: newFieldType,
						layers: [],
						center: changinCenter
					}
				]);
			}

			newFieldName = undefined;
			newFieldType = undefined;
		}}
	>
		<div class="dashboard__new-field">
			<Separation title="New field:" />
			<Input placeholder="Field name" onValue={(value) => (newFieldName = value)} />
			<Input placeholder="Field type" onValue={(value) => (newFieldType = value)} />
		</div>
	</AlertDialog> -->

	<div class="dashboard">
		{#each $fields as field}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a class="dashboard__item" href={`/desktop-wireframe/fields/${field.id}`}>
				<MapV2
					ratio={1.5}
					center={field.center}
					zoom={15}
					interactive={false}
					geoJSONs={field.layers}
					markers={getFieldMarkers(field.id)}
				/>
				<Spacer />
				<div class="dashboard__info">
					<Info label="Name:" value={field.name || '-'} />
					<div class="dashboard__field-data">
						<span>Devices count: {getFieldDeviceCount(field.id)}</span>
						<Button minimal href={`/desktop-wireframe/fields/${field.id}`}>See field</Button>
					</div>
				</div>
			</a>
		{/each}
	</div>
</Section>

<style>
	.dashboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap);
	}

	.dashboard__item {
		display: flex;
		flex-direction: column;
		cursor: pointer;
		color: initial;
		text-decoration: none;
	}

	.dashboard__info {
		display: flex;
		justify-content: space-between;
	}

	.dashboard__field-data {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>
