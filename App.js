import React from 'react';
import { Button, AppRegistry, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
const{width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width/height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA* ASPECT_RATIO

export default class App extends React.Component {

  componentWillMount(){
  }
  constructor(props){
    super(props);

    arrayMarkers = [
      {
        latitude: 0,
        longitude:0,
        latitudeDelta:0,
        longitudeDelta:0
      }
    ];
    this.state={
      initialPosition: {
        latitude: 0,
        longitude:0,
        latitudeDelta:0,
        longitudeDelta:0
      },
      markerPosition: {
        latitude: 0,
        longitude:0
      },
      markers:arrayMarkers
    }
  }
  watchID: ?number = null

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position =>{
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion ={
        latitude:lat,
        longitude:long,
        latitudeDelta:LATTITUDE_DELTA,
        longnitudeDelta:LONGITUDE_DELTA
      }
      this.setState({initialPosition:initialRegion})
      this.setState({markerPosition: initialRegion})
    },
      (error) => {},
      {enableHighAccuracy: true, timeout:20000, maximumAge:1000})

      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        var lastRegion = {
          latitude: lat,
          longitude:long,
          longitudeDelta: LONGITUDE_DELTA,
          latitudeDelta: LATITUDE_DELTA
        }
        this.setState({initialPosition: lastRegion})
        this.setState({markerPosition:lastRegion})
        })
  }
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  }
  onRegionChange(data){
    this.setState({
      region:{
        latitude:data.latitude,
        longitude:data.longitude,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      },

    })
  }
  onPress(data){
    let latitude = data.nativeEvent.coordinate.latitude;
    let longitude = data.nativeEvent.coordinate.longitude;

    arrayMarkers.push({
      latitude:latitude,
      longitude:longitude
    });
    this.setState({markers:arrayMarkers});
    // console.log(this.renderMarkers());
  }
  renderMarkers(){
    markers=[];
    for (marker of this.state.markers){
      markers.push(
        <MapView.Marker
        key={marker.longitude}
        coordinate={marker}
        image={require('./pin.png')}
        title={'Recycle Bin'}
        description={'Latitude: '+ Number((marker.latitude).toFixed(1)) + ' Longitude: ' + Number((marker.longitude).toFixed(1))}
        />
      )
    }
    return markers;
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
        region = {this.state.initialPosition}
        onPress = {this.onPress.bind(this)}
        >
        <MapView.Marker
          coordinate={this.state.markerPosition}
          title ={'your location'}
          >
          </MapView.Marker>
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F5FCFF'
  },
  map: {
    position:'absolute',
    top: 0,
    left:0,
    bottom: 0,
    right:0,
    height:400
  },
  image: {
    flex: 1,
    width: 30,
    height:30,
    resizeMode: 'contain'
  }
});
