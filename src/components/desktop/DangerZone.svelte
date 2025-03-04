<script lang="ts">
	import { getCss } from '../../utils/css';
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

<Stack
	alignItems="flex-start"
	gap="2rem"
	style={{ backgroundColor: 'var(--light-red)', padding: '0.5rem', borderRadius: '5px' }}
>
	<div>
		<h4 style={getCss({ fontSize: 'var(--mid-font-size)' })}>Danger Zone</h4>
		<p style={getCss({ fontSize: 'var(--main-font-size)' })}>{description}</p>
	</div>
	<!-- <StepSeparation label="Danger Zone" {description} /> -->
	<Button
		icon="cross"
		backgroundColor="var(--grey)"
		iconBackgroundColor="var(--black)"
		iconColor="var(--grey)"
		padding
		{onclick}
	>
		{label}
	</Button>
</Stack>
