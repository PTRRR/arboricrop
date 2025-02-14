<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Grid from '../../../components/desktop/Grid.svelte';
	import NotificationCard from '../../../components/desktop/NotificationCard.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import type { Row } from '../../../components/layout/Table.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import { useNotifications } from '../../../stores';
	import { formatDateToDDMMYYYY } from '../../../utils/dates';

	const notifications = useNotifications();

	const selectedNotificationId = $derived($page.url.searchParams.get('id'));
	const selectedNotification = $derived(
		$notifications.find((it) => it.id === selectedNotificationId)
	);

	const infoRows: Row[] = $derived([
		{
			cells: [
				{ label: 'Date', width: '35%' },
				{ label: formatDateToDDMMYYYY(new Date(selectedNotification?.date || '')) }
			]
		},
		{
			cells: [{ label: 'Status', width: '35%' }, { label: selectedNotification?.status || '' }]
		},
		{
			cells: [
				{ label: 'Description', width: '35%' },
				{ label: selectedNotification?.text || '', multiline: true }
			]
		}
	]);
</script>

<Stack style={{ width: '100%' }} direction="horizontal">
	<Stack style={{ width: '100%' }}>
		<Section>
			<PageHeader
				title="Notifications"
				subTitle={`${$notifications.length} unread notifications`}
			/>
			<SearchBar />
			<Grid>
				{#each $notifications as notification}
					<NotificationCard {notification} />
				{/each}
			</Grid>
		</Section>

		<Section label="Archived Notifications">
			<Grid minmax="20rem">
				{#each $notifications as notification}
					<NotificationCard
						notification={{ ...notification, status: 'archived', type: 'notification' }}
					/>
				{/each}
			</Grid>
		</Section>
	</Stack>

	{#if selectedNotification}
		<Section
			label={selectedNotification.title}
			description={selectedNotification.type}
			sticky="var(--content-offset-top)"
			backgroundColor="var(--light-grey)"
		>
			<Table rows={infoRows} />
			<Validation
				validateLabel="Acknowlodge"
				onvalidate={() => {
					goto('/desktop-mvp/notifications');
				}}
				cancelLabel="Close"
				oncancel={() => {
					goto('/desktop-mvp/notifications');
				}}
			/>
		</Section>
	{/if}
</Stack>
