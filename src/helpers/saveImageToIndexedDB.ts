/* eslint-disable no-console */
export function saveImageToIndexedDB(file: File, key: string): void {
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
  };

  request.onerror = () => console.error('Error saving file to IndexedDB');
}
