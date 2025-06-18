import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FaPlus, FaChevronLeft, FaCheck, FaTrash } from 'react-icons/fa';

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
};

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success('任务添加成功');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.info('任务已删除');
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTasks(result);
  };

  return { tasks, addTask, toggleTask, deleteTask, reorderTasks };
}

function TaskItem({
  task,
  index,
  onSwipeLeft,
  onSwipeRight,
}: {
  task: Task;
  index: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [offsetX, setOffsetX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      setOffsetX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (offsetX > 100) {
      onSwipeRight();
    } else if (offsetX < -100) {
      onSwipeLeft();
    }
    setOffsetX(0);
  };

  return (
    <div
      className={cn(
        'relative w-full mb-4 p-4 rounded-lg shadow-md',
        task.isCompleted ? 'bg-gray-100' : 'bg-green-50'
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${offsetX}px)`,
        transition: offsetX === 0 ? 'transform 0.2s ease' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-lg',
          task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
        )}>
          {task.title}
        </span>
        {task.isCompleted && <FaCheck className="text-green-500" />}
      </div>
    </div>
  );
}

function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">添加新任务</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="输入任务内容"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const navigate = useNavigate();
  const { tasks, addTask, toggleTask, deleteTask, reorderTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold ml-4">任务管理</h1>
      </div>

      {/* Task List */}
      <div className="p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem
                          task={task}
                          index={index}
                          onSwipeLeft={() => deleteTask(task.id)}
                          onSwipeRight={() => toggleTask(task.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无任务，点击右下角按钮添加
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaPlus size={24} />
      </button>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
      />
    </div>
  );
}
