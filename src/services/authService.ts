import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FarmerProfile, MarketPrice, PestAlert, ChatMessage } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const authService = {
  async signup(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const role = email === 'keitanyseguton@gmail.com' ? 'admin' : 'user';
      const profile: FarmerProfile = {
        uid: user.uid,
        name,
        email,
        phone: '',
        location: '',
        crops: [],
        farmSize: 0,
        isPremium: false,
        role: role,
        completeness: 20,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        createdAt: serverTimestamp()
      });
      return profile;
    } catch (error) {
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
      throw error;
    }
  },

  async login(email: string, password: string, rememberMe: boolean = true) {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return this.getUserProfile(userCredential.user.uid);
  },

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if profile exists, if not create one
    let profile = await this.getUserProfile(user.uid);
    if (!profile) {
      const role = user.email === 'keitanyseguton@gmail.com' ? 'admin' : 'user';
      profile = {
        uid: user.uid,
        name: user.displayName || 'Farmer',
        email: user.email || '',
        phone: '',
        location: '',
        crops: [],
        farmSize: 0,
        isPremium: false,
        role: role,
        completeness: 20,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...profile,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
    return profile;
  },

  async logout() {
    await signOut(auth);
  },

  async forgotPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async getUserProfile(uid: string): Promise<FarmerProfile | null> {
    const docRef = doc(db, 'users', uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as FarmerProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  async getCurrentUser(): Promise<FarmerProfile | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          const profile = await this.getUserProfile(user.uid);
          resolve(profile);
        } else {
          resolve(null);
        }
      });
    });
  },

  async updateProfile(updates: Partial<FarmerProfile>) {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const docRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  },

  // Admin Methods
  async getAdminUsers() {
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as FarmerProfile;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getAdminTransactions() {
    const path = 'transactions';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async updateUserRole(userId: string, role: string) {
    const docRef = doc(db, 'users', userId);
    try {
      await updateDoc(docRef, { role });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },

  async updateUserPremium(userId: string, isPremium: boolean) {
    const docRef = doc(db, 'users', userId);
    try {
      await updateDoc(docRef, { isPremium });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },

  // Market Prices
  async getMarketPrices(): Promise<MarketPrice[]> {
    const path = 'marketPrices';
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        } as MarketPrice;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addMarketPrice(data: any) {
    const path = 'marketPrices';
    try {
      await addDoc(collection(db, path), {
        ...data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateMarketPrice(id: string, data: any) {
    const docRef = doc(db, 'marketPrices', id);
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `marketPrices/${id}`);
    }
  },

  async deleteMarketPrice(id: string) {
    const docRef = doc(db, 'marketPrices', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `marketPrices/${id}`);
    }
  },

  // Pest Alerts
  async getPestAlerts(): Promise<PestAlert[]> {
    const path = 'pestAlerts';
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        } as PestAlert;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addPestAlert(data: any) {
    const path = 'pestAlerts';
    try {
      await addDoc(collection(db, path), {
        ...data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updatePestAlert(id: string, data: any) {
    const docRef = doc(db, 'pestAlerts', id);
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pestAlerts/${id}`);
    }
  },

  async deletePestAlert(id: string) {
    const docRef = doc(db, 'pestAlerts', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pestAlerts/${id}`);
    }
  },

  async getAdmins() {
    const path = 'users';
    try {
      const q = query(collection(db, path), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as FarmerProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  }
};

authService.testConnection();
