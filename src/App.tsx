import React, { useState } from 'react';
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const ScrumControl: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const addTask = () => {
    if (taskText.trim()) {
      if (editingTaskId !== null) {
        // Editar a task que existe
        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId ? { ...task, text: taskText } : task
          )
        );
        setEditingTaskId(null);
      } else {
        // Add a task
        setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
      }
      setTaskText('');
    }
  };

  const completeTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
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

export default ScrumControl;
