<script lang="ts">
	import type { Device, Field, Location, Media, MediaType } from '../../utils/types';
	import { createUrlBuilder } from '../../utils/urls';
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import Dropdown from './Dropdown.svelte';
	import Map from './Map.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { useFields } from '../../stores';
	import Info from './Info.svelte';

	export let device: Device;
	export let onLocation: ((location: Location) => void) | undefined = undefined;
	export let onSetManualLocation: (() => void) | undefined = undefined;
	export let onMedias: ((medias: Media[]) => void) | undefined = undefined;
	export let onChangeField: (() => void) | undefined = undefined;

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
	<Info label="Location:" />
	<Spacer />
	<Map showTarget locations={[device.location || { x: 0, y: 0 }]} onChange={onLocation} />
	<Spacer />
	<Button on:click={() => onSetManualLocation?.()}>Set manual location</Button>
	<Spacer />

	<Info label="Field:" value={selectedField?.name} />
	<Spacer />
	<Button on:click={() => onChangeField?.()}>Change field</Button>
	<Spacer />

	<Info label="Note:" />
	<Spacer />
	<textarea placeholder="Your note..." bind:this={note} value={device?.note || ''} />
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
		<div class="device-form__files">
			{#each device.medias as media}
				<Spacer size="0.5rem" />
				<Button minimal href={`?media=${encodeURIComponent(media.name)}`}>{media.name}</Button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.device-metadata {
		display: flex;
		flex-direction: column;
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
