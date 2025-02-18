<script lang="ts">
	import { Checkbox } from 'bits-ui';
	import { getCss } from '../../utils/css';

	interface Props {
		size?: string;
		padding?: string;
		initialChecked?: boolean;
		onChange?: (checked: boolean) => void;
		raw?: boolean;
	}

	let props: Props = $props();
</script>

<Checkbox.Root
	class="checkbox"
	checked={props.initialChecked}
	onCheckedChange={(checked) => props.onChange?.(checked === true)}
>
	<Checkbox.Indicator class="checkbox__indicator" let:isChecked>
		{#if props.raw}
			<input type="checkbox" checked={isChecked} />
		{:else}
			<div
				class="checkbox__content"
				class:checkbox--checked={isChecked}
				style={getCss({
					'--size': props.size ?? '1.8rem',
					'--padding': props.padding ?? '2px'
				})}
			>
				<div class="checkbox__toggle"></div>
			</div>
		{/if}
	</Checkbox.Indicator>
</Checkbox.Root>

<style lang="scss">
	:global(.checkbox) {
		background-color: transparent;
		border: none;
		padding: 0;
		display: contents;

		:global(.checkbox__indicator) {
			display: contents;

			input {
				margin: 0;
			}

			.checkbox__content {
				width: calc(var(--size) * 2);
				background-color: lightgrey;
				border-radius: 5px;
				display: flex;
				align-items: center;
				cursor: pointer;
				transition: background-color 0.2s;
			}

			.checkbox--checked {
				background-color: var(--green);
			}

			.checkbox__toggle {
				width: var(--size);
				height: var(--size);
				background-color: white;
				border-radius: 5px;
				transition: transform 0.2s;
				transform: translateX(0);
			}

			.checkbox--checked .checkbox__toggle {
				transform: translateX(101%);
			}
		}
	}
</style>
