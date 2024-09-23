<script lang="ts">
	import { page } from '$app/stores';
	import { useDevices, useFields } from '../../../../stores';
	import { getDevicesByFieldId } from '../../../../utils/dummyData';
	import MapV2 from '../../../../components/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../../../components/wireframe/Section.svelte';
	import Tabs from '../../../../components/Tabs.svelte';
	import type { Tab } from '../../../../utils/types';
	import { goto } from '$app/navigation';

	const { fields } = useFields();
	const devices = useDevices();

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
	$: selectedTab = tabs.find((it) => $page.route.id?.endsWith(`/${it.value}`)) || tabs[0];
</script>

{#if field}
	<Tabs
		{tabs}
		selected={selectedTab}
		onSelect={(tab) => goto(`/desktop-wireframe/fields/${$page.params.fieldId}/${tab.value}`)}
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

			<slot />
		{/if}
	</Tabs>
{/if}
