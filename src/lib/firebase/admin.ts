import "server-only"

import { getFirestore, type Firestore } from "firebase-admin/firestore"

import { adminApp, isFirebaseAdminConfigured } from "@/lib/firebase/admin-app"

export { isFirebaseAdminConfigured }

export const adminDb: Firestore = getFirestore(adminApp)
