import { Box } from '@chakra-ui/react';

function Layout({ children }) {
  return (
    <Box className="flex items-center justify-center w-screen h-screen bg-gray-200 p-4">
      {children}
    </Box>
  );
}

export default Layout;
