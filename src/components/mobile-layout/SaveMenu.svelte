<script lang="ts">
	import ActionMenu from './ActionMenu.svelte';
	import Button from '../layout/Button.svelte';

	const {
		onsave,
		onsaveHref,
		oncancel,
		oncancelHref,
		hidden,
		saveLabel,
		cancelLabel
	}: {
		onsave?: () => void;
		onsaveHref?: string;
		oncancel?: () => void;
		oncancelHref?: string;
		hidden?: boolean;
		saveLabel?: string;
		cancelLabel?: string;
	} = $props();
</script>

{#snippet saveLabelSnippet()}
	{saveLabel}
{/snippet}

{#snippet cancelLabelSnippet()}
	{cancelLabel}
{/snippet}

<ActionMenu>
	{#if oncancel || oncancelHref}
		<Button
			icon="cross"
			iconBackgroundColor="var(--dark-grey)"
			iconOrder="inverted"
			iconSize="large"
			href={oncancelHref}
			onclick={oncancel}
			children={saveLabel ? cancelLabelSnippet : undefined}
		/>
	{/if}

	{#if onsave || onsaveHref}
		<Button
			icon="check"
			iconSize="large"
			onclick={onsave}
			href={onsaveHref}
			backgroundColor="var(--grey)"
			iconOrder="inverted"
			padding={saveLabel ? '0 0 0 0.5rem' : undefined}
			children={saveLabel ? saveLabelSnippet : undefined}
		/>
	{/if}
</ActionMenu>
