import { useState, useEffect } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('http://localhost:8000/api/todo_items/', {
        method: 'GET',
        headers: { Authorization: localStorage.Authorization }
      });
      let data = await response.json();
      data = data.map((item) => ({
        ...item,
        orderId: item.orderId.toString()
      }));
      setTodos(data);
    };

    fetchTodos();
  }, []);

  return { todos, setTodos };
};

export default useTodos;
