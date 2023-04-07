import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from '@/contexts/authContext';
import {useForm} from 'react-hook-form';
import {Box, Button, Heading, Input, InputGroup, InputRightElement} from '@chakra-ui/react';
import {FaUser} from 'react-icons/fa';

const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm();

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const onSubmit = ({ username, password }) => {
    console.log(username, password);
    login(username, password);
  };

  return isLoggedIn === undefined || isLoggedIn ? null : (
    <Box className="flex items-center justify-center w-screen h-screen bg-gray-200 p-4">
      <Box
        minHeight="md"
        className="flex flex-col bg-white w-2/3 drop-shadow-md rounded-lg justify-center max-w-lg">
        <Box className="flex flex-col items-center justify-center" gap={5}>
          <Heading className="font-bold text-3xl">Log In</Heading>
          <InputGroup maxWidth="75%" className="flex justify-center items-center">
            <Input
              placeholder="Enter Username"
              className="border-black border w-full rounded p-3"
              {...register('username')}
            />
            <InputRightElement className="flex justify-center pt-4 pr-4">
              <FaUser />
            </InputRightElement>
          </InputGroup>
          <InputGroup maxWidth="75%" className="flex justify-center items-center">
            <Input
              placeholder="Enter Password"
              type={showPassword ? 'text' : 'password'}
              className="border-black border w-full rounded p-3"
              {...register('password')}
            />
            <InputRightElement className="pt-2 pr-2">
              <Button
                size={'sm'}
                onClick={() => {
                  setShowPassword(!showPassword);
                }}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center w-[75.5%]">
            <Button colorScheme="blue" rounded="lg" className="p-3 w-full" type={'submit'}>
              Login
            </Button>
          </form>
          <Box className="flex justify-center w-[75.5%]">
            <Button colorScheme="blue" variant="outline" rounded="lg" className="p-3 w-full">
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
