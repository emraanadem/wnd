import { StatusBar } from 'expo-status-bar';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
const coords = require('./coordinates.json');
import { useState } from 'react';
import { useEffect } from 'react';


const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width/height; 
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: coords['latitude'],
  longitude: coords['longitude'],
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};

export type TApiResponse = {
  data: any;
  error: any;
  loading: Boolean;
};

export const useApiGet = (url: string): TApiResponse => {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAPIData = async () => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url);
      const json = await apiResponse.json();
      let city = coords['loc'];
      setData(json[city]);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAPIData();
  }, []);

  return { data, error, loading };
};

export function mapMarkers(placer: Array<any>): JSX.Element {
  if (placer != undefined) {
    return (
      <>
        {placer.map(item => 
          {if(item[1] != null && item[2] != null){
            <Marker 
              key={item[0]}
              coordinate={{ latitude: item[1], longitude: item[2] }}
              title={item[0]}
              description={String(item[3])}
            />}})}
      </>
      )
      } else {
        return <></>
      }
    }
let placer = new Array();
let mark = false

export default function App() {
  // call to the hook
  const data: TApiResponse = useApiGet(
    'https://rich-jokes-bet-107-21-163-247.loca.lt'
  );

  const component = mapMarkers(data.data);
    // print the output
  if (!data.loading) {
    placer = data.data
    if(placer != undefined){
      mark = true}}
    
  return (
    <View style={styles.container}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
        >
          {component != null && (component)}
      </MapView>
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