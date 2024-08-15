<script lang="ts">
	import { useBlurApp } from '../../stores';

	import { DropdownMenu } from 'bits-ui';
	import Button from './Button.svelte';

	export let label: string;
	export let side: 'top' | 'bottom' | 'left' | 'right' | undefined = undefined;
	export let sideOffset: number | undefined = 9;
	export let align: 'left' | 'right' | 'center' = 'center';
	export let sameWidth: boolean | undefined = undefined;

	type T = $$Generic;
	export let items: T[] = [];

	let blurApp = useBlurApp();
</script>

<DropdownMenu.Root
	onOpenChange={(open) => {
		blurApp.set(open);
	}}
>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]}>{label}</Button>
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
					<slot name="item" {item} />
				</DropdownMenu.Item>
			{/each}
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style>
	.dropdown__content,
	.dropdown__content--align-center {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.dropdown__content--align-left {
		align-items: flex-start;
	}

	.dropdown__content--align-right {
		align-items: flex-end;
	}
</style>
