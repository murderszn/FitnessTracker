import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import TaskModal from '../../components/tasks/TaskModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with Client A',
    description: 'Send proposal and schedule meeting',
    dueDate: '2024-03-20',
    priority: 'High',
    assignee: 'John Doe',
    status: 'Todo'
  },
  {
    id: '2',
    title: 'Prepare Sales Report',
    description: 'Compile Q1 sales data',
    dueDate: '2024-03-22',
    priority: 'Medium',
    assignee: 'Jane Smith',
    status: 'In Progress'
  },
  {
    id: '3',
    title: 'Client Meeting Notes',
    description: 'Document key points from meeting',
    dueDate: '2024-03-21',
    priority: 'Low',
    assignee: 'John Doe',
    status: 'Review'
  },
  {
    id: '4',
    title: 'Update Contact List',
    description: 'Add new leads from conference',
    dueDate: '2024-03-19',
    priority: 'Medium',
    assignee: 'Jane Smith',
    status: 'Done'
  }
];

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: '',
    assignee: '',
    dueDate: ''
  });

  const columns = ['Todo', 'In Progress', 'Review', 'Done'];

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      ...taskData as Task,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleEditTask = (taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === selectedTask?.id ? { ...task, ...taskData } : task
    ));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const taskId = result.draggableId;
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: destination.droppableId } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;
    const matchesDueDate = !filters.dueDate || task.dueDate === filters.dueDate;

    return matchesSearch && matchesPriority && matchesAssignee && matchesDueDate;
  });

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <div className="action-buttons">
          <button 
            className="button secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="mr-2" />
            Filters
          </button>
          <button 
            className="button primary"
            onClick={() => {
              setSelectedTask(undefined);
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="mr-2" />
            New Task
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="search-field">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <select
                  value={filters.assignee}
                  onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="">All Assignees</option>
                  {uniqueAssignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={filters.dueDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {columns.map((status, columnIndex) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: columnIndex * 0.1 }}
                  className="card p-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="text-xl font-semibold mb-4">{status}</h2>
                  <div className="space-y-3">
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            whileHover={{ scale: 1.02 }}
                            className="card p-4 cursor-pointer"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                          >
                            <h3 className="font-semibold mb-2">{task.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{task.dueDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{task.assignee}</span>
                              </div>
                              <span className={`status-tag ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </motion.div>
              )}
            </Droppable>
          ))}
        </motion.div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSave={selectedTask ? handleEditTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default TasksPage; 