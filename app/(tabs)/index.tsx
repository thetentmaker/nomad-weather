import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const {width: SCREEN_WIDTH } = Dimensions.get('window');
console.log(SCREEN_WIDTH);

const API_KEY = "1676c8df74747a9a078428f248eda71c"

export default function HomeScreen() {
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, setCity] = useState<String>("Loading...")
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([])

  const getWeather = async () => {
    try {
      // 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      const a = await Location.requestForegroundPermissionsAsync();
      console.log(a)
      console.log("status: " + status)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setOk(false);
        return;
      }

      // 현재 위치 가져오기
      const loc = await Location.getCurrentPositionAsync({accuracy: 5});
      console.log(loc);
      // 위경도 추출
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})

      // reverse geocoding으로 도시 이름 가져오기
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log(geocode)

      if (geocode.length > 0) {
        const city = geocode[0].city || geocode[0].region || "Unknown";
        setCity(city)
        console.log(city)
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`)
        const json = await response.json()
        console.log(json)
      } else {
        <ActivityIndicator />
      }

      setOk(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong");
      setOk(false);
    }
  };

  useEffect(() => {
    getWeather()
  }, [])

  return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
          <View style={styles.day}>
            <ActivityIndicator />
            <Text style={styles.temp}>20</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
          <View style={styles.day}>
            <Text style={styles.temp}>20</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
          <View style={styles.day}>
            <Text style={styles.temp}>20</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
          <View style={styles.day}>
            <Text style={styles.temp}>20</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "tomato"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  weather: {
    backgroundColor: "blue",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    fontSize: 30,
    marginTop: -30,
  },
})