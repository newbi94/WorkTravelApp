import { StatusBar } from "expo-status-bar";
import React, { startTransition, useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import Checkbox from 'expo-checkbox';
const STORAGE_KEY = "@toDos";

test

export default function App() {
  
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editText, setEditText] = useState("");
  
  useEffect(() => {
    loadToDos();
    loadMode();
  }, []);
  
  const travel = () => {
    setWorking(false)
    saveMode(false)
  };

  const work = () => {
    setWorking(true)
    saveMode(true)
  };

  const edit = (key) => {
    const newTodos = [...toDos];
    newTodos[key].isEdit = !newTodos[key].isEdit;
    setTodos(newTodos);
  };

  const editToDos = (key) => {
    const newTodos = [...toDos];
    newTodos[key].text = editText;
    newTodos[key].isEdit = false;
    setTodos(newTodos);
    seteditText("");
  };

  const onChangeText = (payload) => setText(payload);

  
  const saveMode = async(mode) => {
    try {
      await AsyncStorage.setItem("@mode",JSON.stringify(mode))
    } catch(error) {
      console.log(error);
    }
  };

  const loadMode = async () => {
    const m = await AsyncStorage.getItem("@mode")
    setWorking(JSON.parse(m))
  };

  const saveToDos = async (newToDos) => {
    try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newToDos));
  } catch(e) {  alert("Error!")
  }
};


  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(s);
    setToDos(JSON.parse(s))
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
      const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, done: false, isEdit: false }
    };

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const changeDone = async (key) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], done: !toDos[key].done },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
      <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
       onSubmitEditing={addToDo}
        onChangeText={setText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? "What do you have to do?" : "Where do you want to go?"
        }
        style={styles.input}
      />
       <ScrollView>
       {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>   
           {toDos[key].done ? (
                  <TouchableOpacity onPress={() => changeDone(key)}>
                    <Fontisto
                      name="checkbox-active"
                      size={18}
                      color="red"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => changeDone(key)}>
                    <Fontisto
                      name="checkbox-passive"
                      size={18}
                      color={theme.grey}
                    />
                  </TouchableOpacity>
                )}
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              
              {toDos[key].isEdit ? (
              <TextInput
                  style={styles.editInput}
                  onSubmitEditing={() => editToDos(key)}
                  defaultValue={toDos[key].text}
                  onChangeText={setEditText}
                  returnKeyType="done"
                />) : (
                  <Text
                    style={
                      toDos[key].done
                        ? {
                            ...styles.toDoText,
                            textDecorationLine: "line-through",
                          }
                        : styles.toDoText
                    }
                  >
                    {toDos[key].text}
                  </Text>
                )
              }
              <TouchableOpacity onPress={() => edit(toDos.key)}>
                    <AntDesign name="edit" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  checkBox: {
    color: "white",
  },
  editInput: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
});
