<script lang="ts">
	import type { Snippet } from 'svelte';

	import Button, { type ButtonIconOrder } from '../layout/Button.svelte';
	import type { IconName, IconSize } from './Icon.svelte';

	interface Props {
		children?: Snippet;
		onclick?: () => void;
		padding?: string | boolean;
		icon?: IconName;
		color?: string;
		backgroundColor?: string;
		iconBackgroundColor?: string;
		iconColor?: string;
		iconOrder?: ButtonIconOrder;
		iconSize?: IconSize;
		href?: string;
	}

	const {
		children,
		onclick,
		padding = true,
		icon = 'navigate',
		color = 'var(--black)',
		backgroundColor = 'var(--grey)',
		iconBackgroundColor = 'var(--black)',
		iconColor = 'var(--white)',
		iconOrder = 'inverted',
		iconSize = 'large',
		href
	}: Props = $props();
</script>

<Button
	{padding}
	{icon}
	{color}
	{backgroundColor}
	{iconBackgroundColor}
	{iconColor}
	{iconOrder}
	{onclick}
	{iconSize}
	{href}
>
	{@render children?.()}
</Button>
