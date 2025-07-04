import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForecastList({ forecast }) {
  const dailyData = forecast.list.filter((_, index) => index % 8 === 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      {dailyData.map((item) => (
        <View style={styles.item} key={item.dt}>
          <Text style={styles.date}>{new Date(item.dt_txt).toDateString()}</Text>
          <Text style={styles.temp}>{item.main.temp}°C</Text>
          <Text style={styles.desc}>{item.weather[0].description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, backgroundColor: '#fff', padding: 15, borderRadius: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 10 },
  date: { fontSize: 14, fontWeight: 'bold' },
  temp: { fontSize: 16 },
  desc: { fontSize: 14, textTransform: 'capitalize' },
});
