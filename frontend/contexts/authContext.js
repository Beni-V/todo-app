import {createContext, useContext, useEffect, useState} from 'react';
import {useToast} from '@chakra-ui/react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Display error toast with custom description
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

// Handle unsuccessful signup response and display error toast
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

// Handle login response and set isLoggedIn state
function handleLoginResponse(setIsLoggedIn, toast, data) {
  if (data.token) {
    localStorage.setItem('Authorization', `Token ${data.token}`);
    setIsLoggedIn(true);
  } else {
    displayErrorToast(toast, 'Invalid username or password.');
  }
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
