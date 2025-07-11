import { Fontisto } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
console.log(SCREEN_WIDTH);

const API_KEY = "1676c8df74747a9a078428f248eda71c"

const weatherTypes = ["Clouds", "Rain", "Clear"];


const icons = {
  Clouds: "cloudy",
  Rain: "rain",
  Clear: "day-sunny",
};

type DayWeather = {
  day: number;
  main: string;
  temp: any;
};

export default function HomeScreen() {

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, setCity] = useState<String>("Loading...")
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState<DayWeather[]>([]);

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
      const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
      console.log(loc);
      // 위경도 추출
      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })

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
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
        )
        const json = await response.json()
        console.log(json.weather)

        const fakeDays = Array.from({ length: 7 }).map((_, index) => {
          const randomWeather =
            weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

          return {
            day: index + 1,
            main: randomWeather,
            temp: json.main.temp,
          };
        });
        setDays(fakeDays);
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

  const renderWeather = () => {
    if (days.length === 0) {
      return (
        <View style={styles.day}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return days.map((item) => <DayWeatherItem key={item.day} {...item} />);
  };
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
        {renderWeather()}
      </ScrollView>
    </View>
  );
}

function DayWeatherItem({ day, main, temp }: DayWeather) {
  return (
    <View key={day} style={styles.day}>
      <View style={styles.tempContainer}>
        <Text style={styles.temp}>{parseFloat(temp).toFixed(1)}</Text>
        <Fontisto
          name={icons[main as keyof typeof icons] as any}
          size={68}
          color="black"
        />
      </View>
      <Text style={styles.description}>{main}</Text>
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

  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
  },
  day: {
    width: SCREEN_WIDTH,
    paddingLeft: 16,
  },
  temp: {
    marginTop: 50,
    fontSize: 110,
  },
  tempContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingEnd: 16
  },
  description: {
    fontSize: 30,
    marginLeft: 10,
    marginTop: -10,
  },
  tinyText: {
    fontSize: 20,
  }
})