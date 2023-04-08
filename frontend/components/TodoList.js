import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, Heading } from '@chakra-ui/react';

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
    <Box className="flex flex-col bg-white w-1/3 h-2/3 rounded-lg justify-center border border-black">
      <Heading className="font-bold text-3xl p-5">{'Todo List'}</Heading>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              className="flex flex-col w-full h-[50%] bg-gray-200 mb-5 p-3 overflow-auto scrollbar-thin scrollbar-thumb-gray-400">
              {localTodoItemsData.map((todoItemData, index) => (
                <Draggable
                  key={todoItemData.orderId}
                  draggableId={todoItemData.orderId}
                  index={index}>
                  {(provided) => (
                    <Box
                      className="flex justify-start bg-gray-300 rounded-lg text-center m-2 p-3 border border-black"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      {todoItemData.title}
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box className="flex justify-between justify-end border border-black p-3">
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
