// Frontend (React Native)
import React, { useState, useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import api from '../../src/services/api';
import { Car } from '../../src/types/Car';

export default function PowerfulCars() {
  const [powerfulCars, setPowerfulCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/collections/vinicius_cars/records?sort=+hp')
      .then(response => {
        console.log(response.data)
        setPowerfulCars(response.data.cars);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carros potentes</Text>
      {powerfulCars.length === 0 ? (
        <Text>Nenhum carro potente.</Text>
      ) : (
        <FlatList
          data={powerfulCars}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>ID: {item.id}</Text>
              <Text>Brand: {item.brand}</Text>
              <Text>Model: {item.model}</Text>
              <Text>HP: {item.hp}</Text>
            </View>
          )}
          keyExtractor={(car) => car.id}
          style={styles.flatlist}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
});
