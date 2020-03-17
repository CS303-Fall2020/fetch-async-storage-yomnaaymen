import React, { useState, useEffect } from 'react';
import {
  StyleSheet
  , Text
  , TouchableOpacity
  , View
  , FlatList
  , Alert
  , TouchableWithoutFeedback
  , Keyboard
  , CheckBox
  , AsyncStorage
  , Button
  , ActivityIndicator
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AddTodo from './addTodo';
import NetInfo from "@react-native-community/netinfo";



export default function Home({ navigation }) {

  const [get, setGet] = useState(true)
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    myAsyncEffect()
  }, []);


  useEffect(() => {
    AsyncStorage.setItem('todo', JSON.stringify(todos))
  })

  const displayData = async () => {
    const IntialTodo = await AsyncStorage.getItem('todo')
    const parsed = JSON.parse(IntialTodo)

    setTodos(parsed)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
    myAsyncEffect()
  }
  async function myAsyncEffect() {
    try {

      const response = await fetch("https://jsonplaceholder.typicode.com/todos?userId=1&fbclid=IwAR3kRnDmQ1VD2u8ljkcqIBFUz7T13d5prsr4a0OF_jHEyy6WPTdLbXD2UoY")
      const data = await response.json();
      const item = data;

      setTodos(item)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 500)
      setGet(true)

    } catch (error) {
      console.log(error)
      setGet(false)
    }





  }



  const storeData = async () => {
    try {
      await AsyncStorage.setItem("items", JSON.stringify(todos));
      console.log(JSON.stringify(todos))
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('items');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error)
    }
  };
  const PressUpdateHandler = (id, title) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(todo => { if ((todo.id != id) == false) { todo.title = title } return true });
    })
  }
  const submitHandler = (title) => {
    if (title.length > 3) {
      setTodos((prevTodos) => {
        return [
          { title: title, id: Math.random() },
          ...prevTodos
        ];
      })
      storeData()
      retrieveData();
    } else {
      Alert.alert('oppos', 'todo must be over 3 chars long', [
        { title: 'Understood', onPress: () => console.log('alert closed') }

      ]);
    }

  }

  const pressHandler = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(todo => { if ((todo.id != id) == false) { todo.completed = !todo.completed } return true });
    })
    storeData()
    retrieveData();
  }
  const realDelete = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(todo => todo.id != id);
    })
    storeData()
    retrieveData();
  }



  return (

    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      console.log("Dismissed");
    }}>
      {loading ?
        <ActivityIndicator style={styles.re} size="large" color="#0000ff" />
        :
        <View style={styles.container}>
          {get ?
            <View></View>
            : <TouchableOpacity onPress={() => displayData()}>
            <Text style={styles.text}>
              You're offline..check your connection to load todos.
         </Text>
          </TouchableOpacity>

          }


          <View style={styles.content}>
            <AddTodo submitHandler={submitHandler} />

            <View style={styles.list}>
              <FlatList
                data={todos}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <TouchableOpacity onPress={() => realDelete(item.id)} style={{ flexDirection: 'row' }}>
                      <MaterialIcons name='delete' size={24} color={'#958'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {!item.completed? navigation.navigate('Details', { item, PressUpdateHandler }):
                    console.log()}} style={{ flexDirection: 'row', flex: 1 }} >
                      <Text style={item.completed ? styles.t : styles.f}>{item.title}</Text>
                    </TouchableOpacity>
                    <CheckBox style={styles.c} value={item.completed} onChange={() => pressHandler(item.id)} />

                  </View>
                )}
              />
              {get ?
                <Button onPress={() => myAsyncEffect()} title='Refresh' color='#555' />
                : <Button onPress={() => displayData()} title='Refresh' color='#555' />

              }
              {}

            </View>

          </View>

        </View>
      }
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#958',
  },
  content: {
    padding: 20,
    backgroundColor: '#555',
    flex: 1,
  },
  list: {
    flex: 1,
    marginTop: 10,

  },
  itemText: {
    marginLeft: 10,
  },
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: '#958',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    flexDirection: 'row',

  }, t: {
    marginLeft: 10,
    textDecorationLine: "line-through",
    flexShrink: 1
  }, f: {
    marginLeft: 10,
    textDecorationLine: "none",
    flexShrink: 1
  }, c: {
    marginLeft: 20,

  },
  re: {
    justifyContent: 'center',
    padding: 150
  },
  text: {
    backgroundColor: 'yellow'
  }
});