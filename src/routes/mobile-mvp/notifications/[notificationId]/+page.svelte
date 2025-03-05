<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/layout/Button.svelte';
	import Image from '../../../../components/mobile-layout/Image.svelte';
	import { useApp, useDevices, useNotifications, useReturnButton } from '../../../../stores';
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
	import PanelOverlay from '../../../../components/mobile-layout/PanelOverlay.svelte';
	import { createUrlBuilder } from '../../../../utils/urls';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const returnButton = useReturnButton();
	const notifications = useNotifications();
	const notification = $derived($notifications.find((it) => it.id === $page.params.notificationId));
	const { devices } = useDevices();
	const activeDevices = $derived($devices.filter((it) => it.status === 'active'));
	const { isBlurred } = useApp();
	const url = createUrlBuilder();

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
				label: $page.data.acknowledge ? 'Notification' : 'Notification',
				backHref: $page.data.acknowledge
					? `${data.baseUrl}/notifications/${notification.id}`
					: `${data.baseUrl}/notifications`
			});
		}
	});

	$effect(() => {
		$isBlurred = $page.data.acknowledge;
	});
</script>

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
	<PageHeader title={pageTitle} subTitle={pageSubtitle} />
	<Table rows={infoRows} />
</Section>

<Section label="Actionable insights">
	<Image ratio={1} placeholder="Comprehensive schema / animation explaining how to proceed" />
	<p style={getCss({ fontWeight: 'normal' })}>{notification?.actionableInsight}</p>
	<div>
		<Button
			icon="forward"
			iconOrder="inverted"
			onclick={() => {
				const randomDeviceIndex = Math.floor(Math.random() * activeDevices.length);
				const device = activeDevices[randomDeviceIndex];
				goto(`/mobile-layout/devices/${device.id}`);
			}}>See device</Button
		>
	</div>
</Section>

{#if $page.data.acknowledge}
	<PanelOverlay>
		<Section>
			<PageHeader title="Acknowledge" subTitle={notification?.title} />
			<TextareaInput label="Note" />
		</Section>
	</PanelOverlay>

	<ActionMenu>
		<ActionButton
			icon="cross"
			onclick={() => {
				$isBlurred = false;
			}}
			href={url.removeQuery({ name: 'acknowledge', value: true })}>Cancel</ActionButton
		>
		<ActionButton
			icon="check"
			href={`${data.baseUrl}/notifications`}
			backgroundColor="var(--light-green)"
			iconColor="var(--light-green)"
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

					$isBlurred = false;
				}
			}}
		>
			Save
		</ActionButton>
	</ActionMenu>
{:else}
	<ActionMenu>
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
		<ActionButton
			icon="check"
			href={url.addQuery({ name: 'acknowledge', value: true })}
			backgroundColor="var(--light-green)"
			iconColor="var(--light-green)"
			onclick={() => ($isBlurred = true)}
		>
			Acknowledge
		</ActionButton>
	</ActionMenu>
{/if}
