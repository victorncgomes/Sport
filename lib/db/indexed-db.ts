// IndexedDB Manager para armazenamento offline
// Sport Club de Natal v0.5.0

const DB_NAME = 'scn-offline-db';
const DB_VERSION = 1;

// Definição de stores
export const STORES = {
    WORKOUTS: 'workouts',
    RESERVATIONS: 'reservations',
    VOLUNTEER_TASKS: 'volunteerTasks',
    GPS_POINTS: 'gpsPoints',
    SYNC_QUEUE: 'syncQueue',
    CACHED_DATA: 'cachedData'
} as const;

// Tipos
export interface WorkoutSession {
    id: string;
    userId: string;
    mode: 'OUTDOOR' | 'INDOOR_TANK' | 'INDOOR_GENERAL';
    status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_SYNC';
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    distance?: number;
    gpsTrackId?: string;
    metadata?: any;
}

export interface GPSPoint {
    id: string;
    workoutId: string;
    lat: number;
    lng: number;
    timestamp: number;
    accuracy: number;
    altitude?: number;
    speed?: number;
    heading?: number;
}

export interface SyncOperation {
    id: string;
    type: 'WORKOUT' | 'RESERVATION' | 'TASK';
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entityId: string;
    data: any;
    createdAt: Date;
    attempts: number;
    lastAttempt?: Date;
    error?: string;
}

// Singleton da conexão
let dbInstance: IDBDatabase | null = null;

// Abrir/criar banco de dados
export async function openDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Store: Workouts
            if (!db.objectStoreNames.contains(STORES.WORKOUTS)) {
                const workoutStore = db.createObjectStore(STORES.WORKOUTS, { keyPath: 'id' });
                workoutStore.createIndex('userId', 'userId', { unique: false });
                workoutStore.createIndex('status', 'status', { unique: false });
                workoutStore.createIndex('startedAt', 'startedAt', { unique: false });
            }

            // Store: GPS Points
            if (!db.objectStoreNames.contains(STORES.GPS_POINTS)) {
                const gpsStore = db.createObjectStore(STORES.GPS_POINTS, { keyPath: 'id' });
                gpsStore.createIndex('workoutId', 'workoutId', { unique: false });
                gpsStore.createIndex('timestamp', 'timestamp', { unique: false });
            }

            // Store: Reservations
            if (!db.objectStoreNames.contains(STORES.RESERVATIONS)) {
                const reservationStore = db.createObjectStore(STORES.RESERVATIONS, { keyPath: 'id' });
                reservationStore.createIndex('userId', 'userId', { unique: false });
                reservationStore.createIndex('status', 'status', { unique: false });
            }

            // Store: Volunteer Tasks
            if (!db.objectStoreNames.contains(STORES.VOLUNTEER_TASKS)) {
                const taskStore = db.createObjectStore(STORES.VOLUNTEER_TASKS, { keyPath: 'id' });
                taskStore.createIndex('userId', 'userId', { unique: false });
                taskStore.createIndex('status', 'status', { unique: false });
            }

            // Store: Sync Queue
            if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
                const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
                syncStore.createIndex('type', 'type', { unique: false });
                syncStore.createIndex('createdAt', 'createdAt', { unique: false });
            }

            // Store: Cached Data (genérico)
            if (!db.objectStoreNames.contains(STORES.CACHED_DATA)) {
                db.createObjectStore(STORES.CACHED_DATA, { keyPath: 'key' });
            }
        };
    });
}

// Operações genéricas
export async function addItem<T>(storeName: string, item: T): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function updateItem<T>(storeName: string, item: T): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getItem<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllItems<T>(storeName: string): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteItem(storeName: string, id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function clearStore(storeName: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Operações específicas para GPS Points
export async function addGPSPoints(points: GPSPoint[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.GPS_POINTS, 'readwrite');
        const store = transaction.objectStore(STORES.GPS_POINTS);

        let completed = 0;
        const total = points.length;

        points.forEach(point => {
            const request = store.add(point);
            request.onsuccess = () => {
                completed++;
                if (completed === total) resolve();
            };
            request.onerror = () => reject(request.error);
        });
    });
}

export async function getGPSPointsByWorkout(workoutId: string): Promise<GPSPoint[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.GPS_POINTS, 'readonly');
        const store = transaction.objectStore(STORES.GPS_POINTS);
        const index = store.index('workoutId');
        const request = index.getAll(workoutId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Operações de Sync Queue
export async function addToSyncQueue(operation: SyncOperation): Promise<void> {
    return addItem(STORES.SYNC_QUEUE, operation);
}

export async function getPendingSyncOperations(): Promise<SyncOperation[]> {
    return getAllItems<SyncOperation>(STORES.SYNC_QUEUE);
}

export async function removeSyncOperation(id: string): Promise<void> {
    return deleteItem(STORES.SYNC_QUEUE, id);
}

// Limpar todos os dados (útil para logout)
export async function clearAllData(): Promise<void> {
    const stores = Object.values(STORES);
    for (const store of stores) {
        await clearStore(store);
    }
}
