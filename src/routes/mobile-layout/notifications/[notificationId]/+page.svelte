<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Image from '../../../../components/mobile-layout/Image.svelte';
	import { useNotifications, useReturnButton } from '../../../../stores';
	import { formatDateToDDMMYYYY } from '../../../../utils/dates';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import TextareaInput from '../../../../components/mobile-layout/TextareaInput.svelte';
	import Table, { type Row } from '../../../../components/mobile-layout/Table.svelte';

	const returnButton = useReturnButton();
	const notifications = useNotifications();
	const notification = $derived($notifications.find((it) => it.id === $page.params.notificationId));

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

	$effect(() => {
		if (notification) {
			returnButton.set({
				label: notification?.title || '',
				href: '/mobile-wireframe/notifications'
			});
		}
	});
</script>

{#if $page.data.acknowledge}
	<PageHeader title="Acknowledge" subTitle={notification?.title} />
	<Section>
		<TextareaInput placeholder="Personal note" />
		<Button
			href="/mobile-wireframe/notifications"
			onclick={() => {
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
			Confirm
		</Button>
		<Button href={window.location.pathname}>Cancel</Button>
	</Section>
{:else}
	{#snippet pageTitle()}
		<span>{notification?.title}</span>
		<Button href={`${window.location.pathname}?acknowledge=true`}>Acknowledge</Button>
	{/snippet}
	<PageHeader title={pageTitle} subTitle={notification?.type} />
	<Section>
		<Table rows={infoRows} />
	</Section>

	<Section label="Actionable insights" description={notification?.actionableInsight}>
		<Image ratio={1} placeholder="Comprehensive schema / animation explaining how to proceed" />
		<Button href={`/mobile-wireframe/devices/${notification?.deviceId}`}>See device</Button>
	</Section>
{/if}
