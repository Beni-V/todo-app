import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from '@/contexts/authContext';
import TodoList from '../components/TodoList';

const MainPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === undefined) {
      return;
    }

    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn ? <TodoList /> : null;
};

export default MainPage;
