import React from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Dimensions, Image, ActivityIndicator, Alert, Platform } from 'react-native'
import { StyleSheet } from 'react-native'
import BackButton from '../../Commons/BackButton/BackButton'
import { useState } from 'react'
import Icon from '../../Commons/Icons/Icon'
import { TouchableOpacity, ScrollView, FlatList } from 'react-native-gesture-handler'
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapInput from './MapInput'
import { useDispatch, useSelector } from "react-redux";
import { QUERIES_STATUS } from '../../../../Store/types'
import { Spinner } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { getTypeAdresses, saveAddress, deleteAddress, editAddress } from '../../../../Store/actions/AddressActions'
import MapView, { Marker } from 'react-native-maps'

const platformVersion = Platform.Version;

const Button = ({ title, onPress, disabled, ...props }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ backgroundColor: disabled ? '#AAA' : '#653F90', borderRadius: 5, paddingVertical: 20, marginVertical: 10, marginHorizontal: '5%' }}>
      <Text
        style={{ ...styles.laikaText, color: 'white', fontSize: 18, textAlign: 'center', fontFamily: 'ProximaNova-Black' }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}
const NuevaDireccion = (props) => {
  const readMode = props.navigation.getParam('readMode', true); //read/write/edit
  const initialValues = props.navigation.getParam('initialValues', null);

  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.0090;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  const [addressForm, setAddressForm] = useState(() => {
    if (initialValues) {
      return {
        addressId: initialValues.id ? initialValues.id : '',
        address: initialValues.address ? initialValues.address : '',
        latitude: initialValues.lat ? parseFloat(initialValues.lat) : '',
        longitude: initialValues.long ? parseFloat(initialValues.long) : '',
        complement: initialValues.complement ? initialValues.complement : '',

        city: initialValues.city.name ? initialValues.city.name : '',
        country: initialValues.city.department && initialValues.city.department.country.name ? initialValues.city.department.country.name : '',
        isoCountryCode: null
      }
    }
    return {
      addressId: '',
      address: '',
      latitude: '',
      longitude: '',
      complement: '',

      city: '',
      country: '',
      isoCountryCode: null
    }
  })

  const [options, setOptions] = useState(() => {
    let selectedTypeAddress = undefined;
    if (initialValues) {
      selectedTypeAddress = initialValues.type_address
    }
    return {
      show: false,
      selectedTypeAddress,
      googleSearchInputFocus: false
    }
  })

  const typeAddresses = useSelector(
    state => state.Address.typeAddresses
  );

  const loadTypeAddressesStatus = useSelector(
    state => state.Address.loadTypeAddresses.status
  );

  const loadSaveAddressStatus = useSelector(
    state => state.Address.loadSaveAddress.status
  );

  const dispatch = useDispatch();

  const changeForm = (field, value) => {
    setAddressForm({
      ...addressForm,
      [field]: value
    })
  }

  const changeGSInputFocus = async () => {
    await setOptions({
      ...options,
      googleSearchInputFocus: !options.googleSearchInputFocus
    })
  }

  getCurrentLocation = async () => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      status = await Permissions.askAsync(Permissions.LOCATION);
      if (status.status !== 'granted') {
        alert('Debes permitir el acceso a la ubicación del dispositivo.');
        return
      }
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    let address = await Location.reverseGeocodeAsync(location.coords)
    setAddressForm({
      ...addressForm,
      address: address[0].street + ' ' + address[0].name,
      city: address[0].city,
      country: address[0].country,
      isoCountryCode: address[0].isoCountryCode,
      latitude: location.coords.latitude,
      longitude: location.coords.latitude
    })
  }

  const renderTypeAddresses = () => {
    if (loadTypeAddressesStatus == QUERIES_STATUS.LOADING) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', margin: 15 }}>
          <ActivityIndicator color={'#653f90'} size={25} />
        </View>
      )
    }
    if (typeAddresses.length < 1) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{ ...styles.laikaText, fontSize: 17 }}
          >
            No se pudieron cargar los datos.
          </Text>
          <View style={{ marginVertical: 5, alignItems: 'center', width: wp('60') }}>
            <TouchableOpacity
              onPress={() => dispatch(getTypeAdresses())}
              style={{ backgroundColor: '#653F90', borderRadius: 5, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, elevation: 2 }}
            >
              <Icon
                name='trazado-4720'
                color='white'
                size={14}
              />
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'ProximaNova-Regular',
                  marginLeft: 5
                }}
              >
                Intentar de nuevo.
            </Text>
            </TouchableOpacity>
          </View>
        </View>)
    }

    return (
      <FlatList
        data={typeAddresses}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setOptions({ show: false, selectedTypeAddress: item })
            }}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <View style={{ minWidth: 20 }}>
              <Icon
                name={item.icon}
                color='#653F90'
                size={14}
              />
            </View>
            <Text
              style={{ ...styles.laikaText, marginLeft: 10, textTransform: 'capitalize' }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />)
  }

  const buttonDisable = (
    addressForm.latitude === ''
    || addressForm.complement === ''
    || options.selectedTypeAddress === undefined
  );

  const renderButtons = () => {
    if (readMode) {
      return (
        <View>
          <Button
            title={"Editar"}
            disabled={false}
            onPress={() => {
              dispatch(getTypeAdresses())
              props.navigation.navigate('NuevaDireccion', {
                initialValues,
                readMode: false
              })
            }}
          />
          <Button
            title={"Eliminar"}
            disabled={false}
            onPress={() => {
              const { addressId } = addressForm;
              Alert.alert(
                "Alerta",
                "Estas seguro de que deseas eliminar esta dirección.",
                [
                  {
                    text: "SI",
                    onPress: () => dispatch(deleteAddress(addressId, props.navigation))
                  },
                  { text: "Cancelar", onPress: () => { }, style: "cancel" }
                ],
              );
            }}
          />
        </View>
      )
    }
    if (initialValues) {
      return (
        <Button
          title={"Guardar Cambios"}
          disabled={buttonDisable}
          onPress={() => {
            const { addressId, address, complement, latitude, longitude } = addressForm;
            const { selectedTypeAddress } = options;
            Alert.alert(
              "Notificación",
              "Estas seguro de que deseas guardar los cambios.",
              [
                {
                  text: "SI",
                  onPress: () => dispatch(editAddress(addressId, address, complement, latitude, longitude, selectedTypeAddress.id, props.navigation))
                },
                { text: "Cancelar", onPress: () => { }, style: "cancel" }
              ],
            );
          }}
        />
      )
    }
    return (
      <Button
        title={"Guardar"}
        disabled={buttonDisable}
        onPress={() => {
          const { address, complement, latitude, longitude } = addressForm;
          const { selectedTypeAddress } = options;
          dispatch(saveAddress(address, complement, latitude, longitude, selectedTypeAddress.id, props.navigation))
        }}
      />
    )
  }

  return (
    <View style={{ ...styles.root }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, backgroundColor: 'white', elevation: 5, paddingBottom: 20 }}>
        <BackButton custom={true} />
        <Text style={{ ...styles.screenTitle, marginTop: 3, textAlign: 'center', width: '90%' }}>
          {readMode ? "Ver Dirección" : (initialValues ? "Editar dirección" : "Agregar dirección")}
        </Text>
      </View>
      {loadSaveAddressStatus === QUERIES_STATUS.LOADING ? (
        <Spinner color={'#653f90'} />
      ) : options.googleSearchInputFocus ? (
        <ScrollView
          style={{ ...styles.container }}
          keyboardShouldPersistTaps="handled"//Para solventar problemas al precionar lista de GooglePlacesAutocomplete
        >
          <MapInput
            defaultValue={addressForm.address}
            isoCountryCode={addressForm.isoCountryCode}
            autoFocus={true}
            disableScroll={false}
            onPress={(description, location) => {
              setAddressForm({
                ...addressForm,
                address: description,
                latitude: location.lat,
                longitude: location.lng,
              })
              changeGSInputFocus()
            }}
          />
          <TouchableOpacity
            onPress={() => { changeGSInputFocus() }}
            style={{
              backgroundColor: '#653F90', borderRadius: 5, paddingVertical: 20, marginVertical: 10, marginHorizontal: '5%'
            }}
          >
            <Text
              style={{
                ...styles.laikaText, color: 'white', fontSize: 18, textAlign: 'center', fontFamily: 'ProximaNova-Black'
              }}
            >
              Volver
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
            <ScrollView
              style={{ ...styles.container }}
            >
              <KeyboardAvoidingView behavior={platformVersion >= 29 ? '' : 'position'}>
                {addressForm.address !== '' && (
                  <View style={{ width: '100%', height: hp('34%'), overflow: 'hidden', borderRadius: 10, borderWidth: 0.5, borderColor: '#653f90' }}>
                    <MapView
                      style={{ flex: 1 }}
                      minZoomLevel={10}
                      showUserLocation
                      followUserLocation
                      showsPointsOfInterest={false}
                      initialRegion={{
                        latitude: addressForm.latitude,
                        longitude: addressForm.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: addressForm.latitude,
                          longitude: addressForm.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                      >
                        <Image
                          source={require('../../../../assets/mapPin.png')}
                          style={{ width: 90, height: 90, resizeMode: 'contain' }} />
                      </Marker>
                    </MapView>
                  </View>
                )}
                {
                  !readMode ? (
                    <View
                      style={{ borderRadius: 5, backgroundColor: '#F4F5F9', paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20, marginTop: addressForm.address ? 20 : 0 }}>
                      <TextInput
                        style={{ color: '#653F90', fontSize: 16 }}
                        onChangeText={(text) => changeForm('address', text)}
                        value={addressForm.address}
                        onFocus={changeGSInputFocus}
                        multiline={true}
                      />
                    </View>
                  ) : <View style={{ marginTop: 30 }} />
                }
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Icon
                    name='shipping'
                    color='#22CC43'
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ marginBottom: 5 }}>
                    <TouchableOpacity
                      disabled={readMode}
                      onPress={getCurrentLocation}
                    >
                      <Text
                        style={{
                          ...styles.laikaText,
                          fontFamily: 'ProximaNova-Black',
                          fontSize: 18
                        }}
                      >
                        {readMode ? "Datos de la Dirección" : "Añadir desde tu ubicación actual"}
                      </Text>
                    </TouchableOpacity>
                    {addressForm.address !== '' && <Text style={{ ...styles.laikaText, fontSize: 18, color: '#AAA' }}>{addressForm.address}</Text>}
                    {addressForm.address !== '' && <Text style={{ ...styles.laikaText, fontSize: 12 }}>{addressForm.city}-{addressForm.country}</Text>}
                  </View>

                </View>
                <View style={{ ...styles.card, marginVertical: 10 }}>
                  <TouchableOpacity
                    disabled={readMode}
                    onPress={() => { setOptions({ ...options, show: !options.show }) }}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Icon
                        name='noun_door_2511120'
                        color='#653F90'
                        size={20}
                      />
                      <View>
                        <Text style={{ ...styles.laikaText, fontSize: 18, marginLeft: 10 }}                        >
                          Detalles de la entrega
                        </Text>
                        {options.selectedTypeAddress !== undefined && (
                          <Text
                            style={{ ...styles.laikaText, marginLeft: 10, color: '#AAA', fontSize: 14, textTransform: 'capitalize' }}
                          >
                            {options.selectedTypeAddress.name}
                          </Text>
                        )}
                      </View>
                    </View>
                    {!readMode && (
                      <View style={{ marginHorizontal: 5, backgroundColor: '#E5E7EA', padding: 2, borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>

                        <Icon
                          style={{ transform: [{ rotateZ: options.show ? "90deg" : "0deg" }] }}
                          name='chevron-left'
                          color='#653F90'
                          size={10}
                        />

                      </View>
                    )}
                  </TouchableOpacity>
                  {options.show && <View style={{ padding: 10 }}>
                    {renderTypeAddresses()}
                  </View>}
                </View>
                <View style={{ ...styles.card, marginVertical: 10 }}>
                  <Text style={{ ...styles.laikaText, fontSize: 18 }}>Más detalles.</Text>
                  <TextInput
                    editable={!readMode}
                    multiline
                    placeholder='Apartamento 205'
                    value={addressForm.complement}
                    onChangeText={(text) => changeForm('complement', text)}
                    style={{ ...styles.laikaText, fontSize: 18, backgroundColor: '#FCFCFC', padding: 10 }}
                  />
                </View>
                {renderButtons()}
              </KeyboardAvoidingView>
            </ScrollView>
          )}
    </View >
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#FBFBFB',
    flex: 1
  },
  screenTitle: {
    marginBottom: 5,
    fontFamily: 'ProximaNova-Black',
    color: '#653F90',
    fontSize: 25,
    alignSelf: 'center',
  },
  container: {
    marginVertical: 20,
    marginHorizontal: '5%',
    flex: 1
  },
  card: {
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: 5,
    padding: 20
  },
  laikaText: {
    color: '#653F90',
    fontFamily: 'ProximaNova-Regular'
  },
  title: {
    fontSize: 18
  }
})

export default NuevaDireccion
