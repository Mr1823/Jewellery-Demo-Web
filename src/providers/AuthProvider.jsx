import React, { useEffect, useState } from "react";
import { createContext } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = app ? getAuth(app) : null;

// google provier
const googleProvider = auth ? new GoogleAuthProvider() : null;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sign Up with email/pass
  const signUp = (email, password) => {
    setIsAuthLoading(true);
    if (!auth) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = { uid: "mock-uid", email, displayName: email.split("@")[0] };
          setUser(mockUser);
          localStorage.setItem("ub-jewellers-jwt-token", "mock-token");
          setIsAuthLoading(false);
          resolve({ user: mockUser });
        }, 500);
      });
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user's profile
  const updateUserProfile = (name, photoURL) => {
    setIsAuthLoading(true);
    if (!auth) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setUser((prev) => ({ ...prev, displayName: name, photoURL }));
          setIsAuthLoading(false);
          resolve();
        }, 500);
      });
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Sign In with email/pass
  const signIn = (email, password) => {
    setIsAuthLoading(true);
    if (email === "admin@buildwithus" && password === "Buildwith@us") {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = { uid: "admin-uid", email: "admin@buildwithus", displayName: "Admin" };
          setUser(mockUser);
          localStorage.setItem("ub-jewellers-jwt-token", "mock-token");
          localStorage.setItem("admin-logged-in", "true");
          setIsAuthLoading(false);
          resolve({ user: mockUser });
        }, 500);
      });
    }
    if (!auth) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = { uid: "mock-uid", email, displayName: email.split("@")[0] };
          setUser(mockUser);
          localStorage.setItem("ub-jewellers-jwt-token", "mock-token");
          setIsAuthLoading(false);
          resolve({ user: mockUser });
        }, 500);
      });
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signInGoogle = () => {
    setIsAuthLoading(true);
    if (!auth) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = { uid: "mock-uid", email: "demo@example.com", displayName: "Demo User" };
          setUser(mockUser);
          localStorage.setItem("ub-jewellers-jwt-token", "mock-token");
          setIsAuthLoading(false);
          resolve({ user: mockUser });
        }, 500);
      });
    }
    return signInWithPopup(auth, googleProvider);
  };

  // Sign Out
  const logOut = () => {
    localStorage.removeItem("admin-logged-in");
    if (!auth) {
      return new Promise((resolve) => {
        localStorage.removeItem("ub-jewellers-jwt-token");
        setUser(null);
        setIsAuthLoading(false);
        resolve();
      });
    }
    return signOut(auth);
  };

  // Auth State Observer
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-logged-in") === "true";
    if (isAdmin) {
      setUser({ uid: "admin-uid", email: "admin@buildwithus", displayName: "Admin" });
      setIsAuthLoading(false);
      return;
    }

    if (!auth) {
      const token = localStorage.getItem("ub-jewellers-jwt-token");
      if (token) {
        setUser({ uid: "mock-uid", email: "demo@example.com", displayName: "Demo User" });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.uid !== undefined) {
        setUser(currentUser);
        axios
          .post(`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/jwt`, {
            email: currentUser.email,
          })
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("ub-jewellers-jwt-token", res.data.token);

              localStorage.getItem("ub-jewellers-jwt-token") &&
                setIsAuthLoading(false);
            }
          });
      } else {
        localStorage.removeItem("ub-jewellers-jwt-token");
        setUser(null);
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthLoading,
    signUp,
    updateUserProfile,
    signIn,
    signInGoogle,
    logOut,
    setIsAuthLoading,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
