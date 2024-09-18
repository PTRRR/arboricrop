<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Card from '../../components/wireframe/Card.svelte';
	import { useDevices, useFields, useNotifications, useReturnButton } from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import { getDevicesByFieldId } from '../../utils/dummyData';
	import Section from '../../components/wireframe/Section.svelte';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Arboricrop'
	});

	const devices = useDevices();
	const notifications = useNotifications();
	const fields = useFields();
	const randomFields = shuffle($fields).splice(0, 5);

	type Section = {
		title: string;
		buttons?: { label: string; href?: string; onClick?: () => void }[];
		cards: {
			title: string;
			subTitle?: string;
			href?: string;
		}[];
	};

	const sections: Section[] = [
		{
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
			]
		},
		{
			title: 'Notifications & Alerts',
			cards: [
				{
					title: `Notifications [${$notifications.filter((it) => it.status !== 'acknowledged').length}]`,
					href: '/mobile-wireframe/notifications'
				}
			]
		},
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
	];
</script>

<div class="home">
	{#each sections as section}
		<Section title={section.title} buttons={section.buttons}>
			<div class="home__section">
				{#each section.cards as card}
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
					<Button href="/mobile-wireframe/fields">See all fields</Button>
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
