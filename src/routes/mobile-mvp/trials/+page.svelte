<script lang="ts">
	import Stack from '../../../components/desktop/Stack.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import EmptyItem from '../../../components/layout/EmptyItem.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Card from '../../../components/mobile-layout/Card.svelte';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import { useCurrentAccount, useProjects, useReturnButton, useTrials } from '../../../stores';
	import { getCss } from '../../../utils/css';
	import type { Trial } from '../../../utils/types';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const { trials } = useTrials();
	const { projects } = useProjects();
	const { currentAccount } = useCurrentAccount();
	const returnButton = useReturnButton();
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));
	const getTrialProject = (trial: Trial) => {
		return $projects.find((it) => it.id === trial.parentId);
	};

	returnButton.set({
		label: '',
		backHref: data.baseUrl
	});
</script>

<Section>
	<PageHeader title="Trials" subTitle={`${accountTrials.length} Trials`} />
	<Stack gap="0.5rem">
		<TextInput />
		<Button icon="search">Search</Button>
	</Stack>
</Section>

<Section>
	{#if accountTrials.length > 0}
		{#each accountTrials as trial}
			<Card
				href={`${data.baseUrl}/trials/${trial.id}`}
				imageUrl="/images/map.png"
				background={true}
			>
				<div class="home__info" style={getCss({ textTransform: 'lowercase' })}>
					<h3>{trial.name}</h3>
					<p>{getTrialProject(trial)?.name}</p>
					<!-- <p>{`${getTrialDeviceCount(trial.id)} Devices`}</p> -->
				</div>
			</Card>
		{/each}
	{:else}
		<EmptyItem label="No trials found" />
	{/if}
</Section>
