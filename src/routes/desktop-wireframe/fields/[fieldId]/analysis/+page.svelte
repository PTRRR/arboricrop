<script lang="ts">
	import Button from '../../../../../components/Button.svelte';
	import Grid from '../../../../../components/Grid.svelte';
	import Section from '../../../../../components/wireframe/Section.svelte';
	import { useFields, useMetrics } from '../../../../../stores';
	import { page } from '$app/stores';
	import type { Metric } from '../../../../../utils/types';
	import { goto } from '$app/navigation';
	import Spacer from '../../../../../components/Spacer.svelte';
	import Info from '../../../../../components/Info.svelte';
	import Image from '../../../../../components/wireframe/Image.svelte';

	const { fields } = useFields();
	const { metrics, getMetricsByFieldId } = useMetrics();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];

	let selectedMetricFilter: Metric | undefined = undefined;
</script>

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
	title="Analysis"
	buttons={[
		{
			label: 'Create metric',
			onClick: () => {
				goto(`/desktop-wireframe/fields/${field?.id}/settings?createMetric=true`);
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

<style>
	.filters {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
