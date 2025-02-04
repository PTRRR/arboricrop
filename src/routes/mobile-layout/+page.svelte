<script lang="ts">
	import Button from '../../components/mobile-layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/mobile-layout/TextInput.svelte';
	import { useDevices, useFields } from '../../stores';
	import { getCss } from '../../utils/css';
	import { goto } from '$app/navigation';
	import CenteredWrapper from '../../components/mobile-layout/CenteredWrapper.svelte';

	const { devices } = useDevices();
	const { fields } = useFields();
	let newFieldName = $state<string | number>('');

	const getFieldDeviceCount = (fieldId: string) => {
		return $devices.filter((it) => it.fieldId === fieldId).length;
	};
</script>

{#if $fields.length === 0}
	<CenteredWrapper>
		<Section label="Create first field">
			<TextInput label="Name" onvalue={(name) => (newFieldName = name)} />
			<Button
				href={`/mobile-layout/fields/new/?name=${newFieldName}`}
				disabled={!newFieldName}
				fitWidth
			>
				Create
			</Button>
		</Section>
	</CenteredWrapper>
{:else}
	<Section
		label="Fields"
		actions={[{ label: '+ Create new', onclick: () => goto('/mobile-layout/fields/new') }]}
	>
		{#each $fields as field}
			<Card href={`/mobile-layout/fields/${field.id}`} imageUrl="/images/map.png">
				<div>
					<p>Name: {field.name}</p>
					<p style={getCss({ fontWeight: 'normal', fontSize: '1rem' })}>
						Devices: {getFieldDeviceCount(field.id)}
					</p>
				</div>
			</Card>
		{/each}
	</Section>
{/if}
