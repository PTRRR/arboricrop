<script lang="ts">
	import type { Device, Field, Media, MediaType } from '../../utils/types';
	import { createUrlBuilder } from '../../utils/urls';
	import Spacer from '../Spacer.svelte';
	import Button from '../Button.svelte';
	import Dropdown from '../Dropdown.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { useFields } from '../../stores';
	import Info from '../Info.svelte';
	import ButtonList from './ButtonList.svelte';

	export let device: Device;
	export let onMedias: ((medias: Media[]) => void) | undefined = undefined;
	export let onMedia: ((media: Media) => void) | undefined = undefined;
	export let onNote: ((note: string) => void) | undefined = undefined;

	let note: HTMLTextAreaElement;

	const fields = useFields();
	const url = createUrlBuilder();
	const mediaOptions: { label: string; type: MediaType }[] = [
		{ label: 'Image', type: 'image' },
		{ label: 'Audio note', type: 'audio-note' },
		{ label: 'File', type: 'file' }
	];

	let selectedField: Field | undefined = $fields.find((it) => it.id === device.fieldId);
</script>

<div class="device-metadata">
	<Info label="Note:" />
	<Spacer />
	<textarea
		placeholder="Your note..."
		bind:this={note}
		value={device?.note || ''}
		on:input={() => onNote?.(note.value)}
	/>
	<Spacer />
	<Info label="Medias:" />
	<Spacer />
	<Dropdown label="Add media" items={mediaOptions}>
		<Button
			slot="item"
			let:item
			on:click={() => {
				const medias =
					item.type === 'image'
						? [...device.medias, { name: `${createId()}.jpg`, type: item.type }]
						: item.type === 'audio-note'
							? [...device.medias, { name: `${createId()}.mp3`, type: item.type }]
							: [...device.medias, { name: `${createId()}.pdf`, type: item.type }];

				onMedias?.(medias);
			}}
		>
			{item.label}
		</Button>
	</Dropdown>

	{#if device.medias.length > 0}
		<Spacer />
		<ButtonList items={device.medias} let:item>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="device-metadata__media" on:click={() => onMedia?.(item)}>
				<span>{item.name}</span>
				<span>{item.type}</span>
			</div>
		</ButtonList>
	{/if}
</div>

<style>
	.device-metadata {
		display: flex;
		flex-direction: column;
	}

	.device-metadata__media {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	textarea {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
