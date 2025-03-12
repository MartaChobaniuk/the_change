/* eslint-disable no-console */
export function saveDocToIndexedDB(file: File, key: string): void {
  const request = indexedDB.open('MyDatabase', 2);

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBOpenDBRequest)?.result;

    if (!db) {
      return;
    }

    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');

    store.put(file, key);
    console.log(`File ${key} saved to IndexedDB:`, file);

    transaction.oncomplete = () =>
      console.log(`File ${key} saved successfully`);
    transaction.onerror = () => console.error(`Failed to save file ${key}`);
  };

  request.onerror = () => console.error('Error saving document to IndexedDB');
}
