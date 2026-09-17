/**
 * Popula o Firestore com os dados de exemplo (roomTypes e amenities)
 * definidos em src/lib/constants.ts. Requer as variáveis de ambiente
 * FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL e
 * FIREBASE_ADMIN_PRIVATE_KEY configuradas em .env.local.
 *
 * Uso: npm run seed
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import { AMENITIES, ROOM_TYPES } from "../src/lib/constants"

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Faltam variáveis do Firebase Admin. Configure FIREBASE_ADMIN_PROJECT_ID, " +
      "FIREBASE_ADMIN_CLIENT_EMAIL e FIREBASE_ADMIN_PRIVATE_KEY em .env.local antes de rodar o seed."
  )
  process.exit(1)
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
const db = getFirestore(app)

async function seed() {
  console.log(`Semeando ${ROOM_TYPES.length} tipos de quarto...`)
  for (const room of ROOM_TYPES) {
    const { id, ...data } = room
    await db.collection("roomTypes").doc(id).set(data)
  }

  console.log(`Semeando ${AMENITIES.length} comodidades...`)
  for (const amenity of AMENITIES) {
    const { id, ...data } = amenity
    await db.collection("amenities").doc(id).set(data)
  }

  console.log("Seed concluído com sucesso.")
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro ao rodar o seed:", error)
    process.exit(1)
  })
