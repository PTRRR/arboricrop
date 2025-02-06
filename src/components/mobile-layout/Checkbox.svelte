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
				background-color: lightgrey;
				border-radius: 5px;
				display: flex;
				align-items: center;
				padding: var(--padding);
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
				border-radius: calc(5px - var(--padding));
				transition: transform 0.2s;
				transform: translateX(0);
			}

			.checkbox--checked .checkbox__toggle {
				transform: translateX(calc(var(--size)));
			}
		}
	}
</style>
