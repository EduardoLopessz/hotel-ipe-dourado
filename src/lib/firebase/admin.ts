import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
)

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  if (!isFirebaseAdminConfigured) {
    // Permite que a aplicação suba (build/dev) sem credenciais reais.
    // Qualquer chamada ao Firestore/Auth do Admin SDK falhará em runtime
    // com uma mensagem clara até que as variáveis sejam configuradas.
    return initializeApp({ projectId: "hotel-ipe-dourado-placeholder" })
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const adminApp = createAdminApp()

export const adminAuth: Auth = getAuth(adminApp)
export const adminDb: Firestore = getFirestore(adminApp)
