import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


const COLORS = { primary: '#1f145c', white: '#fff' };

const App = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showClock, setShowClock] = useState(false);
  const [selctedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput === '') {
      Alert.alert('Error', 'Please input todo');
    } else {

      const hours = selctedTime.getHours();
      const minutes = selctedTime.getMinutes();
      console.log("timeis ", hours, minutes)

      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
        date: selectedDate.toLocaleString(),
        time: `${hours}:${minutes}`
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTextInput('');
      setSelectedDate(new Date());
      setShowDateTimePicker(false);
      setShowClock(false)
      setSelectedTime(new Date())
    }
  };

  const showClockFn = () => {
    setShowClock(true)
  }

  const showDateTimePickerFn = () => {
    setShowDateTimePicker(true);
  };

  const handleTimeChange = (e, selctedTime) => {
    setShowClock(false);
    if (selctedTime) {
      setSelectedTime(selctedTime);
    }
  }
  const handleDateChange = (event, selectedDate) => {
    setShowDateTimePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const saveTodoToUserDevice = async (todosToSave) => {
    try {
      const stringifyTodos = JSON.stringify(todosToSave);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodosItem = todos.map((item) =>
      item.id === todoId ? { ...item, completed: true } : item
    );
    setTodos(newTodosItem);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id !== todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo && todo.completed ? 'line-through' : 'none',
            }}
          >
            {console.log(todo.time)}
            {todo && todo.task} AT {todo && `${todo.date.split(", ")[0]}  ${todo.time}`}
          </Text>
        </View>
        {!todo || !todo.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, { backgroundColor: 'green' }]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>)
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.primary,
          }}
        >
          MY APPOINMENTS
        </Text>
        <Icon name="delete" size={25} color="red" onPress={clearAllTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        {/* calander */}
        <TouchableOpacity onPress={showDateTimePickerFn}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
            <Icon name="event" color="white" size={24} />
          </View>
        </TouchableOpacity>
        {/* clock */}
        <TouchableOpacity onPress={showClockFn}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary, marginLeft: 2 }]}>
            <Icon name="access-alarm" color="white" size={24} />
          </View>
        </TouchableOpacity>
        {/* text input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={(text) => setTextInput(text)}
          />
        </View>
        {/* add button */}
        <TouchableOpacity onPress={addTodo}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
            <Icon name="add-circle" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>

      {showDateTimePicker && (
        <DateTimePicker
          value={selectedDate}
          is24Hour={false}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}

      {
        showClock && (
          <DateTimePicker
            value={selctedTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleTimeChange}
          />
        )
      }




    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;