<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import Button from './Button.svelte';
	import Separation from './Separation.svelte';
	import Section from './Section.svelte';
	import { useScrollLock } from '../../stores';

	const scrollLock = useScrollLock();

	export let open: boolean = false;
	export let triggerLabel: string | undefined = undefined;
	export let actionDisabled: boolean = false;
	export let actionLabel: string | undefined = undefined;
	export let cancelLabel: string | undefined = undefined;
	export let cancelDisabled: boolean = false;

	export let onAction: (() => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;

	$: {
		$scrollLock = open;
	}
</script>

<AlertDialog.Root {open} preventScroll={false}>
	{#if triggerLabel}
		<AlertDialog.Trigger asChild let:builder>
			<Button builders={[builder]}>{triggerLabel}</Button>
		</AlertDialog.Trigger>
	{/if}

	<AlertDialog.Portal>
		<AlertDialog.Overlay asChild>
			<div class="alert-dialog__overlay"></div>
		</AlertDialog.Overlay>
		<AlertDialog.Content asChild>
			<div class="alert-dialog__content">
				<slot />
				{#if cancelLabel || actionLabel}
					<div>
						<Separation title="Confirm changes:" />
						<div class="alert-dialog__actions">
							{#if cancelLabel}
								<AlertDialog.Cancel asChild let:builder>
									<Button
										disabled={cancelDisabled}
										builders={[builder]}
										on:click={() => onCancel?.()}
									>
										{cancelLabel}
									</Button>
								</AlertDialog.Cancel>
							{/if}
							{#if actionLabel}
								<AlertDialog.Action asChild let:builder>
									<Button
										disabled={actionDisabled}
										builders={[builder]}
										on:click={() => onAction?.()}
									>
										{actionLabel}
									</Button>
								</AlertDialog.Action>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

<style>
	.alert-dialog__overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		background-color: var(--light-gray);
		opacity: 0.9;
	}

	.alert-dialog__content {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 20;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 1rem;
		border: solid 1px black;
		max-height: 75svh;
		overflow: auto;
	}

	.alert-dialog__actions {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
