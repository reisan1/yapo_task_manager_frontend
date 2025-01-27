import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const TaskForm = ({ addTask, editTask, taskToEdit, cancelEdit }) => {
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setCompleted(taskToEdit.completed);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      editTask({ ...taskToEdit, name, completed });
    } else {
      addTask({ name, completed });
    }
    setName('');
    setCompleted(false);
  };

  const handleCancel = () => {
    setName('');
    setCompleted(false);
    cancelEdit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Task Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button type="submit" variant="contained" color="primary">
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </Button>
        {taskToEdit && (
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TaskForm;