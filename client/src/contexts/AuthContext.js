import {
    createContext, useContext,
    useEffect, useState
} from "react";
import { Octokit } from "@octokit/core";
import { auth } from '../utils/init-firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    confirmPasswordReset,
    sendEmailVerification,
    applyActionCode,
    fetchSignInMethodsForEmail,
    signInWithRedirect,
    getRedirectResult,
    linkWithCredential, EmailAuthProvider, getUserByEmail, getAuth, deleteUser
} from "firebase/auth"
import { useMessageBox } from "./MessageBox";
import axios from 'axios';

const AuthContext = createContext({
    currentUser: null,
    register: () => Promise,
    login: () => Promise,
    logout: () => Promise,
    signInWithGoogle: () => Function,
    signInWithGithub: () => Function,
    forgotPassword: () => Promise,
    resetPassword: () => Promise,
    sendEmailForVerification: () => Promise,
    confirmEmailVerification: () => Promise,
})


export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({ loading: true });
    const { setMessageBox } = useMessageBox();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) setCurrentUser(user);
            else setCurrentUser(undefined);
        })
        return () => {
            unsubscribe()
        }
    }, [])


    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        localStorage.clear();
        return signOut(auth);
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function signInWithGithub() {
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function forgotPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function resetPassword(oobCode, newPassword) {
        return confirmPasswordReset(auth, oobCode, newPassword);
    }

    function sendEmailForVerification(user) {
        return sendEmailVerification(user);
    }

    function confirmEmailVerification(oobCode) {
        return applyActionCode(auth, oobCode);
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        signInWithGoogle,
        signInWithGithub,
        forgotPassword,
        resetPassword,
        sendEmailForVerification,
        confirmEmailVerification,

    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}



