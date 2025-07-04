import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground, ScrollView, RefreshControl, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';
import { fetchWeather } from '../utils/fetchWeather';
import { fetchForecast } from '../utils/fetchForecast';

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
          <Text style={styles.title}>Weather App</Text>
          <BlurView intensity={60} tint="light" style={styles.glassBox}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                placeholderTextColor="#888"
                value={city}
                onChangeText={setCity}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.button} onPress={handleSearch} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
          {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginVertical: 20 }} />}
          {weather && (
            <BlurView intensity={60} tint="light" style={styles.glassBox}>
              <View style={styles.cardInner}>
                <WeatherCard weather={weather} />
              </View>
            </BlurView>
          )}
          {forecast && (
            <BlurView intensity={60} tint="light" style={styles.glassBox}>
              <View style={styles.cardInner}>
                <ForecastList forecast={forecast} />
              </View>
            </BlurView>
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
    paddingVertical: 32,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 36,
    color: '#222',
    letterSpacing: 1,
    textAlign: 'center',
  },
  glassBox: {
    width: '90%',
    maxWidth: 350,
    alignSelf: 'center',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 18,
    paddingHorizontal: 12,
    color: '#222',
    backgroundColor: 'transparent',
    borderRadius: 12,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardInner: {
    padding: 12,
  },
});