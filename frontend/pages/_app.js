import '../styles/globals.css';
import { AuthProvider } from '@/contexts/authContext';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
