const DB_NAME = 'manarth-fat-loss-tracker';
const DB_VERSION = 1;

const STORES = {
  dailyLogs: { keyPath: 'date' },
  recipes: { keyPath: 'code' },
  products: { keyPath: 'key' },
  weeklyCheckins: { keyPath: 'weekStart' },
  measurements: { keyPath: 'id' },
  adjustments: { keyPath: 'id' },
  settings: { keyPath: 'key' },
  meta: { keyPath: 'key' },
};

let dbPromise;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [name, options] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, options);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function run(storeName, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result;
    try {
      result = fn(store);
    } catch (error) {
      reject(error);
      return;
    }
    tx.oncomplete = () => resolve(result?.result ?? result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Database transaction aborted.'));
  });
}

export const db = {
  async get(storeName, key) {
    const database = await openDb();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAll(storeName) {
    const database = await openDb();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async put(storeName, value) {
    return run(storeName, 'readwrite', (store) => store.put(value));
  },

  async bulkPut(storeName, values) {
    const database = await openDb();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const value of values) store.put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Database transaction aborted.'));
    });
  },

  async delete(storeName, key) {
    return run(storeName, 'readwrite', (store) => store.delete(key));
  },

  async clear(storeName) {
    return run(storeName, 'readwrite', (store) => store.clear());
  },

  async replaceAll(storeName, values) {
    const database = await openDb();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      for (const value of values) store.put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Database transaction aborted.'));
    });
  },

  async exportAll() {
    const data = {};
    for (const name of Object.keys(STORES)) data[name] = await this.getAll(name);
    return data;
  },

  async replaceDatabase(payload) {
    const database = await openDb();
    const storeNames = Object.keys(STORES);
    return new Promise((resolve, reject) => {
      const tx = database.transaction(storeNames, 'readwrite');
      for (const name of storeNames) {
        const store = tx.objectStore(name);
        store.clear();
        const values = Array.isArray(payload[name]) ? payload[name] : [];
        for (const value of values) store.put(value);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Database restore aborted.'));
    });
  },
};
