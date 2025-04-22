<script lang="ts">
	import '../app.css';
	import { Head, Toaster } from 'fuchs';
	
	let { children } = $props();
</script>

{@render children()}

<Toaster />

<Head title="Roomy Paint" emojiFavicon="🎨" />
