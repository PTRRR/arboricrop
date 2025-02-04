<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import DeviceMetadataV2 from '../../../../components/wireframe/DeviceGeneralSettings.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import {
		useDeviceIllustration,
		useDevices,
		useNavigationHistory,
		useReturnButton
	} from '../../../../stores';
	import type { Device } from '../../../../utils/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import { Label } from 'bits-ui';
	import Button from '../../../../components/mobile-layout/Button.svelte';

	export let data: PageData;

	const { setVisibility, reset, setUsb, setBlink } = useDeviceIllustration();
	const { devices } = useDevices();
	const returnButton = useReturnButton();
	const { preventNavigationHistory } = useNavigationHistory();

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
		fieldId: data.field || undefined,
		battery: Math.floor(Math.random() * 50 + 50)
	};

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

<Section label="Device:">
	<TextInput label="id" defaultValue={device.id} readonly />
	<TextInput label="name" autoFocus onvalue={(value) => (device.name = value)} />
	<!-- <DeviceMetadataV2
		{device}
		editable
		onValues={({ name }) =>
			(device = {
				...device,
				name
			})}
	/> -->
</Section>
<Section label="Confirm:">
	<Button
		onclick={() => {
			$preventNavigationHistory = true;
			devices.set([...$devices, device]);
			goto(`/mobile-layout/devices/${device.id}?connected=true`);
		}}
	>
		Save new device
	</Button>
	<Button>Cancel</Button>
</Section>
