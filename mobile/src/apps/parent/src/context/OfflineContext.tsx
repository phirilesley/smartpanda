import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SQLite from 'react-native-sqlite-storage';

// Types
interface OfflineState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingUploads: number;
  pendingDownloads: number;
  lastSyncTime: Date | null;
  offlineData: OfflineDataItem[];
  syncErrors: SyncError[];
}

interface OfflineDataItem {
  id: string;
  type: 'attendance' | 'grades' | 'fees' | 'notices' | 'profile';
  data: any;
  timestamp: Date;
  syncStatus: 'pending' | 'synced' | 'failed';
  retryCount: number;
}

interface SyncError {
  id: string;
  type: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

type OfflineAction =
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'ADD_OFFLINE_DATA'; payload: OfflineDataItem }
  | { type: 'UPDATE_OFFLINE_DATA'; payload: { id: string; updates: Partial<OfflineDataItem> } }
  | { type: 'REMOVE_OFFLINE_DATA'; payload: string }
  | { type: 'SET_PENDING_UPLOADS'; payload: number }
  | { type: 'SET_PENDING_DOWNLOADS'; payload: number }
  | { type: 'SET_LAST_SYNC_TIME'; payload: Date }
  | { type: 'ADD_SYNC_ERROR'; payload: SyncError }
  | { type: 'REMOVE_SYNC_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_DATA' };

// Initial state
const initialState: OfflineState = {
  isOnline: true,
  isSyncing: false,
  pendingUploads: 0,
  pendingDownloads: 0,
  lastSyncTime: null,
  offlineData: [],
  syncErrors: [],
};

// Reducer
const offlineReducer = (state: OfflineState, action: OfflineAction): OfflineState => {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'ADD_OFFLINE_DATA':
      return {
        ...state,
        offlineData: [...state.offlineData, action.payload],
        pendingUploads: state.pendingUploads + 1,
      };
    case 'UPDATE_OFFLINE_DATA':
      return {
        ...state,
        offlineData: state.offlineData.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };
    case 'REMOVE_OFFLINE_DATA':
      return {
        ...state,
        offlineData: state.offlineData.filter(item => item.id !== action.payload),
        pendingUploads: Math.max(0, state.pendingUploads - 1),
      };
    case 'SET_PENDING_UPLOADS':
      return { ...state, pendingUploads: action.payload };
    case 'SET_PENDING_DOWNLOADS':
      return { ...state, pendingDownloads: action.payload };
    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };
    case 'ADD_SYNC_ERROR':
      return { ...state, syncErrors: [...state.syncErrors, action.payload] };
    case 'REMOVE_SYNC_ERROR':
      return {
        ...state,
        syncErrors: state.syncErrors.filter(error => error.id !== action.payload),
      };
    case 'CLEAR_ALL_DATA':
      return { ...initialState, isOnline: state.isOnline };
    default:
      return state;
  }
};

// Context
const OfflineContext = createContext<{
  state: OfflineState;
  dispatch: React.Dispatch<OfflineAction>;
  addOfflineData: (type: string, data: any) => Promise<void>;
  syncData: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
  getOfflineData: (type: string) => OfflineDataItem[];
  retryFailedSyncs: () => Promise<void>;
} | null>(null);

