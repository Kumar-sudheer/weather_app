import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Keyboard
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';
import { fetchWeather } from '../utils/fetchWeather';
import { fetchForecast } from '../utils/fetchForecast';
import { Ionicons } from '@expo/vector-icons';

const apikey = "52b4b30e80ea54992a38162219caba8f";

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getLocationWeather();
  }, []);

  const getLocationWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied for location access.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
      );

      setWeather(response.data);
      const cityName = response.data.name;
      const forecastData = await fetchForecast(cityName);
      setForecast(forecastData);
    } catch (error) {
      console.error(error);
      alert('Error getting weather from location.');
    }
  };

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      const forecastData = await fetchForecast(city);
      setForecast(forecastData);
    } catch (err) {
      alert('City not found!');
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocationWeather();
    setRefreshing(false);
  };

  const getBackgroundImage = () => {
    if (!weather) return require('../assets/sunny.jpg');
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return require('../assets/rainy.jpg');
    if (main.includes('cloud')) return require('../assets/cloudy.jpg');
    return require('../assets/sunny.jpg');
  };

  return (
    <ImageBackground source={getBackgroundImage()} style={{ flex: 1 }} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.header}>🌤️ Weather Now</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Search by city..."
              value={city}
              onChangeText={setCity}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Go</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 20 }} />}

          {weather && (
            <View style={styles.card}>
              <WeatherCard weather={weather} />
            </View>
          )}

          {forecast && (
            <View style={styles.card}>
              <ForecastList forecast={forecast} />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 20,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchBtn: {
    backgroundColor: '#007aff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '500',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 6,
  },
});
