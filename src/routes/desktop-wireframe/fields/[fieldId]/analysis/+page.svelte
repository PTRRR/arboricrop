<script lang="ts">
	import Button from '../../../../../components/wireframe/Button.svelte';
	import Grid from '../../../../../components/wireframe/Grid.svelte';
	import Section from '../../../../../components/wireframe/Section.svelte';
	import { useFields, useMetrics } from '../../../../../stores';
	import { page } from '$app/stores';
	import type { Metric } from '../../../../../utils/types';
	import { goto } from '$app/navigation';
	import Spacer from '../../../../../components/Spacer.svelte';
	import Info from '../../../../../components/wireframe/Info.svelte';
	import Image from '../../../../../components/wireframe/Image.svelte';

	const { fields } = useFields();
	const { metrics, getMetricsByFieldId } = useMetrics();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];

	let selectedMetricFilter: Metric | undefined = undefined;
</script>

{#if fieldMetrics.length > 0}
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
{/if}

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
	{#if fieldMetrics.length > 0}
		<Grid columns={3}>
			{#each fieldMetrics as metric}
				<div>
					<Image ratio={3} placeholder="Graph:" />
					<Spacer />
					<Info label="Metric:" value={metric.type} />
				</div>
			{/each}
		</Grid>
	{:else}
		No metrics
		<Spacer />
		<div>
			<Button href={`/desktop-wireframe/fields/${field?.id}/settings?createMetric=true`}>
				Create new metric
			</Button>
		</div>
	{/if}
</Section>

<style>
	.filters {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
