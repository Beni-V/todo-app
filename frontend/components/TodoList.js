import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Button, Flex, Heading, Input } from '@chakra-ui/react';

const TodoList = () => {
  const [localTodoItemsData, setLocalTodoItemsData] = React.useState([]);
  const [initialTodoItemsData, setInitialTodoItemsData] = React.useState([]);

  useEffect(() => {
    getTodoItems();
  }, []);

  const getTodoItems = async () => {
    const response = await fetch('http://localhost:8000/api/todo_items/', {
      method: 'GET',
      headers: { Authorization: localStorage.Authorization }
    });
    let data = await response.json();
    data = data.map((item) => {
      return {
        ...item,
        orderId: item.orderId.toString()
      };
    });
    setLocalTodoItemsData(data);
    setInitialTodoItemsData(data);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(localTodoItemsData, result.source.index, result.destination.index);

    setLocalTodoItemsData(
      items.map((item, index) => ({
        ...item,
        orderId: index.toString()
      }))
    );
  }

  return (
    <Box
      className="flex flex-col bg-white w-1/2 h-full rounded-lg justify-center p-5"
      gap={6}
      boxShadow="lg">
      <Box className="bg-gray-100 rounded-lg" boxShadow="lg">
        <Heading className="font-bold text-2xl p-5">{'Add Todo Item'}</Heading>
        <Box className="flex justify-between">
          <Input placeholder="Enter Todo Item Title" className="m-5" />
          <Button colorScheme="blue" className={'m-5'}>
            Add
          </Button>
        </Box>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              className="flex flex-col w-full h-[50%] rounded-md overflow-auto bg-gray-100 scrollbar-thin scrollbar-thumb-gray-400"
              boxShadow="lg">
              <Heading className="font-bold text-3xl p-5">{'Todo List'}</Heading>
              {localTodoItemsData.map((todoItemData, index) => (
                <Draggable
                  key={todoItemData.orderId}
                  draggableId={todoItemData.orderId}
                  index={index}>
                  {(provided) => (
                    <Box
                      className={`flex justify-start rounded-lg text-center m-2 p-3 justify-between ${'bg-green-100'}`}
                      boxShadow="md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <Box>{todoItemData.title}</Box>
                      <Flex gap={2}>
                        <Button colorScheme="red">Delete</Button>
                        <Button colorScheme="green">Complete</Button>
                      </Flex>
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box className="flex justify-between justify-end p-3 bg-gray-100 rounded-lg" boxShadow="lg">
        <Button colorScheme="red" className="p-3">
          Discard
        </Button>
        <Button colorScheme="green" className="p-3">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TodoList;
