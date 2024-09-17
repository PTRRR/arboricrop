<script lang="ts">
	import { goto } from '$app/navigation';
	import Spacer from '../../../../components/Spacer.svelte';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import Separation from '../../../../components/Separation.svelte';
	import { useFields, useLayers, useReturnButton } from '../../../../stores';
	import Button from '../../../../components/Button.svelte';
	import type { Field, MapLayer } from '../../../../utils/types';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { page } from '$app/stores';
	import CenteredWrapper from '../../../../components/wireframe/CenteredWrapper.svelte';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { getCss } from '../../../../utils/css';

	const fields = useFields();
	const layers = useLayers();
	const returnButton = useReturnButton();
	const url = createUrlBuilder();
	const initialField: Field = {
		id: createId(),
		name: '',
		type: '',
		location: { x: 0, y: 0 },
		layers: []
	};

	let selectedLayerIds: string[] = [];

	returnButton.set({
		label: `New field`,
		href: '/mobile-wireframe/fields'
	});
</script>

{#if $page.data.addLayer}
	<CenteredWrapper>
		<ButtonList items={$layers} let:item>
			<div class="layer__button">
				<Button
					minimal
					selected={selectedLayerIds.includes(item.id)}
					on:click={() =>
						selectedLayerIds.includes(item.id)
							? (selectedLayerIds = selectedLayerIds.filter((it) => it !== item.id))
							: (selectedLayerIds = [...selectedLayerIds, item.id])}
				>
					{item.name}
				</Button>
				<div>GeoJSON</div>
			</div>
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
		field={{ ...initialField, layers: selectedLayerIds }}
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
