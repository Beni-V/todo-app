import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

const TodoItem = ({ title, onDelete, onComplete, innerRef, draggableProps, dragHandleProps }) => (
  <Box
    className="flex justify-start rounded-lg text-center m-2 p-3 justify-between bg-green-100"
    boxShadow="md"
    ref={innerRef}
    {...draggableProps}
    {...dragHandleProps}>
    <Box>{title}</Box>
    <Flex gap={2}>
      <Button colorScheme="red" onClick={onDelete}>
        Delete
      </Button>
      <Button colorScheme="green" onClick={onComplete}>
        Complete
      </Button>
    </Flex>
  </Box>
);

export default TodoItem;
