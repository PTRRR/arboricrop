<script lang="ts">
	import { goto } from '$app/navigation';
	import Spacer from '../../../../components/Spacer.svelte';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import Separation from '../../../../components/Separation.svelte';
	import { useFields, useGeoJSONFeatures, useReturnButton } from '../../../../stores';
	import Button from '../../../../components/Button.svelte';
	import type { Field, GeoJSONFeature, MapLayer } from '../../../../utils/types';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { page } from '$app/stores';
	import CenteredWrapper from '../../../../components/wireframe/CenteredWrapper.svelte';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { getCss } from '../../../../utils/css';
	import { changinCenter } from '../../../../utils/dummyData';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';

	const fields = useFields();
	const features = useGeoJSONFeatures();
	const returnButton = useReturnButton();
	const url = createUrlBuilder();
	const initialField: Field = {
		id: createId(),
		name: '',
		type: '',
		center: changinCenter,
		layers: []
	};

	let selectedFeatures: GeoJSONFeature[] = [];

	returnButton.set({
		label: `New field`,
		href: '/mobile-wireframe/fields'
	});
</script>

{#if $page.data.addLayer}
	<CenteredWrapper>
		<ButtonList items={$features} let:item>
			{#if getFeatureLayerName(item)}
				<div class="layer__button">
					<Button
						minimal
						selected={selectedFeatures.includes(item)}
						on:click={() =>
							selectedFeatures.includes(item)
								? (selectedFeatures = selectedFeatures.filter((it) => it !== item))
								: (selectedFeatures = [...selectedFeatures, item])}
					>
						{getFeatureLayerName(item)}
					</Button>
					<div>GeoJSON</div>
				</div>
			{/if}
		</ButtonList>
		<Spacer />
		<Button>Upload file</Button>
		<Spacer />
		<Spacer />
		<Separation />
		<Spacer />
		<Button href={url.resetQueries([])}>Add</Button>
		<Spacer />
		<Button href={url.resetQueries([])}>Cancel</Button>
	</CenteredWrapper>
{/if}

<div
	class="field__form"
	style={getCss({
		display: $page.data.addLayer ? 'none' : undefined
	})}
>
	<FieldForm
		field={{ ...initialField, layers: selectedFeatures }}
		onSave={(field) => {
			fields.set([...$fields, field]);
			goto(`/mobile-wireframe/fields/${field.id}`);
		}}
		onCancel={() => goto('/mobile-wireframe/fields')}
	>
		<Button href={url.addQuery({ name: 'addLayer', value: true })}>Add layer</Button>
		<Spacer size="var(--gap)" />
		<Separation />
		<Spacer size="0" />
	</FieldForm>
</div>

<style>
	.layer__button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		text-decoration: none !important;
	}

	.layer__button div {
		color: var(--dark-gray);
		text-decoration: none !important;
	}
</style>
