import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth } from './firebase';
import {
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signinWithGithub = (email, password) => {
    return signInWithPopup(auth, new GithubAuthProvider()).then((response) => {
      setUser(response.user);
      return response.user;
    });
  };

  const signout = () => {
    return signOut(auth).then(() => {
      setUser(false);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGithub,
    signout
  };
}
