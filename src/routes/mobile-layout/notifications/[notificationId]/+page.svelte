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
	import StatusDot, { type Status } from '../../../../components/mobile-layout/StatusDot.svelte';
	import { getCss } from '../../../../utils/css';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import { goto } from '$app/navigation';

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
				label: 'Notifications',
				backHref: '/mobile-layout/notifications'
			});
		}
	});
</script>

{#if $page.data.acknowledge}
	<PageHeader title="Review" subTitle={notification?.title} />
	<Section>
		<TextareaInput placeholder="Personal note" />
		<SaveMenu
			onsave={() => {
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

				goto('/mobile-layout/notifications');
			}}
			oncancel={() => {
				goto(window.location.pathname);
			}}
		/>
	</Section>
{:else}
	{#snippet pageTitle()}
		<span>{notification?.title}</span>
		<Button
			href={`${window.location.pathname}?acknowledge=true`}
			padding
			icon="check"
			iconOrder="inverted"
			backgroundColor="var(--light-green)"
			iconBackgroundColor="var(--green)">Review</Button
		>
	{/snippet}

	{#snippet pageSubtitle()}
		<div style={getCss({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
			<StatusDot status={notificationStatus} />
			<span>{notification?.type}</span>
		</div>
	{/snippet}

	<PageHeader title={pageTitle} subTitle={pageSubtitle} />
	<Section>
		<Table rows={infoRows} />
	</Section>

	<Section
		label="Actionable insights"
		actions={[
			{
				label: 'Device',
				icon: 'navigate',
				iconOrder: 'inverted',
				href: `/mobile-layout/devices/${notification?.deviceId}`
			}
		]}
	>
		<Image ratio={1} placeholder="Comprehensive schema / animation explaining how to proceed" />
		<p style={getCss({ fontWeight: 'normal' })}>{notification?.actionableInsight}</p>
	</Section>
{/if}
