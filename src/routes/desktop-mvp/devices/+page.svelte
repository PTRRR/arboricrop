<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../components/desktop/Section.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import { formatDateToDDMMYYYY } from '../../../utils/dates';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import { getCss } from '../../../utils/css';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import Spacer from '../../../components/Spacer.svelte';

	interface LabelObject {
		label: string;
	}

	type Device = [LabelObject, LabelObject, LabelObject];

	function generateRandomVersion(): string {
		const major = Math.floor(Math.random() * 5); // 0-4
		const minor = Math.floor(Math.random() * 10); // 0-9
		const patch = Math.floor(Math.random() * 10); // 0-9
		return `v${major}.${minor}.${patch}`;
	}

	function getRandomDate(): Date {
		const today = new Date();
		const lastYear = new Date();
		lastYear.setFullYear(lastYear.getFullYear() - 1);
		return new Date(lastYear.getTime() + Math.random() * (today.getTime() - lastYear.getTime()));
	}

	function generateRandomDevices(count: number): Device[] {
		const devices: Device[] = [];

		for (let i = 0; i < count; i++) {
			const device: Device = [
				{ label: createId() },
				{ label: generateRandomVersion() },
				{ label: formatDateToDDMMYYYY(getRandomDate()) }
			];

			devices.push(device);
		}

		return devices;
	}

	const devices = $state(generateRandomDevices(30));
</script>

<Section label="Available Devices" padding="2rem">
	<div>
		<TextInput label="Query" />
		<Spacer />
		<Button icon="navigate">Search</Button>
	</div>
	<Table
		style={getCss({ width: '100%' })}
		headers={[
			{ label: 'ID', width: '20%' },
			{ label: 'Firmware Version', width: '20%' },
			{ label: 'Creation Date' }
		]}
		rows={devices.map((it) => ({ href: '/', cells: it }))}
	/>
	<Pagination pages={10} />
</Section>
