import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PlanningToolsScreenProps {
  navigation: any;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
}

interface BudgetItem {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions: string;
  tableNumber?: number;
}

const { width } = Dimensions.get('window');

const PlanningToolsScreen: React.FC<PlanningToolsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'budget' | 'guests' | 'timeline'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' as const, category: '' });
  const [newBudgetItem, setNewBudgetItem] = useState({ category: '', item: '', estimatedCost: '', actualCost: '' });
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', plusOne: false, dietaryRestrictions: '' });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock tasks
    setTasks([
      {
        id: '1',
        title: 'Book Photographer',
        description: 'Research and book wedding photographer',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        priority: 'high',
        category: 'Vendors',
        completed: false,
      },
      {
        id: '2',
        title: 'Choose Wedding Cake',
        description: 'Taste test and select wedding cake design',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'Food & Beverage',
        completed: false,
      },
    ]);

    // Mock budget items
    setBudgetItems([
      {
        id: '1',
        category: 'Venue',
        item: 'Reception Hall',
        estimatedCost: 50000,
        actualCost: 50000,
        paid: true,
      },
      {
        id: '2',
        category: 'Photography',
        item: 'Wedding Photos',
        estimatedCost: 25000,
        actualCost: 0,
        paid: false,
      },
    ]);

    // Mock guests
    setGuests([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 11 123 4567',
        rsvp: 'confirmed',
        plusOne: true,
        dietaryRestrictions: 'Vegetarian',
        tableNumber: 1,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 11 234 5678',
        rsvp: 'pending',
        plusOne: false,
        dietaryRestrictions: '',
      },
    ]);
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date(newTask.dueDate || Date.now()),
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: '' });
    Alert.alert('Success', 'Task added successfully!');
  };

  const addBudgetItem = () => {
    if (!newBudgetItem.category.trim() || !newBudgetItem.item.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const budgetItem: BudgetItem = {
      id: Date.now().toString(),
      category: newBudgetItem.category,
      item: newBudgetItem.item,
      estimatedCost: parseFloat(newBudgetItem.estimatedCost) || 0,
      actualCost: parseFloat(newBudgetItem.actualCost) || 0,
      paid: false,
    };

    setBudgetItems([...budgetItems, budgetItem]);
    setNewBudgetItem({ category: '', item: '', estimatedCost: '', actualCost: '' });
    Alert.alert('Success', 'Budget item added successfully!');
  };

  const addGuest = () => {
    if (!newGuest.name.trim() || !newGuest.email.trim()) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const guest: Guest = {
      id: Date.now().toString(),
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      rsvp: 'pending',
      plusOne: newGuest.plusOne,
      dietaryRestrictions: newGuest.dietaryRestrictions,
    };

    setGuests([...guests, guest]);
    setNewGuest({ name: '', email: '', phone: '', plusOne: false, dietaryRestrictions: '' });
    Alert.alert('Success', 'Guest added successfully!');
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleBudgetPaid = (budgetId: string) => {
    setBudgetItems(budgetItems.map(item =>
      item.id === budgetId ? { ...item, paid: !item.paid } : item
    ));
  };

  const updateGuestRSVP = (guestId: string, rsvp: 'pending' | 'confirmed' | 'declined') => {
    setGuests(guests.map(guest =>
      guest.id === guestId ? { ...guest, rsvp } : guest
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRSVPColor = (rsvp: string) => {
    switch (rsvp) {
      case 'confirmed': return '#10B981';
      case 'declined': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const totalPaid = budgetItems.reduce((sum, item) => sum + (item.paid ? item.actualCost : 0), 0);

  const renderTasksTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add New Task</Text>
        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Due date (YYYY-MM-DD)"
          value={newTask.dueDate}
          onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
        />
        <View style={styles.prioritySelector}>
          {['low', 'medium', 'high'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                newTask.priority === priority && { backgroundColor: getPriorityColor(priority) }
              ]}
              onPress={() => setNewTask({ ...newTask, priority: priority as any })}
            >
              <Text style={[
                styles.priorityButtonText,
                newTask.priority === priority && { color: '#fff' }
              ]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Your Tasks</Text>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, task.completed && styles.completedTask]}
            onPress={() => toggleTaskComplete(task.id)}
          >
            <View style={styles.taskHeader}>
              <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
                {task.title}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
            </View>
            {task.description && (
              <Text style={[styles.taskDescription, task.completed && styles.completedText]}>
                {task.description}
              </Text>
            )}
            <Text style={[styles.taskDate, task.completed && styles.completedText]}>
              Due: {task.dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBudgetTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.budgetSummary}>
        <View style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetAmount}>LKR {totalBudget.toLocaleString()}</Text>
        </View>
        <View style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Total Spent</Text>
          <Text style={styles.budgetAmount}>LKR {totalSpent.toLocaleString()}</Text>
        </View>
        <View style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Total Paid</Text>
          <Text style={styles.budgetAmount}>LKR {totalPaid.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add Budget Item</Text>
        <TextInput
          style={styles.input}
          placeholder="Category (e.g., Venue, Food)"
          value={newBudgetItem.category}
          onChangeText={(text) => setNewBudgetItem({ ...newBudgetItem, category: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item description"
          value={newBudgetItem.item}
          onChangeText={(text) => setNewBudgetItem({ ...newBudgetItem, item: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Estimated cost"
          value={newBudgetItem.estimatedCost}
          onChangeText={(text) => setNewBudgetItem({ ...newBudgetItem, estimatedCost: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Actual cost (optional)"
          value={newBudgetItem.actualCost}
          onChangeText={(text) => setNewBudgetItem({ ...newBudgetItem, actualCost: text })}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={addBudgetItem}>
          <Text style={styles.addButtonText}>Add Budget Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Budget Items</Text>
        {budgetItems.map((item) => (
          <View key={item.id} style={styles.budgetItem}>
            <View style={styles.budgetItemHeader}>
              <Text style={styles.budgetItemTitle}>{item.item}</Text>
              <TouchableOpacity
                style={[styles.paidButton, item.paid && styles.paidButtonActive]}
                onPress={() => toggleBudgetPaid(item.id)}
              >
                <Text style={[styles.paidButtonText, item.paid && styles.paidButtonTextActive]}>
                  {item.paid ? 'Paid' : 'Mark Paid'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.budgetItemCategory}>{item.category}</Text>
            <View style={styles.budgetItemCosts}>
              <Text style={styles.budgetItemCost}>Est: LKR {item.estimatedCost.toLocaleString()}</Text>
              {item.actualCost > 0 && (
                <Text style={styles.budgetItemCost}>Actual: LKR {item.actualCost.toLocaleString()}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderGuestsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add Guest</Text>
        <TextInput
          style={styles.input}
          placeholder="Guest name"
          value={newGuest.name}
          onChangeText={(text) => setNewGuest({ ...newGuest, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={newGuest.email}
          onChangeText={(text) => setNewGuest({ ...newGuest, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          value={newGuest.phone}
          onChangeText={(text) => setNewGuest({ ...newGuest, phone: text })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Dietary restrictions (optional)"
          value={newGuest.dietaryRestrictions}
          onChangeText={(text) => setNewGuest({ ...newGuest, dietaryRestrictions: text })}
        />
        <TouchableOpacity
          style={[styles.checkbox, newGuest.plusOne && styles.checkboxActive]}
          onPress={() => setNewGuest({ ...newGuest, plusOne: !newGuest.plusOne })}
        >
          <Text style={styles.checkboxText}>Plus One</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addGuest}>
          <Text style={styles.addButtonText}>Add Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Guest List</Text>
        {guests.map((guest) => (
          <View key={guest.id} style={styles.guestItem}>
            <View style={styles.guestHeader}>
              <Text style={styles.guestName}>{guest.name}</Text>
              <View style={[styles.rsvpBadge, { backgroundColor: getRSVPColor(guest.rsvp) }]}>
                <Text style={styles.rsvpText}>{guest.rsvp}</Text>
              </View>
            </View>
            <Text style={styles.guestEmail}>{guest.email}</Text>
            {guest.phone && <Text style={styles.guestPhone}>{guest.phone}</Text>}
            {guest.dietaryRestrictions && (
              <Text style={styles.guestDietary}>Dietary: {guest.dietaryRestrictions}</Text>
            )}
            {guest.plusOne && <Text style={styles.guestPlusOne}>+ Plus One</Text>}
            {guest.tableNumber && <Text style={styles.guestTable}>Table {guest.tableNumber}</Text>}
            
            <View style={styles.rsvpButtons}>
              {['pending', 'confirmed', 'declined'].map((rsvp) => (
                <TouchableOpacity
                  key={rsvp}
                  style={[
                    styles.rsvpButton,
                    guest.rsvp === rsvp && { backgroundColor: getRSVPColor(rsvp) }
                  ]}
                  onPress={() => updateGuestRSVP(guest.id, rsvp as any)}
                >
                  <Text style={[
                    styles.rsvpButtonText,
                    guest.rsvp === rsvp && { color: '#fff' }
                  ]}>
                    {rsvp.charAt(0).toUpperCase() + rsvp.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTimelineTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Wedding Timeline</Text>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>12 Months Before</Text>
            <Text style={styles.timelineTask}>Set budget and guest list</Text>
          </View>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>9 Months Before</Text>
            <Text style={styles.timelineTask}>Book venue and photographer</Text>
          </View>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>6 Months Before</Text>
            <Text style={styles.timelineTask}>Choose wedding dress and suits</Text>
          </View>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>3 Months Before</Text>
            <Text style={styles.timelineTask}>Send invitations and plan honeymoon</Text>
          </View>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>1 Month Before</Text>
            <Text style={styles.timelineTask}>Final fittings and rehearsal dinner</Text>
          </View>
        </View>
        
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>Wedding Day</Text>
            <Text style={styles.timelineTask}>Celebrate your special day!</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planning Tools</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'tasks', label: 'Tasks', icon: 'check-circle' },
          { key: 'budget', label: 'Budget', icon: 'account-balance-wallet' },
          { key: 'guests', label: 'Guests', icon: 'people' },
          { key: 'timeline', label: 'Timeline', icon: 'schedule' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <MaterialIcons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? '#FF6B6B' : '#666'}
            />
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'tasks' && renderTasksTab()}
        {activeTab === 'budget' && renderBudgetTab()}
        {activeTab === 'guests' && renderGuestsTab()}
        {activeTab === 'timeline' && renderTimelineTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFF5F5',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    padding: 20,
  },
  addSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  budgetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  paidButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  paidButtonActive: {
    backgroundColor: '#10B981',
  },
  paidButtonText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  paidButtonTextActive: {
    color: '#fff',
  },
  budgetItemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  budgetItemCosts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItemCost: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  guestItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  guestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  rsvpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rsvpText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  guestEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  guestPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  guestDietary: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  guestPlusOne: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
    marginBottom: 4,
  },
  guestTable: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  rsvpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rsvpButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  rsvpButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxActive: {
    backgroundColor: '#FF6B6B',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  timelineContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginRight: 15,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineTask: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PlanningToolsScreen; 