import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";

export default function CreateCar() {
  const router = useRouter();
  const { token } = useTokenContext();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hp, setHp] = useState("");

  const handleCreate = async () => {
    const data = {
      model,
      brand,
      hp: parseInt(hp),
    };

    try {
      const createdCar = await api.post<Car>(
        "/api/collections/vinicius_cars/records",
        data,
        {
          headers: {
            Authorization: token,
            "content-type": "application/json",
          },
        }
      );

      if (createdCar.status === 200) {
        Alert.alert("Created!", createdCar.data.model);
        router.replace("/userspace");
      } else {
        Alert.alert("Error!", "Error Creating Car!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", "Error Creating Car!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrando um novo carro</Text>

      <TextInput
        value={brand}
        onChangeText={setBrand}
        placeholder="Marca"
        style={styles.input}
      />
      <TextInput
        value={model}
        onChangeText={setModel}
        placeholder="Modelo"
        style={styles.input}
      />
      <TextInput
        value={hp}
        onChangeText={(text) => setHp(text.replace(/[^0-9]/g, ""))}
        placeholder="Potência (CV)"
        keyboardType="number-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Cadastrar um carro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#495057",
  },
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
