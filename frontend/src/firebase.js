import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

import {firebaseConfig} from './secret'

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth();

export const storage = firebase.storage();