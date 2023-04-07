import '../styles/globals.css';
import { AuthProvider } from '@/contexts/authContext';
import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react';

import chakraTheme from '@chakra-ui/theme';
import Layout from '@/components/Layout';

const { Button, Alert } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    Alert
  }
});
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
