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
		icon = 'forward',
		color = 'var(--black)',
		backgroundColor = 'var(--grey)',
		iconBackgroundColor = 'var(--black)',
		iconColor = 'var(--white)',
		iconOrder,
		iconSize = 'medium',
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
	style={{ width: '100%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
>
	{@render children?.()}
</Button>
