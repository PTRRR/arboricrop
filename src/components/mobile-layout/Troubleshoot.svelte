<script lang="ts">
	import { LAYOUT_PORTAL } from '../../routes/mobile-mvp/+layout.svelte';
	import { useApp } from '../../stores';
	import { portal } from '../../utils/portal';
	import Button, { type ButtonIconOrder } from '../layout/Button.svelte';

	import PageHeader from '../layout/PageHeader.svelte';
	import Spacer from '../Spacer.svelte';
	import ActionButton from './ActionButton.svelte';
	import ActionMenu from './ActionMenu.svelte';
	import PanelOverlay from './PanelOverlay.svelte';

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

	const { isBlurred } = useApp();

	$effect(() => {
		$isBlurred = opened;
	});
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

{#if opened}
	<PanelOverlay>
		<div class="troubleshoot">
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
					<ActionButton
						padding
						icon="cross"
						backgroundColor="var(--grey)"
						onclick={() => (opened = false)}>Close</ActionButton
					>
				</ActionMenu>
			{/if}
		</div>
	</PanelOverlay>
{/if}

<style lang="scss">
	.troubleshoot {
		z-index: 10;
		background-color: var(--white);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: opacity 0.3s ease-in-out;

		&__content {
			width: 100%;

			p {
				color: var(--grey);
			}
		}
	}
</style>
