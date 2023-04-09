import React, { useState } from 'react';
import { Box, Button, Heading, Input } from '@chakra-ui/react';

const TodoAddForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <Box className="bg-gray-100 rounded-lg" boxShadow="lg">
      <Heading className="font-bold text-2xl p-5">{'Add Todo Item'}</Heading>
      <Box className="flex justify-between">
        <Input
          value={title}
          onChange={handleChange}
          placeholder="Enter Todo Item Title"
          className="m-5"
        />
        <Button colorScheme="blue" className={'m-5'} onClick={handleAdd}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default TodoAddForm;
