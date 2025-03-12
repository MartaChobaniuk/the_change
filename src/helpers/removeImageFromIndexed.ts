/* eslint-disable no-console */
export function removeImageFromIndexedDB(key: string): void {
  const request = indexedDB.open('MyDatabase', 2);

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBOpenDBRequest)?.result;

    if (!db) {
      return;
    }

    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');

    const deleteRequest = store.delete(key);

    deleteRequest.onsuccess = () => {
      console.log(`File ${key} removed from IndexedDB`);
    };

    deleteRequest.onerror = () => {
      console.error(`Error removing file ${key} from IndexedDB`);
    };
  };

  request.onerror = () => console.error('Error opening IndexedDB');
}
