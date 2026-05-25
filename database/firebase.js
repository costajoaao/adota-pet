import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDY7WPoAZEOfwdE8nu39nAIQAeFz1_H5Jc",
  authDomain: "adota-pet-6c870.firebaseapp.com",
  projectId: "adota-pet-6c870",
  storageBucket: "adota-pet-6c870.firebasestorage.app",
  messagingSenderId: "647396007711",
  appId: "1:647396007711:web:849bcbd0ae45b81c6cda2a"
}

const app = initializeApp(firebaseConfig)
const autenticacao = getAuth(app)
const db = getFirestore(app)

export { autenticacao, db }