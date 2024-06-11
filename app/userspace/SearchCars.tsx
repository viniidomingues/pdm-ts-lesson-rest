import React, { useState, useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTokenContext } from '../../src/contexts/userContext';
import api from '../../src/services/api';
import { Car } from '../../src/types/Car';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../../src/componentes/header';
2
export default function SearchCars() {
  const { token } = useTokenContext();
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  useEffect(() => {
    api
      .get("/api/collections/vinicius_cars/records", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCars(response.data.items);
        setFilteredCars(response.data.items);
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }, []);

  useEffect(() => {
    const results = cars.filter(car =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCars(results);
  }, [searchQuery]);

  return (
    <>
    <Header title="Buscar carros" />
    <View style={styles.container}>
      
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por brand"
      />
      <FlatList
        data={filteredCars}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>ID: {item.id}</Text>
            <Text style={styles.itemText}>Brand: {item.brand}</Text>
            <Text style={styles.itemText}>Model: {item.model}</Text>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 16,
    width: '100%',
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#495057',
  },
  flatlist: {
    width: '100%',
    marginTop: 16,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
  },
});
