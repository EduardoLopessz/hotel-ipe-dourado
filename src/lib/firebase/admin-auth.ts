import "server-only"

import { getAuth, type Auth } from "firebase-admin/auth"

import { adminApp } from "@/lib/firebase/admin-app"

/**
 * Módulo isolado: só é importado pelas Server Actions do painel /admin
 * que precisam verificar o ID token (verifyIdToken/custom claims). Manter
 * `firebase-admin/auth` fora de admin.ts evita puxar essa dependência (e
 * a cadeia jwks-rsa/jose, que quebra o bundling de produção) em páginas
 * que só usam o Firestore, como a listagem de quartos.
 */
export const adminAuth: Auth = getAuth(adminApp)
