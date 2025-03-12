const DB_NAME = 'MyDatabase';
const STORE_NAME = 'files';
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const deleteFileFromIndexedDB = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);

    request.onsuccess = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db) {
        reject('Database not found');

        return;
      }

      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const file = getRequest.result;

        if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
          store.delete(key);
          transaction.oncomplete = () => resolve();
        } else {
          reject('File type is not supported or file not found');
        }
      };

      getRequest.onerror = () => reject('Error retrieving file from IndexedDB');
      transaction.onerror = error => reject(error);
    };

    request.onerror = event =>
      reject(
        (event.target as IDBOpenDBRequest).error || 'Error opening IndexedDB',
      );
  });
};
