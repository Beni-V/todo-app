import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

const TodoItem = ({
  title,
  onDelete,
  onComplete,
  innerRef,
  draggableProps,
  dragHandleProps,
  isCompleted
}) => (
  <Box
    className={`flex justify-start rounded-lg text-center m-2 p-3 justify-between ${
      isCompleted ? 'bg-green-200' : 'bg-blue-200'
    }`}
    boxShadow="md"
    ref={innerRef}
    {...draggableProps}
    {...dragHandleProps}>
    <Box>{title}</Box>
    <Flex gap={2}>
      <Button colorScheme="red" onClick={onDelete}>
        Delete
      </Button>
      <Button colorScheme={isCompleted ? 'blue' : 'green'} onClick={onComplete}>
        {isCompleted ? 'Uncomplete' : 'Complete'}
      </Button>
    </Flex>
  </Box>
);

export default TodoItem;
