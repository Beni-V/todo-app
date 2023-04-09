import React, { useEffect, useState } from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import TodoItem from '../components/TodoItem';
import TodoAddForm from '../components/TodoAddForm';
import useTodos from '../hooks/useTodos';
import useReorder from '../hooks/useReorder';
import { cloneDeep } from 'lodash';

const TodoList = () => {
  const { todos } = useTodos();

  const [localTodos, setLocalTodos] = useState([]);
  const [initialTodos, setInitialTodos] = useState([]);
  const onDragEnd = useReorder(localTodos, setLocalTodos);

  useEffect(() => {
    setLocalTodos(todos);
    setInitialTodos(todos);
  }, [todos]);

  const hasChanges = JSON.stringify(initialTodos) !== JSON.stringify(localTodos);

  const convertToOrderIdsToNumbers = (todos) => {
    return todos.map((todo) => ({
      ...todo,
      orderId: Number(todo.orderId)
    }));
  };

  const getNewTodos = () => {
    const newTodos = localTodos.filter((todo) => !todo.id);
    return convertToOrderIdsToNumbers(newTodos);
  };

  const getModifiedTodos = () => {
    const modifiedTodos = localTodos.filter(
      (todo) =>
        todo.id &&
        initialTodos.some((initialTodo) => JSON.stringify(initialTodo) !== JSON.stringify(todo))
    );
    return convertToOrderIdsToNumbers(modifiedTodos);
  };
  const getDeletedTodos = () =>
    initialTodos.filter((initialTodo) => !localTodos.some((todo) => todo.id === initialTodo.id));

  const saveTodos = async () => {
    const newTodos = getNewTodos();
    const modifiedTodos = getModifiedTodos();
    const deletedTodos = getDeletedTodos();

    if (newTodos.length > 0) {
      await postTodos(newTodos);
    }
    if (modifiedTodos.length > 0) {
      await patchTodos(modifiedTodos);
    }
    if (deletedTodos.length > 0) {
      await deleteTodos(deletedTodos);
    }

    setInitialTodos(localTodos);
  };

  const postTodos = async (todos) => {
    await fetch('http://localhost:8000/api/todo_items/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.Authorization
      },
      body: JSON.stringify(todos)
    });
  };

  const patchTodos = async (todos) => {
    await fetch('http://localhost:8000/api/todo_items/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.Authorization
      },
      body: JSON.stringify(todos)
    });
  };

  const deleteTodos = async (todos) => {
    await fetch('http://localhost:8000/api/todo_items/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.Authorization
      },
      body: JSON.stringify(todos)
    });
  };

  const onDelete = (index) => {
    const updatedTodos = [...localTodos];
    updatedTodos.splice(index, 1);
    setLocalTodos(updatedTodos);
  };

  const toggleComplete = (index) => {
    const updatedTodos = cloneDeep(localTodos);
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setLocalTodos(updatedTodos);
  };

  const onAdd = (title) => {
    const maxOrderId = Math.max(...localTodos.map((todo) => parseInt(todo.orderId)), -1);
    const newTodo = {
      title,
      completed: false,
      orderId: (maxOrderId + 1).toString()
    };
    setLocalTodos([...localTodos, newTodo]);
  };

  return (
    <Box
      className="flex flex-col bg-white w-1/2 h-full rounded-lg justify-center p-5"
      gap={6}
      boxShadow="lg">
      <TodoAddForm onAdd={onAdd} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              className="flex flex-col w-full h-[50%] rounded-md overflow-auto bg-gray-100 scrollbar-thin scrollbar-thumb-gray-400"
              boxShadow="lg">
              <Heading className="font-bold text-3xl p-5">{'Todo List'}</Heading>
              {localTodos.map((todoItemData, index) => (
                <Draggable
                  key={todoItemData.orderId}
                  draggableId={todoItemData.orderId}
                  index={index}>
                  {(provided) => (
                    <TodoItem
                      innerRef={provided.innerRef}
                      draggableProps={provided.draggableProps}
                      dragHandleProps={provided.dragHandleProps}
                      title={todoItemData.title}
                      onDelete={() => onDelete(index)}
                      onComplete={() => toggleComplete(index)}
                      isCompleted={todoItemData.completed}
                    />
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box className="flex justify-between justify-end p-3 bg-gray-100 rounded-lg" boxShadow="lg">
        <Button
          colorScheme="red"
          className="p-3"
          onClick={() => setLocalTodos(initialTodos)}
          isDisabled={!hasChanges}>
          Discard
        </Button>
        <Button colorScheme="green" className="p-3" onClick={saveTodos} isDisabled={!hasChanges}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TodoList;
