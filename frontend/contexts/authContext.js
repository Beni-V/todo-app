import {createContext, useContext, useEffect, useState} from 'react';
import {useToast} from '@chakra-ui/react';

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
 * Display an error toast with a custom description.
 *
 * @param {function} toast - The toast from `useToast` hook from Chakra UI.
 * @param {string} description - The description to display in the toast.
 */
function displayErrorToast(toast, description) {
  toast({
    title: 'Error',
    description,
    status: 'error',
    duration: 2000,
    isClosable: true,
    position: 'top'
  });
}

/**
 * Handle an unsuccessful signup response by displaying an error toast.
 *
 * By unsuccessful, we mean that the server didn't respond with a 4xx or 5xx status code.
 * We mean that the signup wasn't successful, i.e. the username was already taken, the password was too short, etc.
 *
 * @param {function} toast - The `useToast` hook from Chakra UI.
 * @param {object} data - The response data from the server.
 */
function handleUnsuccessfulSignupResponse(toast, data) {
  let description = '';

  if (data.non_field_errors) {
    description = data.non_field_errors.map((v) => `* ${v}`).join('\n');
  } else {
    description = Object.values(data)
      .map((v) => `* ${v}`)
      .join('\n');
  }

  displayErrorToast(toast, description);
}

/**
 * Handle login response by setting the `isLoggedIn` state and saving the token to local storage.
 *
 * @param {function} setIsLoggedIn - The `useState` hook for managing the authentication state.
 * @param {function} toast - The `useToast` hook from Chakra UI.
 * @param {object} data - The response data from the server.
 */
function handleLoginResponse(setIsLoggedIn, toast, data) {
  if (data.token) {
    localStorage.setItem('Authorization', `Token ${data.token}`);
    setIsLoggedIn(true);
  } else {
    displayErrorToast(toast, 'Invalid username or password.');
  }
}

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
