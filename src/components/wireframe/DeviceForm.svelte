<script>
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';

	import Dropdown from './Dropdown.svelte';
</script>

<div class="device-form">
	<label for="">Device id:</label>
	<input type="text" value="dev-iros84fgka9mcka" />
	<label for="">Firmware version:</label>
	<input type="text" value="v1.0.9" />
	<label for="">Device name:</label>
	<input type="text" placeholder="Comprehensive device name..." />
	<label for="">Personal note:</label>
	<textarea placeholder="Your note..." />
	<label for="">Files:</label>
	<Dropdown label="Add media file" items={[{ label: 'Image' }, { label: 'Audio note' }]}>
		<Button slot="item" let:item>{item.label}</Button>
	</Dropdown>
	<label for="">Device group:</label>
	<Dropdown
		label="Select group"
		items={[{ label: 'Tomatoes' }, { label: 'Vignard' }, { label: 'Fruits plantation' }]}
	>
		<Button slot="item" let:item>{item.label}</Button>
	</Dropdown>

	<Spacer size="5rem" />
	<label for="">New firmware version available:</label>
	<Button>Upgrade to v1.1.0</Button>
</div>

<style>
	.device-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
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
