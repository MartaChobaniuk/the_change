/* eslint-disable no-console */
const DB_NAME = 'MyDatabase';
const STORE_NAME = 'files';

const openIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Error opening IndexedDB');
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const deleteImgFromIndexedDB = async (key: string): Promise<void> => {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');

    const deleteRequest = store.delete(key);

    await new Promise<void>((resolve, reject) => {
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject('Error delete file from IndexedDB');
    });

    console.log(`File with key ${key} has been deleted from IndexedDB.`);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
