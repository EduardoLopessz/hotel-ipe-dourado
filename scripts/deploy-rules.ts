/**
 * Publica firestore.rules e storage.rules diretamente via Admin SDK
 * (Security Rules API), usando a mesma chave de serviço do .env.local —
 * sem precisar de `firebase login` interativo.
 *
 * Uso: npm run deploy-rules
 */
import { readFileSync } from "node:fs"
import { config } from "dotenv"
config({ path: ".env.local" })

import { cert, initializeApp } from "firebase-admin/app"
import { getSecurityRules } from "firebase-admin/security-rules"

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis do Firebase Admin em .env.local.")
  process.exit(1)
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
const rules = getSecurityRules(app)

async function run() {
  const firestoreSource = readFileSync("firestore.rules", "utf8")
  await rules.releaseFirestoreRulesetFromSource(firestoreSource)
  console.log("Firestore rules publicadas.")

  const storageSource = readFileSync("storage.rules", "utf8")
  await rules.releaseStorageRulesetFromSource(storageSource, `${projectId}.firebasestorage.app`)
  console.log("Storage rules publicadas.")
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro ao publicar regras:", error)
    process.exit(1)
  })
