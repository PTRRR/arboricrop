<script lang="ts">
	import { LAYOUT_PORTAL } from '../../routes/mobile-layout/+layout.svelte';
	import { portal } from '../../utils/portal';
	import Spacer from '../Spacer.svelte';
	import ActionMenu from './ActionMenu.svelte';
	import Button, { type ButtonIconOrder } from '../layout/Button.svelte';
	import PageHeader from './PageHeader.svelte';
	import Terminal from './Terminal.svelte';

	let {
		iconOrder,
		onclick,
		opened = $bindable(false),
		subTitle
	}: {
		iconOrder?: ButtonIconOrder;
		onclick?: () => void;
		opened?: boolean;
		subTitle?: string;
	} = $props();
</script>

<Button
	icon="navigate"
	{iconOrder}
	onclick={() => {
		opened = !opened;
		onclick?.();
	}}>Live Data</Button
>

<div class="live-data" class:live-data--opened={opened} use:portal={LAYOUT_PORTAL}>
	<div class="live-data__content">
		<PageHeader title="Live Data" {subTitle} />
		<Spacer />
		<Terminal play={opened} />
	</div>

	{#if opened}
		<ActionMenu>
			<Button icon="cross" iconSize="large" onclick={() => (opened = false)}></Button>
		</ActionMenu>
	{/if}
</div>

<style lang="scss">
	.live-data {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		background-color: var(--white);
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease-in-out;

		&__content {
			padding: 1.5rem;
			width: 100%;
		}

		&--opened {
			opacity: 1;
			pointer-events: initial;
		}
	}
</style>
