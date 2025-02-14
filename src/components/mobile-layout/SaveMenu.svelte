<script lang="ts">
	import ActionMenu from './ActionMenu.svelte';
	import Button from '../layout/Button.svelte';

	const {
		onsave,
		onsaveHref,
		oncancel,
		oncancelHref,
		hidden
	}: {
		onsave?: () => void;
		onsaveHref?: string;
		oncancel?: () => void;
		oncancelHref?: string;
		hidden?: boolean;
	} = $props();
</script>

<ActionMenu>
	{#if oncancel || oncancelHref}
		<Button
			icon="cross"
			iconBackgroundColor="var(--dark-grey)"
			iconSize="large"
			href={oncancelHref}
			onclick={oncancel}
		/>
	{/if}

	{#if onsave || onsaveHref}
		<Button icon="check" iconSize="large" onclick={onsave} href={onsaveHref} />
	{/if}
</ActionMenu>
