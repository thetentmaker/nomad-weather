// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
      <View style={{flex: 1}}>
        <View style={{flex:1, backgroundColor:"tomato"}}></View>
        <View style={{flex:1.5, backgroundColor:"teal"}}></View>
        <View style={{flex:1, backgroundColor:"orange"}}></View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    color: "black"
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
