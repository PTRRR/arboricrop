<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import {
		useCurrentAccount,
		useDeviceIllustration,
		useDevices,
		useNavigationHistory,
		useReturnButton
	} from '../../../../stores';
	import type { Device } from '../../../../utils/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';

	export let data: PageData;

	const { setVisibility, reset, setUsb, setBlink } = useDeviceIllustration();
	const { devices } = useDevices();
	const returnButton = useReturnButton();
	const { currentAccount } = useCurrentAccount();
	const { preventNavigationHistory } = useNavigationHistory();

	returnButton.set({
		label: `Group`,
		backHref: `${data.baseUrl}/groups/${data.group}`
	});

	let device: Device = {
		id: `dev-${createId()}`,
		name: '',
		medias: [],
		status: 'unactive',
		firmwareVersion: 'v1.0.0',
		fieldId: data.field || undefined,
		parentId: data.group || undefined,
		battery: Math.floor(Math.random() * 50 + 50),
		accountId: $currentAccount?.id
	};

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

<Section>
	<PageHeader title="New Device" />
	<TextInput label="id" defaultValue={device.id} readonly />
	<TextInput label="name" autoFocus onvalue={(value) => (device.name = value)} />
</Section>

<ActionMenu>
	<ActionButton
		disabled={!device.name}
		icon="check"
		backgroundColor={device.name ? 'var(--light-green)' : 'var(--grey)'}
		iconColor="var(--light-green)"
		href={`${data.baseUrl}/devices/${device.id}?connected=true`}
		onclick={() => {
			$preventNavigationHistory = true;
			devices.set([...$devices, device]);
		}}
	>
		Create
	</ActionButton>
</ActionMenu>
