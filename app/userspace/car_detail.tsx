import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import Header from "../../src/componentes/header";

export default function CarDetail() {
  const router = useRouter();
  const { token } = useTokenContext();
  const [car, setCar] = useState<Car | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const params = useLocalSearchParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      api
        .get(`/api/collections/vinicius_cars/records/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
            console.log('response')
            console.log(response.data)
            console.log('response')
          setCar(response.data);
          setBrand(response.data.brand);
          setModel(response.data.model);
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [id]);

  const handleSave = () => {
    if (car) {
      api
        .patch(`/api/collections/vinicius_cars/records/${car.id}`, { brand, model }, {
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          Alert.alert("Success", "Carro alterado com sucesso");
          router.back();
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  if (!car) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
    <Header title="Editar Carro" />
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do carro</Text>
      <View style={styles.card}>
        <Text style={styles.label}>ID: {car.id}</Text>
        <Text style={styles.label}>Brand:</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
        />
        <Text style={styles.label}>Model:</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#6c757d",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#343a40",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#495057",
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
