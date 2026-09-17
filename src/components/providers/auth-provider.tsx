"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

import { auth, db, isFirebaseConfigured } from "@/lib/firebase/client"
import type { Address } from "@/lib/types"

interface CadastroParams {
  nome: string
  email: string
  senha: string
  telefone: string
  endereco: Address
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  configured: boolean
  cadastrar: (params: CadastroParams) => Promise<void>
  entrar: (email: string, senha: string) => Promise<void>
  entrarComGoogle: () => Promise<void>
  sair: () => Promise<void>
  recuperarSenha: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const NOT_CONFIGURED_MESSAGE =
  "O Firebase ainda não foi configurado neste ambiente. Adicione as variáveis NEXT_PUBLIC_FIREBASE_* para habilitar login e cadastro."

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!auth) {
      // isFirebaseConfigured já inicializa `loading` como false neste caso.
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function cadastrar({ nome, email, senha, telefone, endereco }: CadastroParams) {
    if (!auth || !db) throw new Error(NOT_CONFIGURED_MESSAGE)

    const credential = await createUserWithEmailAndPassword(auth, email, senha)
    await updateProfile(credential.user, { displayName: nome })

    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      nome,
      email,
      telefone,
      criadoEm: serverTimestamp(),
    })

    await setDoc(doc(db, "users", credential.user.uid, "addresses", "principal"), endereco)
  }

  async function entrar(email: string, senha: string) {
    if (!auth) throw new Error(NOT_CONFIGURED_MESSAGE)
    await signInWithEmailAndPassword(auth, email, senha)
  }

  async function entrarComGoogle() {
    if (!auth || !db) throw new Error(NOT_CONFIGURED_MESSAGE)

    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)

    await setDoc(
      doc(db, "users", credential.user.uid),
      {
        uid: credential.user.uid,
        nome: credential.user.displayName ?? "",
        email: credential.user.email ?? "",
        telefone: credential.user.phoneNumber ?? "",
        criadoEm: serverTimestamp(),
      },
      { merge: true }
    )
  }

  async function sair() {
    if (!auth) return
    await firebaseSignOut(auth)
  }

  async function recuperarSenha(email: string) {
    if (!auth) throw new Error(NOT_CONFIGURED_MESSAGE)
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: isFirebaseConfigured,
        cadastrar,
        entrar,
        entrarComGoogle,
        sair,
        recuperarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
