<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Grid from '../../../components/desktop/Grid.svelte';
	import NotificationCard from '../../../components/desktop/NotificationCard.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import type { Row } from '../../../components/layout/Table.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import StatusDot from '../../../components/mobile-layout/StatusDot.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import { useNotifications } from '../../../stores';
	import { formatDateToDDMMYYYY } from '../../../utils/dates';
	import type { NotificationStatus, NotificationType } from '../../../utils/types';

	const notifications = useNotifications();

	let selectedSeverityFilter = $state('');
	let selectedStatusFilter = $state('');
	const severityFilters: NotificationType[] = ['alert', 'warning', 'notification'];
	const statusFilters: NotificationStatus[] = ['acknowledged', 'archived', 'pending'];
	let searchQuery = $state('');

	const filteredNotifications = $derived(
		selectedSeverityFilter || searchQuery
			? $notifications.filter((it) => {
					const typeQuery = searchQuery && it.type.toLowerCase().includes(searchQuery);
					const titleQuery = searchQuery && it.title.toLowerCase().includes(searchQuery);
					const typeFilter = it.type === selectedSeverityFilter;
					const statusFilter = it.status === selectedStatusFilter;

					if (selectedStatusFilter && selectedSeverityFilter && searchQuery) {
						return (typeQuery || titleQuery) && typeFilter && statusFilter;
					} else if (selectedStatusFilter && selectedSeverityFilter) {
						return typeFilter && statusFilter;
					} else if (selectedSeverityFilter && searchQuery) {
						return (typeQuery || titleQuery) && typeFilter;
					} else if (selectedStatusFilter && searchQuery) {
						return (typeQuery || titleQuery) && statusFilter;
					} else if (searchQuery) {
						return typeQuery || titleQuery;
					} else if (selectedSeverityFilter) {
						return typeFilter;
					} else if (selectedStatusFilter) {
						return statusFilter;
					} else {
						true;
					}
				})
			: $notifications
	);

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

			<Stack gap="0.5rem">
				<p>Severity Filters</p>
				<Grid minmax="12rem">
					{#each severityFilters as filter}
						<Button
							backgroundColor="var(--grey)"
							padding
							selected={selectedSeverityFilter === filter}
							onclick={() => {
								if (selectedSeverityFilter === filter) {
									selectedSeverityFilter = '';
								} else {
									selectedSeverityFilter = filter;
								}
							}}
						>
							<Stack direction="horizontal" gap="0.5rem" alignItems="center">
								<StatusDot
									status={filter === 'alert'
										? 'error'
										: filter === 'notification'
											? 'neutral'
											: filter === 'warning'
												? 'warning'
												: 'neutral'}
								/>
								{filter}
							</Stack>
						</Button>
					{/each}
				</Grid>
			</Stack>

			<!-- <Stack gap="0.5rem">
				<p>Status Filters</p>
				<Grid minmax="12rem">
					{#each statusFilters as filter}
						<Button
							backgroundColor="var(--grey)"
							padding
							selected={selectedStatusFilter === filter}
							onclick={() => {
								if (selectedStatusFilter === filter) {
									selectedStatusFilter = '';
								} else {
									selectedStatusFilter = filter;
								}
							}}
						>
							<Stack direction="horizontal" gap="0.5rem" alignItems="center">
								{filter}
							</Stack>
						</Button>
					{/each}
				</Grid>
			</Stack> -->

			<SearchBar bind:value={searchQuery} />
		</Section>

		<Section label="Notifications">
			<Grid minmax="20rem">
				{#each filteredNotifications as notification}
					<NotificationCard selected={notification.id === selectedNotificationId} {notification} />
				{/each}
			</Grid>
		</Section>

		<!-- <Section label="Archived Notifications">
			<Grid minmax="15rem">
				{#each $notifications.slice(0, 4) as notification}
					<NotificationCard
						notification={{ ...notification, status: 'archived', type: 'notification' }}
					/>
				{/each}
			</Grid>
			<Pagination pages={3} />
		</Section> -->
	</Stack>

	{#if selectedNotification}
		<Section
			label={selectedNotification.title}
			description={selectedNotification.type}
			sticky="var(--content-offset-top)"
			backgroundColor="var(--light-grey)"
		>
			<Table rows={infoRows} />
			<Button icon="navigate">See device</Button>
			<Validation
				validateLabel="Acknowlodge"
				onvalidate={() => {
					goto('/desktop-mvp/notifications');
				}}
				cancelLabel="Dismiss"
				oncancel={() => {
					goto('/desktop-mvp/notifications');
				}}
			/>
		</Section>
	{/if}
</Stack>
