import React from 'react'
import { View, Text, ScrollView, FlatList } from 'react-native'
import BackButton from '../../Commons/BackButton/BackButton'
import { StyleSheet } from 'react-native'
import Icon from '../../Commons/Icons/Icon'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getTypeAdresses, loadUserAddresses } from '../../../../Store/actions/AddressActions'
import { QUERIES_STATUS } from '../../../../Store/types'
import { Spinner } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const AddressItem = ({ item, address, icon, type, ...props }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.card, paddingHorizontal: 10, paddingLeft: 30 }}
      onPress={() => {
        if(!props.customAction)
          props.navigation.navigate('NuevaDireccion', {
            initialValues: item
          })
        else{
          props.navigation.pop();
          props.customAction(item)
        }
      }
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={item.type_address.icon}
              size={18}
              style={{ marginRight: 10 }}
              color='#653F90'
            />
            <Text style={{ ...styles.laikaText, fontSize: 12, textTransform: 'capitalize' }}>
              {item.type_address.name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon
              name='shipping'
              color='#22CC43'
              size={18}
              style={{ marginRight: 10, marginLeft: 10 }}
            />
            <Text style={{ ...styles.laikaText, width: wp('65'), fontSize: 18 }}>
              {item.address}
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 5, backgroundColor: '#E5E7EA', padding: 2, borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            name='chevron-left'
            color='#653F90'
            size={10}
          />
        </View>
      </View>
    </TouchableOpacity >
  )
}

const NewAddressButton = (props) => {

  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(getTypeAdresses())
        props.navigation.navigate('NuevaDireccion', {
          readMode: false
        })
      }}
      style={{ paddingVertical: 20, width: '100%', marginBottom: 30, alignItems: 'center', elevation: 2, backgroundColor: 'white', borderRadius: 5, alignSelf: 'stretch', paddingHorizontal: 10 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Icon
          name='shipping'
          color='#653F90'
          size={20}
        />
        <Text style={{ ...styles.laikaText, fontSize: 18, flex: 1, textAlign: 'center' }}>
          Agregar direccion
        </Text>
        <View style={{ marginHorizontal: 5, backgroundColor: '#E5E7EA', padding: 2, borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            name='chevron-left'
            color='#653F90'
            size={10}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const MisDirecciones = (props) => {
  
  const addresses = useSelector(
    state => state.Address.addresses
  );

  const loadUserAddressesStatus = useSelector(
    state => state.Address.loadUserAddresses.status
  );

  const dispatch = useDispatch();

  const rederMyAddressesContent = () => {
    if (loadUserAddressesStatus == QUERIES_STATUS.LOADING) {
      return (<Spinner color={'#653f90'} />)
    }
    if (loadUserAddressesStatus == QUERIES_STATUS.FAILURE) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{ ...styles.laikaText, fontSize: 18 }}
          >
            No se pudieron cargar los datos.
          </Text>
          <View style={{ marginVertical: 5, alignItems: 'center', width: wp('60') }}>
            <TouchableOpacity
              onPress={() => dispatch(loadUserAddresses())}
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
    if (addresses.length < 1) {
      return (
        <View style={{ ...styles.container, alignItems: 'center' }}>
          <Text
            style={{ ...styles.laikaText, fontSize: 18, marginBottom: 10 }}
          >
            No existen direcciones registradas.
          </Text>
          <NewAddressButton {...props} />
        </View>)
    }
    return (
      <ScrollView style={{ ...styles.container }}>
        <Text style={[styles.title, styles.laikaText]}>Dirección</Text>
        <FlatList
          data={addresses}
          renderItem={({ item, index }) => (
            <AddressItem
              item={item}
              address={item.address}
              type={item.type_address.name}
              icon={item.type_address.icon}
              navigation={props.navigation}
              customAction={props.navigation.getParam('addressAction')}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
        <NewAddressButton {...props} />

      </ScrollView>
    )
  }

  return (
    <View style={{ ...styles.root }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, backgroundColor: 'white', elevation: 5, paddingBottom: 20 }}>
        <BackButton custom={true} />
        <Text style={{ ...styles.screenTitle, marginTop: 3, textAlign: 'center', width: '90%' }}>
          Mis direcciones
        </Text>
      </View>
      {rederMyAddressesContent()}
    </View>
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
    marginHorizontal: '5%'
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

export default MisDirecciones
