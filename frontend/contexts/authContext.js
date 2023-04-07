import {createContext, useContext, useEffect, useState} from 'react';
import {useToast} from '@chakra-ui/react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

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
    fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('Authorization', `Token ${data.token}`);
          setIsLoggedIn(true);
        } else {
          toast({
            title: 'Error',
            description: 'Invalid username or password.',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top'
          });
        }
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      });
  };

  const value = {
    isLoggedIn,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
