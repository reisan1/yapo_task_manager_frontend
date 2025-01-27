import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, TextField, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Paper, Box, IconButton, CssBaseline, AppBar, Toolbar, Tooltip, Divider, Switch, CircularProgress, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axiosInstance from './axiosInstance';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#fb6907', // Naranja
    },
    secondary: {
      main: '#4caf50', // Verde
    },
    background: {
      default: '#f5f5f5', // Gris claro
      paper: '#ffffff', // Blanco para los elementos Paper
    },
    text: {
      primary: '#333333', // Gris oscuro
    },
    error: {
      main: '#e57373', // Rojo claro para el botón de cancelar
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Fondo blanco para los elementos Paper
          color: '#333333', // Texto gris oscuro para los elementos Paper
          marginBottom: '20px', // Añadir margen inferior
          padding: '20px', // Añadir padding
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#4caf50', // Fondo verde para los botones
          color: '#ffffff', // Texto blanco para los botones
          borderRadius: '8px', // Bordes redondeados
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', // Sombra suave
          '&:hover': {
            backgroundColor: '#388e3c', // Fondo verde más oscuro al pasar el ratón
          },
        },
        containedError: {
          backgroundColor: '#e57373', // Fondo rojo claro para el botón de cancelar
          color: '#ffffff', // Texto blanco para el botón de cancelar
          '&:hover': {
            backgroundColor: '#d32f2f', // Fondo rojo más oscuro al pasar el ratón
          },
        },
      },
    },
  },
});

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear error before request
    try {
      let params = {
        search: search,
        sort_by: sortBy,
        order: order
      };
      if (showCompleted) params.completed = showCompleted;
      const response = await axiosInstance.get('/tasks', { params });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, showCompleted, sortBy, order]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task) => {
    setLoading(true);
    setError(null); // Clear error before request
    try {
      const response = await axiosInstance.post('/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (task) => {
    setLoading(true);
    setError(null); // Clear error before request
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}`, task);
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
      setTaskToEdit(null);
    } catch (err) {
      setError('Failed to edit task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    setError(null); // Clear error before request
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    setLoading(true);
    setError(null); // Clear error before request
    try {
      const task = tasks.find((task) => task.id === id);
      const response = await axiosInstance.put(`/tasks/${id}`, { ...task, completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
    } catch (err) {
      setError('Failed to toggle task completion');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setTaskToEdit(null);
  };

  const toggleOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
            Yapo Task Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Paper elevation={3}>
          {error && <Typography color="error">{error}</Typography>}

          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                name="showCompleted"
                color="primary"
              />
            }
            label="Filter by completed"
          />

          <Box display="flex" alignItems="center" gap={2} marginTop={2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="created_at">Created At</MenuItem>
                <MenuItem value="updated_at">Updated At</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={toggleOrder} color="primary">
              {order === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2} marginTop={2}>
            <Box flexGrow={1}>
              <TaskForm addTask={addTask} editTask={editTask} taskToEdit={taskToEdit} cancelEdit={cancelEdit} />
            </Box>
          </Box>

          <TaskList tasks={tasks} deleteTask={deleteTask} editTask={setTaskToEdit} toggleComplete={toggleComplete} />
        </Paper>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
};

export default App;