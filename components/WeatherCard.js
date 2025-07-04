import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WeatherCard({ weather }) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{weather.name}</Text>
      <MaterialCommunityIcons name="weather-partly-cloudy" size={64} color="#ffa500" />
      <Text style={styles.temp}>{weather.main.temp}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  city: { fontSize: 22, fontWeight: 'bold' },
  temp: { fontSize: 40, fontWeight: 'bold', marginVertical: 10 },
  desc: { fontSize: 16, textTransform: 'capitalize' },
});