// Provider
export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(offlineReducer, initialState);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  // Initialize database
  useEffect(() => {
    const initDB = () => {
      SQLite.openDatabase(
        {
          name: 'SmartPandaOffline.db',
          location: 'default',
        },
        (database) => {
          setDb(database);
          createTables(database);
          loadOfflineData(database);
        },
        (error) => {
          console.error('Database error:', error);
        }
      );
    };

    initDB();
  }, []);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = state.isConnected ?? false;
      dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });

      // Auto-sync when coming back online
      if (isOnline && state.pendingUploads > 0) {
        syncData();
      }
    });

    return unsubscribe;
  }, []);

  // Create database tables
  const createTables = (database: SQLite.SQLiteDatabase) => {
    database.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS offline_data (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          sync_status TEXT NOT NULL,
          retry_count INTEGER DEFAULT 0
        )
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS sync_errors (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          error TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          retry_count INTEGER DEFAULT 0
        )
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS cached_data (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          expires_at INTEGER NOT NULL
        )
      `);
    });
  };

  // Load offline data from database
  const loadOfflineData = (database: SQLite.SQLiteDatabase) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM offline_data',
        [],
        (_, result) => {
          const items: OfflineDataItem[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            items.push({
              id: row.id,
              type: row.type,
              data: JSON.parse(row.data),
              timestamp: new Date(row.timestamp),
              syncStatus: row.sync_status,
              retryCount: row.retry_count,
            });
          }
          dispatch({ type: 'SET_PENDING_UPLOADS', payload: items.filter(item => item.syncStatus === 'pending').length });
        },
        (_, error) => {
          console.error('Error loading offline data:', error);
        }
      );
    });
  };

  // Add offline data
  const addOfflineData = async (type: string, data: any) => {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineItem: OfflineDataItem = {
      id,
      type: type as any,
      data,
      timestamp: new Date(),
      syncStatus: 'pending',
      retryCount: 0,
    };

    // Save to database
    if (db) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO offline_data (id, type, data, timestamp, sync_status, retry_count) VALUES (?, ?, ?, ?, ?, ?)',
          [id, type, JSON.stringify(data), Date.now(), 'pending', 0],
          () => {
            dispatch({ type: 'ADD_OFFLINE_DATA', payload: offlineItem });
          },
          (_, error) => {
            console.error('Error saving offline data:', error);
          }
        );
      });
    }

    // Also save to AsyncStorage as backup
    try {
      const existingData = await AsyncStorage.getItem('offlineData');
      const offlineData = existingData ? JSON.parse(existingData) : [];
      offlineData.push(offlineItem);
      await AsyncStorage.setItem('offlineData', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  // Sync data to server
  const syncData = async () => {
    if (!state.isOnline || state.isSyncing) return;

    dispatch({ type: 'SET_SYNCING', payload: true });

    try {
      const pendingItems = state.offlineData.filter(item => item.syncStatus === 'pending');
      
      for (const item of pendingItems) {
        try {
          await uploadToServer(item);
          
          // Update status in database
          if (db) {
            db.transaction(tx => {
              tx.executeSql(
                'UPDATE offline_data SET sync_status = ? WHERE id = ?',
                ['synced', item.id],
                () => {
                  dispatch({ type: 'UPDATE_OFFLINE_DATA', payload: { id: item.id, updates: { syncStatus: 'synced' } } });
                }
              );
            });
          }
        } catch (error) {
          console.error('Sync error for item:', item.id, error);
          
          // Update retry count
          const retryCount = item.retryCount + 1;
          if (retryCount < 3) {
            if (db) {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE offline_data SET retry_count = ? WHERE id = ?',
                  [retryCount, item.id],
                  () => {
                    dispatch({ type: 'UPDATE_OFFLINE_DATA', payload: { id: item.id, updates: { retryCount } } });
                  }
                );
              });
            }
          } else {
            // Add to sync errors after 3 retries
            const syncError: SyncError = {
              id: `error_${item.id}`,
              type: item.type,
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date(),
              retryCount,
            };
            
            if (db) {
              db.transaction(tx => {
                tx.executeSql(
                  'INSERT INTO sync_errors (id, type, error, timestamp, retry_count) VALUES (?, ?, ?, ?, ?)',
                  [syncError.id, syncError.type, syncError.error, Date.now(), syncError.retryCount]
                );
              });
            }
            
            dispatch({ type: 'ADD_SYNC_ERROR', payload: syncError });
          }
        }
      }

      dispatch({ type: 'SET_LAST_SYNC_TIME', payload: new Date() });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  // Upload data to server
  const uploadToServer = async (item: OfflineDataItem): Promise<void> => {
    // This would integrate with your API endpoints
    const apiEndpoint = getApiEndpoint(item.type);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(item.data),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  };

  // Get API endpoint for data type
  const getApiEndpoint = (type: string): string => {
    const baseUrl = 'https://api.smartpanda.school/mobile';
    switch (type) {
      case 'attendance':
        return `${baseUrl}/attendance/mark`;
      case 'grades':
        return `${baseUrl}/grades/submit`;
      case 'fees':
        return `${baseUrl}/fees/payment`;
      case 'notices':
        return `${baseUrl}/notices/create`;
      case 'profile':
        return `${baseUrl}/profile/update`;
      default:
        return `${baseUrl}/data/sync`;
    }
  };

  // Get auth token
  const getAuthToken = async (): Promise<string> => {
    try {
      const authData = await AsyncStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return '';
  };

  // Get offline data by type
  const getOfflineData = (type: string): OfflineDataItem[] => {
    return state.offlineData.filter(item => item.type === type);
  };

  // Clear all offline data
  const clearOfflineData = async () => {
    if (db) {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM offline_data');
        tx.executeSql('DELETE FROM sync_errors');
      });
    }

    try {
      await AsyncStorage.removeItem('offlineData');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }

    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  // Retry failed syncs
  const retryFailedSyncs = async () => {
    const failedItems = state.offlineData.filter(item => item.syncStatus === 'failed');
    
    for (const item of failedItems) {
      dispatch({ type: 'UPDATE_OFFLINE_DATA', payload: { id: item.id, updates: { syncStatus: 'pending', retryCount: 0 } } });
      
      if (db) {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE offline_data SET sync_status = ?, retry_count = ? WHERE id = ?',
            ['pending', 0, item.id]
          );
        });
      }
    }

    // Clear sync errors
    if (db) {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM sync_errors');
      });
    }

    dispatch({ type: 'CLEAR_ALL_DATA' });
    
    // Start sync
    if (state.isOnline) {
      await syncData();
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        state,
        dispatch,
        addOfflineData,
        syncData,
        clearOfflineData,
        getOfflineData,
        retryFailedSyncs,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

// Hook
export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
