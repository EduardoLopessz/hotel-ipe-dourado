import { type FirebaseApp, getApps, initializeApp } from "firebase/app"
import { type Auth, getAuth } from "firebase/auth"
import { type Firestore, getFirestore } from "firebase/firestore"
import { type FirebaseStorage, getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

// O SDK do Firebase Auth valida o formato da apiKey de forma síncrona e
// lança `auth/invalid-api-key` já na chamada de getAuth() quando as
// variáveis de ambiente não estão configuradas (ex: build antes do
// primeiro deploy com credenciais reais). Por isso só inicializamos de
// fato quando a config está presente — caso contrário, auth/db/storage
// ficam `null` e a UI trata esse estado como "não configurado".
export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : null

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null
export const storage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null
