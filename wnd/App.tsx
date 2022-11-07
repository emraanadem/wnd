import { StatusBar } from 'expo-status-bar';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, Button, Text, View, Dimensions, TextInput} from 'react-native';
const coords = require('./coordinates.json');
import { useState } from 'react';
import { useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import { NavigationContainer } from '@react-navigation/native'
import axios from 'axios';


const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width/height; 
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Geocoder.init("AIzaSyAcbzRAiaNGNy3SLnb17EWS0a-uXSitG6o");

export async function onClickButtons(){
  const apiResponse = await Geocoder.from(location)
  const json = apiResponse.results[0].geometry.location
  const lats = json['lat']
  const longs = json['lng']
  return {lats, longs}

}

export async function mapStuff(){
  const url = 'https://rich-jokes-bet-107-21-163-247.loca.lt'
  const apiResponse = await fetch(url)
  const json = await apiResponse.json()
  const houseinfo = json[location]
  mapMarkers(houseinfo)

}

export type TApiResponse = {
  data: any;
  error: any;
  loading: Boolean;
};


export function mapMarkers(placer: Array<any>): JSX.Element|JSX.Element[] {
  if (placer != undefined) {
    const finallist = placer.filter(item => {if(item[1] != null){
      return item
    }})
    finallist.forEach(item => {if(item[3] == null){
      item[3] = "Contact for Pricing"
    }else{
      item[3] = "$" + item[3]
    }})
    return finallist.map(item => 
      <Marker 
        key={String(item[0])}
        coordinate={{ latitude: item[1], longitude: item[2] }}
        title={String(item[0]).split(",", 1)[0]}
        description={String(item[3])}
      />)
  } else {
    return <></>
  }
}

let location = ""

var INITIAL_POSITION;

INITIAL_POSITION = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }
async function RegionInit(){
  INITIAL_POSITION = {
    latitude: (await onClickButtons()).lats,
    longitude: (await onClickButtons()).longs,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
    };}

// 'https://rich-jokes-bet-107-21-163-247.loca.lt'

export default function App(): JSX.Element{
  const [text, setText] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [showText, setShowText] = useState(true)

  const onClickButton = async () => {
    await mapStuff()
    await onClickButtons()
    await RegionInit()
    setShowText(false);
    setShowMap(true);
  }
  return (
    <View style={styles.container}>
        {showMap && (
          <MapView style={styles.map} provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_POSITION}
          >
            {}
        </MapView>)}
      {showText && (
        <>
        <TextInput
          value={text}
          style={{ fontSize: 20, color: 'steelblue'}}
          placeholder="Where is Your University Located?"
          onChangeText={(text) => {
            setText(text)
            location = text
          }}
        />
        <Button title = {'Submit'} onPress={onClickButton}/>
        </>
        )}
 </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});


// Need to auto-update location into the function that gets the data for the markers