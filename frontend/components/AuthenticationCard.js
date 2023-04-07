import {Box} from '@chakra-ui/react';

function AuthenticationCard({ children }) {
  return (
    <Box
      minHeight="md"
      className="flex flex-col bg-white w-2/3 drop-shadow-md rounded-lg justify-center max-w-lg">
      {children}
    </Box>
  );
}

export default AuthenticationCard;
