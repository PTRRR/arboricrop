<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SUB_CONTENT_PORTAL } from '../../routes/mobile-layout/+layout.svelte';
	import { useApp } from '../../stores';
	import { portal } from '../../utils/portal';
	import ActionMenu from './ActionMenu.svelte';
	import Button, { type ButtonIconOrder } from './Button.svelte';
	import type { IconName } from './Icon.svelte';

	const { hideContent } = useApp();

	let {
		label,
		icon,
		iconOrder,
		opened = $bindable(false),
		children
	}: {
		label?: string;
		children?: Snippet;
		icon?: IconName;
		iconOrder?: ButtonIconOrder;
		opened?: boolean;
	} = $props();
</script>

<Button
	{icon}
	{iconOrder}
	onclick={() => {
		opened = !opened;
		$hideContent = opened;
	}}
>
	{label}
</Button>

<div class="sub-page" class:sub-page--opened={opened} use:portal={SUB_CONTENT_PORTAL}>
	{@render children?.()}

	<ActionMenu hidden={!opened}>
		<Button
			icon="cross"
			iconSize="large"
			iconBackgroundColor="var(--dark-grey)"
			iconColor="var(--black)"
			onclick={() => {
				opened = !opened;
				$hideContent = opened;
			}}
		></Button>
		<Button
			icon="check"
			iconSize="large"
			iconBackgroundColor="var(--green)"
			onclick={() => {
				opened = !opened;
				$hideContent = opened;
			}}
		></Button>
	</ActionMenu>
</div>

<style lang="scss">
	.sub-page {
		$this: &;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--white);
		z-index: 100;
		padding: 1.5rem;
		opacity: 0;
		pointer-events: none;
		background-color: var(--white);
		font-size: var(--main-font-size);
		padding: 1.5rem;
		padding-bottom: 5rem;
		border-radius: 1.5rem;
		overflow: hidden;
		box-sizing: border-box;
		min-height: calc(
			var(--mobile-app-height) - var(--layout-margin-top) - var(--big-font-size) - 1rem
		);

		&--opened {
			opacity: 1;
			pointer-events: initial;
		}
	}
</style>
