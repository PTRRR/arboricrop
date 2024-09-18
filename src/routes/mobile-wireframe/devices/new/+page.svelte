<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import DeviceMetadataV2 from '../../../../components/wireframe/DeviceMetadataV2.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import { useDevices, useReturnButton } from '../../../../stores';
	import type { Device } from '../../../../utils/types';
	import { goto } from '$app/navigation';

	const devices = useDevices();
	const returnButton = useReturnButton();

	returnButton.set({
		label: `New Device`,
		href: '/mobile-wireframe'
	});

	let device: Device = {
		id: `dev-${createId()}`,
		name: '',
		medias: [],
		status: 'unactive',
		firmwareVersion: 'v1.0.0',
		fieldId: undefined
	};
</script>

<Section title="Device:">
	<DeviceMetadataV2
		{device}
		editable
		onValues={({ name }) =>
			(device = {
				...device,
				name
			})}
	/>
</Section>
<!-- <Section title="Location:">
	<Info label="Selected field:" value={device.fieldId || '-'} />
	<Spacer />
	<Button>Select field</Button>
</Section> -->
<!-- <Section title="Advanced settings:">
	<Info label="Firmware version:" value={device.firmwareVersion} />
	<Spacer />
	<Button>Upgrate firmware</Button>
</Section> -->
<Section title="Create new device:">
	<SaveSection
		saveLabel="Save new device to account"
		saveDisabled={!device.name}
		onSave={() => {
			devices.set([...$devices, device]);
			goto(`/mobile-wireframe/devices/${device.id}?connected=true`);
		}}
		cancelLabel="Discart"
		onCancel={() => {}}
	/>
</Section>
