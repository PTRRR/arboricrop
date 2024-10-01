<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Card from '../../components/wireframe/Card.svelte';
	import {
		useDevices,
		useFields,
		useGettingStarted,
		useNotifications,
		useOrganisation,
		useReturnButton,
		useUserName
	} from '../../stores';
	import { filterNotEmpty, shuffle } from '../../utils/arrays';
	import { getDevicesByFieldId } from '../../utils/dummyData';
	import Section from '../../components/wireframe/Section.svelte';
	import Info from '../../components/Info.svelte';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Arboricrop'
	});

	const { gettingStarted, setVisibility } = useGettingStarted();
	const { devices } = useDevices();
	const notifications = useNotifications();
	const { fields } = useFields();
	const organisation = useOrganisation();
	const randomFields = shuffle($fields).splice(0, 5);

	type Section = {
		title: string;
		buttons?: { label: string; href?: string; onClick?: () => void }[];
		infos?: { label: string; value: string }[];
		cards?: {
			title: string;
			subTitle?: string;
			href?: string;
		}[];
	};

	$: sections = [
		{
			title: 'General informations:',
			infos: [
				{
					label: 'Selected account:',
					value: 'Jon Doe'
				},
				$organisation
					? {
							label: 'Selected organisation:',
							value: $organisation
						}
					: undefined
			].filter(filterNotEmpty),
			buttons: [
				{
					label: 'Edit',
					href: '/mobile-wireframe/settings'
				}
			]
		},
		$gettingStarted.visible
			? {
					title: 'Getting Started',
					cards: [
						{
							title: 'Devices Installation',
							href: '/mobile-wireframe/getting-started'
						},
						{
							title: 'Throubleshooting',
							href: '/mobile-wireframe/getting-started'
						}
					],
					buttons: [{ label: 'Hide', onClick: () => setVisibility(false) }]
				}
			: undefined,
		$fields.length > 0
			? {
					title: 'Notifications & Alerts',
					cards: [
						{
							title: `Notifications [${$notifications.filter((it) => it.status !== 'acknowledged').length}]`,
							href: '/mobile-wireframe/notifications'
						}
					]
				}
			: undefined,
		{
			title: 'Recent Fields',
			buttons: [
				{
					label: 'Create new field',
					href: '/mobile-wireframe/fields/new'
				}
			],
			cards: randomFields.map((it) => ({
				title: it.name || '',
				subTitle: `${it.type} [${getDevicesByFieldId($devices, it.id).length} devices]`,
				href: `/mobile-wireframe/fields/${it.id}`
			}))
		}
	].filter(filterNotEmpty) as Section[];
</script>

<div class="home">
	{#each sections as section}
		<Section title={section.title} buttons={section.buttons}>
			<div class="home__section">
				{#each section.infos || [] as info}
					<Info label={info.label} value={info.value} />
				{/each}

				{#each section.cards || [] as card}
					<Card href={card.href}>
						<svelte:fragment slot="title">
							{#if card.title}
								<h1>{card.title}</h1>
							{/if}
						</svelte:fragment>
						<svelte:fragment slot="subTitle">
							{#if card.subTitle}
								<p>{card.subTitle}</p>
							{/if}
						</svelte:fragment>
					</Card>
				{/each}

				{#if section.title === 'Recent Fields'}
					{#if $fields.length === 0}
						<span>No fields</span>
						<Button href="/mobile-wireframe/fields/new">Create new field</Button>
					{:else}
						<Button href="/mobile-wireframe/fields">See all fields</Button>
					{/if}
				{/if}
			</div>
		</Section>
	{/each}
</div>

<style>
	.home__section {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
