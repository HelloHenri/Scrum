import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './login/Login';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const API_URL = 'http://localhost:8080';  // URL do backend Flask

// Componente ScrumControl
const ScrumControl: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []); 

  useEffect(() => {
    if (token) {
      fetchTasks();  
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/sprints`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setTasks(response.data.sprints);
    } catch (error) {
      console.error('Erro ao buscar as tarefas:', error);
    }
  };

  const addTask = async () => {
    if (taskText.trim()) {
      try {
        if (editingTaskId !== null) {
          // Edita uma task que já foi criada
          await axios.put(`${API_URL}/sprints/${editingTaskId}`, { nome: taskText }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Adiciona uma nova task
          await axios.post(`${API_URL}/sprints`, { nome: taskText, descricao: taskText }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setTaskText('');
        fetchTasks();  // Atualiza a lista de tasks
        setEditingTaskId(null);
      } catch (error) {
        console.error('Erro ao adicionar ou editar a task:', error);
      }
    }
  };

  const completeTask = async (id: number) => {
    try {
      await axios.put(`${API_URL}/sprints/${id}`, { completed: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: true } : task
      ));
    } catch (error) {
      console.error('Erro ao completar a task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/sprints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();  // Atualiza a lista de tasks
    } catch (error) {
      console.error('Erro ao deletar a task:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskText(task.text);
  };

  return (
    <div className="app-container">
      <h1>Scrum Control</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Adicione uma Sprint"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={addTask}>{editingTaskId !== null ? 'Atualizar' : 'Add'}</button>
      </div>
      <div className="task-lists">
        <div className="active-tasks">
          <h2>Sprints a serem feitas</h2>
          {tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <div key={task.id} className="task-item">
                <span>{task.text}</span>
                <button onClick={() => completeTask(task.id)}>✓</button>
                <button onClick={() => startEditing(task)}>✏️</button>
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </div>
            ))}
        </div>
        <div className="completed-tasks">
          <h2>Sprints finalizadas</h2>
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <div key={task.id} className="task-item completed">
                <span>{task.text}</span>
                <button onClick={() => completeTask(task.id)}>↩️</button>
                <button onClick={() => startEditing(task)}>✏️</button>
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Componente App com rotas
const App: React.FC = () => {
  const token = localStorage.getItem('token');
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/scrum" element={token ? <ScrumControl /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <ScrumControl /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
