import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"

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

/**
 * App do Admin SDK compartilhado. Fica isolado num módulo próprio (sem
 * importar `firebase-admin/auth` nem `firebase-admin/firestore`) para que
 * páginas que só precisam do Firestore (ex: listagem de quartos) não
 * arrastem o módulo de Auth para o bundle — ver admin.ts vs admin-auth.ts.
 */
export const adminApp: App = createAdminApp()
