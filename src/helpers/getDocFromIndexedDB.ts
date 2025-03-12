export function getDocFromIndexedDB(key: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 2);

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest)?.result;

      if (!db) {
        return reject('No database found');
      }

      if (!db.objectStoreNames.contains('files')) {
        return reject('Object store "files" not found');
      }

      const transaction = db.transaction('files', 'readonly');
      const store = transaction.objectStore('files');

      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => reject('Error retrieving file');
    };

    request.onerror = () => reject('Error opening database');

    request.onupgradeneeded = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Заміна "documents" на "files"
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    };
  });
}
