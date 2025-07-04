import axios from 'axios';

const apikey = "52b4b30e80ea54992a38162219caba8f";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

export const fetchForecast = async (city) => {
  const url = `${apiUrl}${city}&appid=${apikey}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
