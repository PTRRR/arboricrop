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
	import { createUrlBuilder } from '../../../../utils/urls';
	import Button from '../../../../components/Button.svelte';
	import Spacer from '../../../../components/Spacer.svelte';

	let map: MapV2;

	const { fields, updateField } = useFields();
	const devices = useDevices();
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
	$: selectedTab = tabs.find((it) => $page.route.id?.endsWith(`/${it.value}`)) || tabs[0];
	$: editMap = !!$page.data.editMap;
</script>

{#if field}
	<Tabs
		{tabs}
		selected={selectedTab}
		onSelect={(tab) => goto(`/desktop-wireframe/fields/${$page.params.fieldId}/${tab.value}`)}
	>
		{#if field}
			<Section
				title="Map:"
				buttons={[
					{
						label: $page.data.editMap ? 'Cancel' : 'Edit',
						onClick: () =>
							$page.data.editMap
								? goto(url.removeQuery({ name: 'editMap' }))
								: goto(`/desktop-wireframe/fields/${$page.params.fieldId}/settings?editMap=true`, {
										replaceState: true,
										invalidateAll: true
									})
					}
				]}
			>
				<MapV2
					bind:this={map}
					ratio={3}
					center={field.center}
					interactive={editMap}
					zoom={15.5}
					minZoom={10}
					maxZoom={19}
					geoJSONs={field.layers}
					markers={editMap ? [{ lngLat: field.center }] : deviceMarkers}
					showTarget={editMap}
				/>

				{#if editMap}
					<div>
						<Spacer />
						<Button
							href={url.removeQuery({ name: 'editMap' })}
							on:click={() => {
								if (field) {
									const location = map.getCenter();
									updateField({
										...field,
										center: [location.lng, location.lat]
									});
								}
							}}
						>
							Reset location
						</Button>
					</div>
				{/if}
			</Section>

			<slot />
		{/if}
	</Tabs>
{/if}
