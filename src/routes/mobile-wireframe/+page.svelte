<script lang="ts">
	import Button from '../../components/wireframe/Button.svelte';
	import Menu from '../../components/wireframe/Menu.svelte';

	let menuActions = [
		{
			label: 'Home',
			href: '/mobile-wireframe'
		},
		{
			label: 'User',
			href: '/mobile-wireframe/user'
		}
	];
</script>

<Menu actions={menuActions}>
	<Button href="/mobile-wireframe/user">Hello</Button>
	<Button slot="action" let:action href={action.href}>{action.label}</Button>
</Menu>

<div class="home-page">
	<h1>;laksd;lkj</h1>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
	<p>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quo totam unde, adipisci
		harum pariatur mollitia in? Quibusdam optio earum dolor. Distinctio dicta saepe quas
		reprehenderit minus maiores ipsum aliquam!
	</p>
</div>

<style>
	.home-page {
		padding: 5rem 1rem 0 1rem;
	}
</style>
