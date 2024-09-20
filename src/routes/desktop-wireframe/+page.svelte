<script>
	import Button from '../../components/Button.svelte';
	import Input from '../../components/Input.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import Section from '../../components/wireframe/Section.svelte';
</script>

<div class="login">
	<div>
		<Section title="Login:">
			<Input placeholder="Email" value="test@vivent.com" />
			<Spacer />
			<Input type="password" placeholder="Password" value="lkasjdhflkjshd" />
			<Spacer />
			<Button href="/desktop-wireframe/dashboard">Login</Button>
		</Section>

		<Section title="Signup:">
			<Button href="/desktop-wireframe/signup">Signup</Button>
		</Section>
	</div>
</div>

<style>
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 10rem;
	}
</style>
