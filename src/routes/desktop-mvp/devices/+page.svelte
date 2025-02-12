<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../components/desktop/Section.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import { formatDateToDDMMYYYY } from '../../../utils/dates';
</script>

<Section label="Available Devices">
	<Table
		headers={[
			{ label: 'ID', width: '20%' },
			{ label: 'Firmware Version', width: '20%' },
			{ label: 'Creation Date' }
		]}
		rows={[
			{
				cells: [
					{ label: createId() },
					{ label: 'v1.0.0' },
					{ label: formatDateToDDMMYYYY(new Date()) }
				]
			}
		]}
	/>
</Section>
