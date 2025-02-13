<script lang="ts">
	import type { Device } from '../../../utils/types';
	import { useCurrentAccount, useDevices } from '../../../stores';
	import Section from '../../../components/desktop/Section.svelte';
	import StatusDot from '../../../components/mobile-layout/StatusDot.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import TextareaInput from '../../../components/layout/TextareaInput.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import DevicesList from '../../../components/desktop/DevicesList.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';

	const { devices, updateDevice } = useDevices();
	const { currentAccount } = useCurrentAccount();
	let selectedDevice = $state<Device | undefined>(undefined);
	let deviceName = $state('');
	let deviceNote = $state('');

	const selectedDeviceHasChanges = $derived(
		selectedDevice &&
			((selectedDevice.name || '') !== deviceName || (selectedDevice.note || '') !== deviceNote)
	);

	const accountDevices = $derived(
		$devices.filter((it) => it.accountId === $currentAccount?.id).slice(0, 30)
	);
</script>

<Stack direction="horizontal" style={{ width: '100%' }} alignItems="flex-start">
	<Section fill>
		<PageHeader title="Account Devices" subTitle={`${accountDevices.length} Available Devices`} />
		<SearchBar />
		<DevicesList
			devices={accountDevices}
			multi={false}
			onselect={([device]) => {
				selectedDevice = selectedDevice?.id === device?.id ? undefined : device;
				deviceName = selectedDevice?.name || '';
				deviceNote = selectedDevice?.note || '';
			}}
		/>
	</Section>

	{#if selectedDevice}
		{#snippet deviceLabel()}
			<Stack direction="horizontal" gap="0.5rem" alignItems="center">
				<StatusDot status={selectedDevice?.status === 'active' ? 'success' : 'neutral'} />
				{selectedDevice?.name}
			</Stack>
		{/snippet}

		<Section
			label={deviceLabel}
			description={selectedDevice.status}
			backgroundColor="var(--light-grey)"
			width="30%"
			sticky="var(--content-offset-top)"
		>
			<TextInput label="ID" value={selectedDevice.id} readonly />
			<TextInput label="Version" value={selectedDevice.firmwareVersion} readonly />
			<TextInput label="Name" bind:value={deviceName} />
			<TextareaInput label="Note" bind:value={deviceNote} />

			<Stack gap="0.5rem" direction="horizontal">
				<Button
					icon="check"
					disabled={!selectedDeviceHasChanges}
					backgroundColor="var(--light-green)"
					iconBackgroundColor="var(--green)"
					padding
					onclick={() => {
						if (!selectedDevice) return;

						updateDevice({
							...selectedDevice,
							name: deviceName,
							note: deviceNote
						});

						selectedDevice = accountDevices.find((it) => it.id === selectedDevice?.id);
					}}
				>
					Save
				</Button>
				<Button
					icon="cross"
					backgroundColor="var(--grey)"
					padding
					onclick={() => (selectedDevice = undefined)}
				>
					Close
				</Button>
			</Stack>
		</Section>
	{/if}
</Stack>
