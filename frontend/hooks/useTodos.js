import { useState, useEffect } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return { todos, setTodos, loading, error };
};

export default useTodos;
