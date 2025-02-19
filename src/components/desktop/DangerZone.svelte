<script lang="ts">
	import Button from '../layout/Button.svelte';
	import StepSeparation from '../layout/StepSeparation.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		label: string;
		description?: string;
		onclick?: () => void;
	}

	const { label, description, onclick }: Props = $props();
</script>

<Stack alignItems="flex-start" gap="2rem">
	<StepSeparation border label="Danger Zone" {description} />
	<Button
		icon="cross"
		backgroundColor="var(--light-red)"
		iconBackgroundColor="var(--red)"
		padding
		{onclick}
	>
		{label}
	</Button>
</Stack>
