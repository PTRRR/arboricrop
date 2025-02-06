<script lang="ts">
	import { useBlurApp } from '../../stores';
	import { DropdownMenu, Dialog } from 'bits-ui';
	import Button from './Button.svelte';
	import type { Snippet } from 'svelte';
	import type { IconName } from './Icon.svelte';

	type T = $$Generic;

	const {
		label,
		side = undefined,
		sideOffset = 9,
		align = 'center',
		sameWidth = undefined,
		items = [],
		renderItem,
		icon
	}: {
		label: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
		sideOffset?: number;
		align?: 'left' | 'right' | 'center';
		sameWidth?: boolean;
		items: T[];
		renderItem: Snippet<[item: T]>;
		icon?: IconName;
	} = $props();

	let blurApp = useBlurApp();
</script>

<!-- <Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]}>{label}</Button>
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<div
				class="dropdown__content"
				class:dropdown__content--align-left={align === 'left'}
				class:dropdown__content--align-right={align === 'right'}
				class:dropdown__content--align-center={align === 'center'}
			>
				{#each items as item}
					<div class="dropdown__item">
						{@render renderItem(item)}
					</div>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root> -->

<DropdownMenu.Root
	onOpenChange={(open) => {
		blurApp.set(open);
	}}
>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} {icon}>{label}</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content {sideOffset} {side} {sameWidth}>
		<div
			class="dropdown__content"
			class:dropdown__content--align-left={align === 'left'}
			class:dropdown__content--align-right={align === 'right'}
			class:dropdown__content--align-center={align === 'center'}
		>
			{#each items as item}
				<DropdownMenu.Item>
					{@render renderItem(item)}
				</DropdownMenu.Item>
			{/each}
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style lang="scss">
	.dropdown {
		&__content,
		&__content--align-center {
			display: flex;
			flex-direction: column;
			gap: var(--gap);
			align-items: center;
		}

		&__content--align-left {
			align-items: flex-start;
		}

		&__content--align-right {
			align-items: flex-end;
		}
	}
</style>
