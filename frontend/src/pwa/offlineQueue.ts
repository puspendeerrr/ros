import type { OfflineMutation } from './pwa.types';

const DB_NAME = 'restaurant-os-offline-db';
const STORE_NAME = 'offline-mutations';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: Event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance!);
    };

    request.onerror = (event: Event) => {
      console.error('[PWA Offline DB] Database error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const enqueueMutation = async (
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  payload: unknown
): Promise<void> => {
  const db = await getDB();
  const mutation: OfflineMutation = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    url,
    method,
    payload,
    timestamp: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(mutation);

    request.onsuccess = () => {
      if (import.meta.env.DEV) {
        console.log(`[PWA] Enqueued offline mutation: ${method} ${url}`, payload);
      }
      resolve();
    };

    request.onerror = (e: Event) => {
      console.error('[PWA Offline DB] Failed to enqueue:', (e.target as IDBRequest).error);
      reject((e.target as IDBRequest).error);
    };
  });
};

export const getMutations = async (): Promise<OfflineMutation[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const sorted = ((request.result as OfflineMutation[]) || []).sort((a, b) => a.timestamp - b.timestamp);
      resolve(sorted);
    };

    request.onerror = (e: Event) => {
      reject((e.target as IDBRequest).error);
    };
  });
};

export const deleteMutation = async (id: string): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => { resolve(); };
    request.onerror = (e: Event) => { reject((e.target as IDBRequest).error); };
  });
};

export const clearMutations = async (): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      if (import.meta.env.DEV) console.log('[PWA] Cleared offline mutations queue.');
      resolve();
    };
    request.onerror = (e: Event) => { reject((e.target as IDBRequest).error); };
  });
};

export const replayMutations = async (
  sendRequestFn: (mutation: OfflineMutation) => Promise<unknown>
): Promise<{ success: number; failed: number }> => {
  const mutations = await getMutations();
  if (mutations.length === 0) return { success: 0, failed: 0 };

  if (import.meta.env.DEV) {
    console.log(`[PWA] Replaying ${mutations.length} enqueued offline mutations...`);
  }
  
  let successCount = 0;
  let failedCount = 0;

  for (const m of mutations) {
    try {
      await sendRequestFn(m);
      await deleteMutation(m.id);
      successCount++;
    } catch (err) {
      console.error(`[PWA] Failed to replay mutation ${m.id}:`, err);
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
};
