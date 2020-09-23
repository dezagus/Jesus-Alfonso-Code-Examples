import React from 'react';
import { Icon } from 'react-native-elements';
import {AppState, Dimensions, ImageBackground} from 'react-native';
import {
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  Image,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Location from 'expo-location';
import * as Font from 'expo-font'
import Url from '../utils/Url.js'
import MapViewDirections from 'react-native-maps-directions';
import Echo from 'laravel-echo/dist/echo';
import Socketio from 'socket.io-client';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import getDirections from 'react-native-google-maps-directions'
import { Linking } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import {Camera} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const PUSH_ENDPOINT = Url.Prod + 'exponent/devices/subscribe';
const LOCATION_TASK_NAME = 'background-location-task';

class TravelInProgressDriver extends React.Component {

  _isMounted = false

  constructor(props) {
    super(props);
    this.state = {
      userLat: -34.6,
      userLng: -58.7,
      latitude: null,
      longitude: null,
      latituded: null,
      longituded: null,
      // coordLoaded: false,
      modalVisible: true,

      searchView: true,
      takeSelfieAction: false,
      searchViewOrigin: true,
      fontsLoaded: false,
      // total: 0,
      loadCard: false,
      startAddress: '',
      coordLoaded: false,
      distance: 0,
      price_base: 0,
      price_km: 0,
      total: 0,
      waitDriver: false,
      travel: null,
      showVehicle: false,
      vehicle: {},
      visible: false,
      allowDragging: true,
      openChat: false,
      x: new Animated.Value(0),
      showDetails: false,
      message: '',
      follow: true,
      chatsTravel: [],
      waypoint: [],
      arrived: false,
      totalDriver: 0,
      type: Camera.Constants.Type.back,
      appState: AppState.currentState,

      hasCameraPermission: null,
    };
  }
  _handleAppStateChangea = async nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      //console.log('App has come to the foreground!');
      let nable = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
      console.log("asdads",nable)
      if(nable){
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        // await BackgroundFetch.unregisterTaskAsync(LOCATION_TASK_NAME)

      }
    }else{
      console.log("me voy inprogress ==>",nextAppState)
      //me vengo con el task manager
      await BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
        minimumInterval:30000,
        stopOnTerminate:false,
      })
      //una vez otorgado creamos el update de la location y le asignamos la tarea con la constante antes creada
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval:30000,//tiempo cada vez que actulize si no lo ponemos actualizara cada vezque el usuario s emueva
        showsBackgroundLocationIndicator:true,//importante para celulares 8.0 en adelante andorid
        foregroundService:{//variables de la notificacion
          notificationTitle:"Buho, ubicación en tiempo real.",
          notificationBody:"Estamos recibiendo tu ubicación en tiempo real."
        }
      });

    }
    this.setState({ appState: nextAppState });
  };
  async getDirectionApi() {
    let coordsUser = { latitude: this.state.userLat, longitude: this.state.userLng }
    let address = await Location.reverseGeocodeAsync(coordsUser)
    let inputAddress = address[0].street + ' ' + address[0].name
    if (this._isMounted) {
      this.setState({
        startAddress: inputAddress
      })
    }
  }


  async getGeolocationUser() {

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      navigator.geolocation.watchPosition(
        (position) => {

          setTimeout(() => {
            fetch('' + Url.Dev + 'printVehicle', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + value,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                heading: position.coords.heading,
              })
            }).then((response) => response.json()).then((res) => {
            });
          }, 5000);

          if (this._isMounted) {
            this.setState({
              userLat: position.coords.latitude,
              userLng: position.coords.longitude,
              coordLoaded: true,
              error: null,
            });

            this.getDirectionApi()
          }
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 1 },
      );

    }
  }

  async componentDidMount() {

    this._isMounted = true
    const { status2 } = await Permissions.askAsync(Permissions.CAMERA);
    const { status3 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let tra = await AsyncStorage.getItem("travelItem")
    let trap = JSON.parse(tra)


    this.setState({
      travel:trap,
      hasCameraPermission: status2 === 'granted'
    },()=>{

      AsyncStorage.setItem("travelid",this.state.travel.id)
    });
    AppState.addEventListener('change', this._handleAppStateChangea);

  }

  componentWillUnmount() {
    this._isMounted = false
    AppState.removeEventListener('change', this._handleAppStateChangea);

  }

  async verifyUser() {

    await fetch('' + Url.Dev + 'details', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + value,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((res) => {
      if (res.driver === true) {
        const { navigate } = this.props.navigation;
        navigate('DriverIndex')
      }
    });
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const LATITUDE_DELTA = 0.0090;
    const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
        return (
           //Contenido visual etiquetas RN
        )


  }
}

export default TravelInProgressDriver;
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` detectamos el error

    return;
  }
  if (data) {
    const { locations } = data;
    const driverarrived = await AsyncStorage.getItem("driverArrived")
    const travelid = await AsyncStorage.getItem("travelid")

    fetch('' + Url.Dev + '/printVehicles', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + value,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        travelid:travelid,
        latitude:locations[0].coords.latitude,
        heading:locations[0].coords.heading,
        longitude:locations[0].coords.longitude,
        isarrived:driverarrived === "true" ? true : false,
      })
    }).then((response) => response.json()).then((res) => {

    })

  }
});

