<script lang="ts">
	import { LAYOUT_PORTAL } from '../../routes/mobile-mvp/+layout.svelte';
	import { portal } from '../../utils/portal';
	import Button, { type ButtonIconOrder } from '../layout/Button.svelte';

	import PageHeader from '../layout/PageHeader.svelte';
	import Spacer from '../Spacer.svelte';
	import ActionMenu from './ActionMenu.svelte';

	let {
		iconOrder,
		onclick,
		opened = $bindable(false),
		subTitle,
		padding = true
	}: {
		iconOrder?: ButtonIconOrder;
		onclick?: () => void;
		opened?: boolean;
		subTitle?: string;
		padding?: boolean;
	} = $props();
</script>

<Button
	{iconOrder}
	{padding}
	icon="question"
	onclick={() => {
		opened = !opened;
		onclick?.();
	}}>Help</Button
>

<div class="troubleshoot" class:troubleshoot--opened={opened} use:portal={LAYOUT_PORTAL}>
	<div class="troubleshoot__content">
		<PageHeader title="Troubleshoot" {subTitle} />
		<Spacer />
		<p>If you encounter any issues, please try the following:</p>
		<ol>
			<li>Ensure your device is correctly installed</li>
			<li>Restart the app</li>
			<li>Check for updates</li>
		</ol>
		<p>If the problem persists, feel free to contact us for further assistance:</p>
		<ul>
			<li>Email: support@example.com</li>
			<li>Phone: +1 (555) 123-4567</li>
		</ul>
		<p>Our support team is available Monday to Friday, 9 AM to 5 PM (local time).</p>
	</div>

	{#if opened}
		<ActionMenu>
			<Button
				padding
				icon="cross"
				iconOrder="inverted"
				backgroundColor="var(--grey)"
				onclick={() => (opened = false)}>Close</Button
			>
		</ActionMenu>
	{/if}
</div>

<style lang="scss">
	.troubleshoot {
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

			p {
				color: var(--grey);
			}
		}

		&--opened {
			opacity: 1;
			pointer-events: initial;
		}
	}
</style>
