<script lang="ts">
	import Button from '../../../../../components/Button.svelte';
	import Grid from '../../../../../components/Grid.svelte';
	import Section from '../../../../../components/wireframe/Section.svelte';
	import { useFields, useMetrics } from '../../../../../stores';
	import Spacer from '../../../../../components/Spacer.svelte';
	import Info from '../../../../../components/Info.svelte';
	import { page } from '$app/stores';

	const { fields } = useFields();
	const { metrics, getMetricsByFieldId } = useMetrics();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldMetrics = field && $metrics ? getMetricsByFieldId(field.id) : [];
</script>

<Section title=" Analysis reports:">
	<Grid columns={2}>
		{#each fieldMetrics as metric}
			<Section title={metric.type}>
				<Info label="Date:" value="10/09/2024" />
				<Spacer />
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia quaerat laboriosam animi
					culpa eligendi quod veritatis nam omnis, fugiat quibusdam reprehenderit odio quidem
					voluptatem autem exercitationem iure! Eos, alias maiores!
				</p>
				<Spacer />
				<div>
					<Button minimal>Acknowledge report</Button>
				</div>
			</Section>
		{/each}
	</Grid>
</Section>
