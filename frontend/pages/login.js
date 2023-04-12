import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import { useForm } from 'react-hook-form';
import { Box, Button, Heading } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import AuthenticationCard from '@/components/AuthenticationCard';
import AuthenticationInputGroup from '@/components/AuthenticationInputGroup';

const LoginPage = () => {
  const { login, isLoggedIn, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shouldSignup, setShouldSignup] = useState(false);

  const { register, handleSubmit } = useForm();

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const onSubmit = ({ username, password }) => {
    shouldSignup ? signup(username, password) : login(username, password);
  };

  if (isLoggedIn === undefined || isLoggedIn) return null;

  return (
    <AuthenticationCard>
      <Box className="flex flex-col items-center justify-center" gap={5}>
        <Heading className="font-bold text-3xl">{shouldSignup ? 'Sign Up' : 'Log In'}</Heading>
        <AuthenticationInputGroup
          register={register}
          registerName={'username'}
          placeholder={'Enter Username'}
          inputRightElementChild={<FaUser />}
          inputRightElementClassName={'flex justify-center pt-4 pb-4'}
        />
        <AuthenticationInputGroup
          register={register}
          registerName={'password'}
          placeholder={'Enter Password'}
          type={showPassword ? 'text' : 'password'}
          inputRightElementChild={
            <Button
              size={'sm'}
              onClick={() => {
                setShowPassword(!showPassword);
              }}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          }
          inputRightElementClassName={'pt-2 pb-2 pr-2'}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center w-[75.5%]">
          <Button colorScheme="blue" rounded="lg" className="p-3 w-full" type={'submit'}>
            {shouldSignup ? 'Sign Up' : 'Log In'}
          </Button>
        </form>
        <Box className="flex justify-center w-[75.5%]">
          <Button
            colorScheme="blue"
            variant="outline"
            rounded="lg"
            className="p-3 w-full"
            onClick={() => {
              setShouldSignup(!shouldSignup);
            }}>
            {shouldSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </Button>
        </Box>
      </Box>
    </AuthenticationCard>
  );
};

export default LoginPage;
