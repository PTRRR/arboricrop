<script lang="ts">
	import { Checkbox } from 'bits-ui';
	import { getCss } from '../../utils/css';

	interface Props {
		size?: string;
		padding?: string;
		initialChecked?: boolean;
		onChange?: (checked: boolean) => void;
	}

	let props: Props = $props();
</script>

<Checkbox.Root
	class="checkbox"
	checked={props.initialChecked}
	onCheckedChange={(checked) => props.onChange?.(checked === true)}
>
	<Checkbox.Indicator class="checkbox__indicator" let:isChecked>
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

			.checkbox__content {
				width: calc(var(--size) * 2);
				background-color: white;
				border: solid black 1px;
				border-radius: var(--size);
				display: flex;
				align-items: center;
				padding: var(--padding);
				cursor: pointer;
				transition: background-color 0.2s;
				background-color: var(--dark-gray);
			}

			.checkbox--checked {
				background-color: white;
			}

			.checkbox__toggle {
				width: var(--size);
				height: var(--size);
				background-color: black;
				border-radius: 50%;
				transition: transform 0.2s;
				transform: translateX(0);
			}

			.checkbox--checked .checkbox__toggle {
				transform: translateX(calc(var(--size)));
			}
		}
	}
</style>
