import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { handleLoginResponse, handleUnsuccessfulSignupResponse } from '@/utils/authentication';
import { displayErrorToast } from '@/utils/toast';

// Create a new context for the authentication state.
const AuthContext = createContext();

/**
 * Export a custom hook for accessing the authentication context.
 *
 * @returns {object} - The authentication context.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * A provider component that manages the authentication state and provides it to child components via a context.
 *
 * @param {object} children - The child components to render inside the provider.
 */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const toast = useToast();

  // Check local storage for a saved token and set the `isLoggedIn` state accordingly
  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  /**
   * Attempt to log in using the specified username and password.
   *
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   */
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      handleLoginResponse(setIsLoggedIn, toast, data);
    } catch (error) {
      displayErrorToast(toast, error.message);
    }
  };

  /**
   *Attempt to sign up using the specified username and password.
   *
   *@param {string} username - The user's desired username.
   * @param {string} password - The user's desired password.
   */
  const signup = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 201) {
        login(username, password);
      } else {
        const data = await response.json();
        handleUnsuccessfulSignupResponse(toast, data);
      }
    } catch (error) {
      displayErrorToast(toast, error.message);
    }
  };

  const value = {
    isLoggedIn,
    login,
    signup
  };

  // Render the provider with the authentication context value and child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
