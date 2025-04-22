import { EntityId, Roomy, type EntityIdStr } from '$lib/roomy';
import { StorageManager } from '@muni-town/leaf/storage';
import { SveltePeer } from '@muni-town/leaf/svelte';
import { indexedDBStorageAdapter } from '@muni-town/leaf/storage/indexed-db';
import { webSocketSyncer } from '@muni-town/leaf/sync1/ws-client';
import { Painting } from './components';

const savedCatalogId = localStorage.getItem('catalogId');
const catalogId = new EntityId((savedCatalogId as EntityIdStr) || undefined);
if (!savedCatalogId) localStorage.setItem('catalogId', catalogId.toString());

const peer = new SveltePeer(
	new StorageManager(indexedDBStorageAdapter('mini-paint')),
	await webSocketSyncer(
		new WebSocket('wss://demo.sync.muni.town/sync/as/did:plc:xv2x4dimpe3zukzuynblaiyt', [
			'authorization',
			'demodevtoken'
		])
	)
);
export const roomy = await Roomy.init(peer, catalogId);

export const g = $state({
	/** The currently selected painting. */
	painting: undefined as Painting | undefined
});
