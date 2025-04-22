<script lang="ts">
	import '../app.css';
	import { Toaster } from 'fuchs';
	
	let { children } = $props();
</script>

{@render children()}

<Toaster />