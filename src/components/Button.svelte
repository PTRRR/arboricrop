<script lang="ts">
	import { Button, type Builder } from 'bits-ui';
	import ButtonInner from './ButtonInner.svelte';

	export let type: 'button' | 'submit' | 'reset' | null | undefined = undefined;
	export let tabIndex: number = 1;
	export let formAction: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let style: string = '';
	export let disabled: boolean = false;
	export let border: boolean = false;
	export let builders: Builder[] = [];
	export let href: string | undefined = undefined;
	export let minimal: boolean = false;
	export let selected: boolean = false;
</script>

{#if href}
	<a class="button" data-sveltekit-preload-data="false" {style} {href} on:click>
		<ButtonInner {disabled} {border} {minimal} {selected}>
			<slot />
		</ButtonInner>
	</a>
{:else}
	<Button.Root
		class="button"
		{style}
		{type}
		{builders}
		{disabled}
		{name}
		tabindex={tabIndex}
		formaction={formAction}
		on:click
	>
		<ButtonInner {disabled} {border} {minimal} {selected}>
			<slot />
		</ButtonInner>
	</Button.Root>
{/if}

<style>
	:global(.button) {
		border-radius: 0;
		border: none;
		background-color: transparent;
		display: flex;
		padding: 0;
		outline: none;
		text-decoration: none;
	}

	:global(.button:hover) {
		text-decoration: none;
	}
</style>
