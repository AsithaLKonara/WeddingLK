'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Phone,
  Eye,
  Download,
  Loader2,
  Heart,
  MessageSquare,
  CreditCard,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Bell,
  Settings,
  CheckSquare,
  MessageCircle,
  Store,
  Smartphone,
  Shield,
  Star,
  Camera,
  ArrowRight,
  Mail,
  Lock,
  EyeOff,
  XCircle,
  Clock,
  Play,
  Database,
  User,
  Search,
  Triangle,
  Plus,
  Trash2,
} from 'lucide-react';

interface Task {
  _id: string;
  _title: string;
  _description: string;
  dueDate: Date;
  _completed: boolean;
  priority: 'low' | 'medium' | 'high';
  _category: string;
}

interface Guest {
  _id: string;
  _name: string;
  _email: string;
  _phone: string;
  rsvp: 'pending' | 'confirmed' | 'declined';
  _dietary: string;
  _plusOne: boolean;
}

interface BudgetItem {
  _id: string;
  _category: string;
  _item: string;
  _estimated: number;
  _actual: number;
  _paid: boolean;
}

export default function PlanningPage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [weddingDate, setWeddingDate] = useState<Date>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium' as const,
    category: '',
  });
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    dietary: '',
    plusOne: false,
  });
  const [newBudget, setNewBudget] = useState({
    category: '',
    item: '',
    estimated: 0,
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedTasks = localStorage.getItem('wedding-tasks');
    const savedGuests = localStorage.getItem('wedding-guests');
    const savedBudget = localStorage.getItem('wedding-budget');
    const savedDate = localStorage.getItem('wedding-date');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGuests) setGuests(JSON.parse(savedGuests));
    if (savedBudget) setBudget(JSON.parse(savedBudget));
    if (savedDate) setWeddingDate(new Date(savedDate));
  }, []);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('wedding-tasks', JSON.stringify(tasks));
    localStorage.setItem('wedding-guests', JSON.stringify(guests));
    localStorage.setItem('wedding-budget', JSON.stringify(budget));
    if (weddingDate)
      localStorage.setItem('wedding-date', weddingDate.toISOString());
  }, [tasks, guests, budget, weddingDate]);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      category: '',
    });
  };

  const toggleTask = (_taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (_taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addGuest = () => {
    if (!newGuest.name.trim()) return;

    const guest: Guest = {
      id: Date.now().toString(),
      ...newGuest,
      rsvp: 'pending',
    };

    setGuests([...guests, guest]);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      dietary: '',
      plusOne: false,
    });
  };

  const updateGuestRSVP = (_guestId: string, rsvp: 'confirmed' | 'declined') => {
    setGuests(
      guests.map(guest => (guest.id === guestId ? { ...guest, rsvp } : guest))
    );
  };

  const deleteGuest = (_guestId: string) => {
    setGuests(guests.filter(guest => guest.id !== guestId));
  };

  const addBudgetItem = () => {
    if (!newBudget.item.trim() || !newBudget.category.trim()) return;

    const budgetItem: BudgetItem = {
      id: Date.now().toString(),
      ...newBudget,
      actual: 0,
      paid: false,
    };

    setBudget([...budget, budgetItem]);
    setNewBudget({ category: '', item: '', estimated: 0 });
  };

  const updateBudgetItem = (
    _itemId: string,
    field: keyof BudgetItem,
    _value: any
  ) => {
    setBudget(
      budget.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteBudgetItem = (_itemId: string) => {
    setBudget(budget.filter(item => item.id !== itemId));
  };

  const getPriorityColor = (_priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRSVPColor = (_rsvp: string) => {
    switch (rsvp) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = budget.reduce((sum, item) => sum + item.estimated, 0);
  const totalSpent = budget.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = budget.reduce(
    (sum, item) => sum + (item.paid ? item.actual : 0),
    0
  );

  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Wedding Planning
        </h1>
        <p className='text-xl text-gray-600'>
          Organize your special day with our planning tools
        </p>

        {/* Wedding Date */}
        <div className='mt-6 flex items-center justify-center space-x-4'>
          <Calendar className='h-6 w-6 text-blue-600' />
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Wedding Date
            </label>
            <input
              type='date'
              value={weddingDate ? weddingDate.toISOString().split('T')[0] : ''}
              onChange={e =>
                setWeddingDate(
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Guest Count */}
        <div className='mt-6 flex items-center justify-center space-x-4'>
          <Users className='h-6 w-6 text-green-600' />
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Expected Guests
            </label>
            <input
              type='number'
              value={guests.length}
              onChange={e =>
                setGuests(
                  Array.from(
                    { length: parseInt(e.target.value) || 0 },
                    (_, i) => ({
                      id: (Date.now() + i).toString(),
                      name: `Guest ${i + 1}`,
                      email: '',
                      phone: '',
                      rsvp: 'pending',
                      dietary: '',
                      plusOne: false,
                    })
                  )
                )
              }
              min='1'
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Budget */}
        <div className='mt-6 flex items-center justify-center space-x-4'>
          <DollarSign className='h-6 w-6 text-purple-600' />
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Budget (LKR)
            </label>
            <input
              type='number'
              value={totalBudget}
              onChange={e =>
                setBudget(
                  Array.from(
                    { length: parseInt(e.target.value) || 0 },
                    (_, i) => ({
                      id: (Date.now() + i).toString(),
                      category: `Category ${i + 1}`,
                      item: `Item ${i + 1}`,
                      estimated: 0,
                      actual: 0,
                      paid: false,
                    })
                  )
                )
              }
              min='0'
              step='1000'
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Save Button */}
        <div className='mt-8 flex justify-center'>
          <button
            onClick={() => {
              // Placeholder for saving details
              alert('Wedding details saved!');
            }}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
          >
            <CheckCircle className='h-5 w-5' />
            <span>Save Wedding Details</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6'>
        {/* Tabs */}
        <div className='border-b border-gray-200 mb-6'>
          <nav className='flex space-x-8'>
            <button
              key='timeline'
              onClick={() => setActiveTab('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline & Tasks
            </button>
            <button
              key='guests'
              onClick={() => setActiveTab('guests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'guests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Guest List
            </button>
            <button
              key='budget'
              onClick={() => setActiveTab('budget')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'budget'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budget
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'timeline' && (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Wedding Timeline & Tasks
              </h2>
              <button
                onClick={addTask}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2'
              >
                <Plus className='h-4 w-4' />
                <span>Add Task</span>
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg'>
              <input
                placeholder='Task title'
                value={newTask.title}
                onChange={e =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input
                placeholder='Category (e.g., Venue, Vendor, etc.)'
                value={newTask.category}
                onChange={e =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <div className='flex space-x-2'>
                <select
                  value={newTask.priority}
                  onChange={e =>
                    setNewTask({ ...newTask, priority: e.target.value as any })
                  }
                  className='flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='low'>Low Priority</option>
                  <option value='medium'>Medium Priority</option>
                  <option value='high'>High Priority</option>
                </select>
                <button
                  onClick={addTask}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className='space-y-3'>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className='flex items-center space-x-3 p-3 border rounded-lg'
                >
                  <input
                    type='checkbox'
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <span
                        className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {task.title}
                      </span>
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>
                          {task.category}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className='text-sm text-gray-600 mt-1'>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className='px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <CheckSquare className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                  <p>No tasks yet</p>
                  <p className='text-sm'>
                    Add your first wedding planning task above
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>Guest List</h2>
              <button
                onClick={addGuest}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2'
              >
                <Plus className='h-4 w-4' />
                <span>Add Guest</span>
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg'>
              <input
                placeholder='Guest name'
                value={newGuest.name}
                onChange={e =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input
                placeholder='Email'
                type='email'
                value={newGuest.email}
                onChange={e =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input
                placeholder='Phone'
                value={newGuest.phone}
                onChange={e =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <div className='flex space-x-2'>
                <input
                  placeholder='Dietary restrictions'
                  value={newGuest.dietary}
                  onChange={e =>
                    setNewGuest({ ...newGuest, dietary: e.target.value })
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <button
                  onClick={addGuest}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  Add
                </button>
              </div>
            </div>

            {/* Guests List */}
            <div className='space-y-3'>
              {guests.map(guest => (
                <div
                  key={guest.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <span className='font-medium'>{guest.name}</span>
                      <span className={getRSVPColor(guest.rsvp)}>
                        {guest.rsvp}
                      </span>
                      {guest.plusOne && (
                        <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>
                          +1
                        </span>
                      )}
                    </div>
                    <div className='text-sm text-gray-600 space-y-1'>
                      <p>{guest.email}</p>
                      <p>{guest.phone}</p>
                      {guest.dietary && <p>Dietary: {guest.dietary}</p>}
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => updateGuestRSVP(guest.id, 'confirmed')}
                      className='px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200'
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateGuestRSVP(guest.id, 'declined')}
                      className='px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => deleteGuest(guest.id)}
                      className='px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
              {guests.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <Users className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                  <p>No guests yet</p>
                  <p className='text-sm'>Add your first guest above</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Wedding Budget
              </h2>
              <button
                onClick={addBudgetItem}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2'
              >
                <Plus className='h-4 w-4' />
                <span>Add Item</span>
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div>
                <div className='p-4 bg-blue-50 rounded-lg'>
                  <div className='text-2xl font-bold text-blue-600'>
                    LKR {totalBudget.toLocaleString()}
                  </div>
                  <p className='text-sm text-gray-600'>Total Budget</p>
                </div>
              </div>
              <div>
                <div className='p-4 bg-green-50 rounded-lg'>
                  <div className='text-2xl font-bold text-green-600'>
                    LKR {totalSpent.toLocaleString()}
                  </div>
                  <p className='text-sm text-gray-600'>Total Spent</p>
                </div>
              </div>
              <div>
                <div className='p-4 bg-purple-50 rounded-lg'>
                  <div className='text-2xl font-bold text-purple-600'>
                    LKR {totalPaid.toLocaleString()}
                  </div>
                  <p className='text-sm text-gray-600'>Total Paid</p>
                </div>
              </div>
            </div>

            {/* Add New Budget Item */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg'>
              <input
                placeholder='Category (e.g., Venue, Catering)'
                value={newBudget.category}
                onChange={e =>
                  setNewBudget({ ...newBudget, category: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input
                placeholder='Item description'
                value={newBudget.item}
                onChange={e =>
                  setNewBudget({ ...newBudget, item: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input
                placeholder='Estimated cost'
                type='number'
                value={newBudget.estimated}
                onChange={e =>
                  setNewBudget({
                    ...newBudget,
                    estimated: parseFloat(e.target.value) || 0,
                  })
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <button
                onClick={addBudgetItem}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                Add
              </button>
            </div>

            {/* Budget Items List */}
            <div className='space-y-3'>
              {budget.map(item => (
                <div
                  key={item.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <span className='font-medium'>{item.item}</span>
                      <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>
                        {item.category}
                      </span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      <p>Estimated: LKR {item.estimated.toLocaleString()}</p>
                      <p>Actual: LKR {item.actual.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='number'
                      placeholder='Actual cost'
                      value={item.actual}
                      onChange={e =>
                        updateBudgetItem(
                          item.id,
                          'actual',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className='w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                    <input
                      type='checkbox'
                      checked={item.paid}
                      onChange={e =>
                        updateBudgetItem(item.id, 'paid', e.target.checked)
                      }
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    />
                    <button
                      onClick={() => deleteBudgetItem(item.id)}
                      className='px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
              {budget.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <DollarSign className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                  <p>No budget items yet</p>
                  <p className='text-sm'>Add your first budget item above</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
