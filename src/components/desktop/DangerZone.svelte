<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCss } from '../../utils/css';
	import Button from '../layout/Button.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		label: string;
		description?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	const { label, description, onclick, children }: Props = $props();
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

	<Stack direction="horizontal" gap="1rem">
		{#if children}
			{@render children()}
		{/if}

		<Button
			icon="cross"
			backgroundColor="var(--red)"
			iconBackgroundColor="var(--black)"
			iconColor="var(--red)"
			padding
			{onclick}
		>
			{label}
		</Button>
	</Stack>
</Stack>
