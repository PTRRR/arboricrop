<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/layout/Button.svelte';
	import Image from '../../../../components/mobile-layout/Image.svelte';
	import { useDevices, useNotifications, useReturnButton } from '../../../../stores';
	import { formatDateToDDMMYYYY } from '../../../../utils/dates';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import TextareaInput from '../../../../components/layout/TextareaInput.svelte';
	import Table, { type Row } from '../../../../components/layout/Table.svelte';
	import StatusDot, { type Status } from '../../../../components/mobile-layout/StatusDot.svelte';
	import { getCss } from '../../../../utils/css';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const returnButton = useReturnButton();
	const notifications = useNotifications();
	const notification = $derived($notifications.find((it) => it.id === $page.params.notificationId));
	const { devices } = useDevices();
	const activeDevices = $derived($devices.filter((it) => it.status === 'active'));

	const infoRows: Row[] = $derived([
		{
			cells: [
				{ label: 'Date', width: '35%' },
				{ label: formatDateToDDMMYYYY(new Date(notification?.date || '')) }
			]
		},
		{
			cells: [{ label: 'Status', width: '35%' }, { label: notification?.status || '' }]
		},
		{
			cells: [
				{ label: 'Description', width: '35%' },
				{ label: notification?.text || '', multiline: true }
			]
		}
	]);

	const notificationStatus: Status = $derived(
		notification?.type === 'alert'
			? 'error'
			: notification?.type === 'warning'
				? 'warning'
				: 'normal'
	);

	$effect(() => {
		if (notification) {
			returnButton.set({
				label: $page.data.acknowledge ? 'Notification' : 'Notifications',
				backHref: $page.data.acknowledge
					? `${data.baseUrl}/notifications/${notification.id}`
					: `${data.baseUrl}/notifications`
			});
		}
	});
</script>

{#if $page.data.acknowledge}
	<Section>
		<PageHeader title="Review" subTitle={notification?.title} />
		<TextareaInput placeholder="Personal note" />
	</Section>
	<ActionMenu>
		<ActionButton
			icon="check"
			href={`${data.baseUrl}/notifications`}
			onclick={async () => {
				if (notification) {
					const notificationIndex = $notifications.findIndex((it) => it.id === notification.id);
					if (notificationIndex > -1) {
						const newNotifications = [...$notifications];
						newNotifications[notificationIndex] = {
							...newNotifications[notificationIndex],
							status: 'acknowledged'
						};
						notifications.set(newNotifications);
					}
				}
			}}
		>
			Save
		</ActionButton>
	</ActionMenu>
{:else}
	{#snippet pageTitle()}
		<span>{notification?.title}</span>
	{/snippet}

	{#snippet pageSubtitle()}
		<div style={getCss({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
			<StatusDot status={notificationStatus} />
			<span>{notification?.type}</span>
		</div>
	{/snippet}

	<Section>
		<PageHeader preTitle="Notification" title={pageTitle} subTitle={pageSubtitle} />
		<Table rows={infoRows} />
	</Section>

	<Section label="Actionable insights">
		<Image ratio={1} placeholder="Comprehensive schema / animation explaining how to proceed" />
		<p style={getCss({ fontWeight: 'normal' })}>{notification?.actionableInsight}</p>
		<Button
			icon="navigate"
			onclick={() => {
				const randomDeviceIndex = Math.floor(Math.random() * activeDevices.length);
				const device = activeDevices[randomDeviceIndex];
				goto(`/mobile-layout/devices/${device.id}`);
			}}>See device</Button
		>
	</Section>

	<ActionMenu>
		<Stack gap="0.5rem">
			<ActionButton
				icon="cross"
				href={`${data.baseUrl}/notifications`}
				onclick={async () => {
					if (notification) {
						const notificationIndex = $notifications.findIndex((it) => it.id === notification.id);
						if (notificationIndex > -1) {
							const newNotifications = [...$notifications];
							newNotifications[notificationIndex] = {
								...newNotifications[notificationIndex],
								status: 'acknowledged'
							};
							notifications.set(newNotifications);
						}
					}
				}}
			>
				Dismiss
			</ActionButton>
			<ActionButton icon="navigate" href={`${window.location.pathname}?acknowledge=true`}>
				Acknowledge
			</ActionButton>
		</Stack>
	</ActionMenu>
{/if}
