import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from "../../src/componentes/header";

export default function Home() {
  const { token } = useTokenContext();
  const [cars, setCars] = useState<Car[]>([]);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/api/collections/vinicius_cars/records", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCars(response.data.items);
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }, []);

  const handleDelete = (id: string) => {
    api
      .delete(`/api/collections/vinicius_cars/records/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        setCars(cars.filter(car => car.id !== id));
        Alert.alert("Success", "Carro deletado com sucesso");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <>
      <Header title="Carros" />
    <View style={styles.container}>
      
      <Link href="/userspace/create_car" asChild>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Cadastrar novo carro</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push('/userspace/SearchCars')}
      >
        <Text style={styles.searchButtonText}>Buscar carros</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push('/userspace/powerFullCar')}
      >
        <Text style={styles.searchButtonText}>Carros por hp</Text>
      </TouchableOpacity> */}

      <FlatList
        data={cars}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => router.push({ pathname: "/userspace/car_detail", params: { id: item.id } })}
            >
              <Text style={styles.itemText}>ID: {item.id}</Text>
              <Text style={styles.itemText}>Brand: {item.brand}</Text>
              <Text style={styles.itemText}>Model: {item.model}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash" size={24} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(car) => car.id}
        style={styles.flatlist}
      />
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
    width: '100%', // Assegura que o contêiner tenha 100% de largura
  },
  flatlist: {
    width: "100%",
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#343a40",
  },
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 4,
  },
  deleteButton: {
    padding: 8,
  },
});
