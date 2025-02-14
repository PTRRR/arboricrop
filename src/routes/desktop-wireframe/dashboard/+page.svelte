<script lang="ts">
	import Button from '../../../components/wireframe/Button.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import { useDevices, useFields } from '../../../stores';
	import MapV2 from '../../../components/wireframe/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../../components/wireframe/Section.svelte';
	import Info from '../../../components/wireframe/Info.svelte';

	const { fields } = useFields();
	const { devices } = useDevices();

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

<Section title="Fields:" buttons={[{ label: 'Create new field' }]}>
	<div class="dashboard">
		{#if $fields.length > 0}
			{#each $fields as field}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<a class="dashboard__item" href={`/desktop-wireframe/fields/${field.id}`}>
					<MapV2
						ratio={2.5}
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
		{:else}
			<div>
				No fields
				<Spacer />
				<Button>Create new field</Button>
			</div>
		{/if}
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
