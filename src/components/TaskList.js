import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox, Paper, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TaskList = ({ tasks, deleteTask, editTask, toggleComplete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Completed</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>{`${format(new Date(task.created_at), 'PPPP', { locale: es })} a las ${format(new Date(task.created_at), 'p', { locale: es })}`}</TableCell>
              <TableCell>{`${format(new Date(task.updated_at), 'PPPP', { locale: es })} a las ${format(new Date(task.updated_at), 'p', { locale: es })}`}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => editTask(task)}>
                    <EditIcon color="secondary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => deleteTask(task.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskList;