/**
 * Concede (ou revoga) a custom claim `admin` para um usuário do Firebase
 * Auth, liberando o acesso ao painel administrativo (/admin).
 *
 * Uso:
 *   npm run set-admin -- usuario@email.com
 *   npm run set-admin -- usuario@email.com --revoke
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis do Firebase Admin em .env.local.")
  process.exit(1)
}

const email = process.argv[2]
const revoke = process.argv.includes("--revoke")

if (!email) {
  console.error("Uso: npm run set-admin -- usuario@email.com [--revoke]")
  process.exit(1)
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
const auth = getAuth(app)

async function run() {
  const user = await auth.getUserByEmail(email)
  await auth.setCustomUserClaims(user.uid, { admin: !revoke })
  console.log(
    revoke
      ? `Claim admin revogada para ${email}.`
      : `Claim admin concedida para ${email}. Peça para o usuário sair e entrar novamente.`
  )
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro:", error)
    process.exit(1)
  })
