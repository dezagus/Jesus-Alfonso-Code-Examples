import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import BackButton from '../../Commons/BackButton/BackButton'
import Icon from '../../Commons/Icons/Icon'
import { connect } from 'react-redux'
import { loadCountries } from '../../../../Store/actions/CountryActions'
import { QUERIES_STATUS } from '../../../../Store/types'
import { Spinner } from 'native-base'

// const countries = [
//     // {name: 'Argentina', key: '54'},
//     // {name: 'Colombia', key: '57'},
//     // {name: 'Venezuela', key: '58'}
// ]

const CountryPicker = ({ navigation, loadCountries, countries, countryLoadErrors, countryLoadStatus }) => {

    useEffect(()=>{
        loadCountries();
    }, [])

    const onSelect = (code, flag, country_id) =>{ 
        navigation.goBack();
        navigation.getParam('onSelect')(code, flag, country_id)
    }

    const [selected, setSelected] = useState(navigation.getParam('current'))
    return (
        <View style={styles.root}>
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, backgroundColor: 'white', elevation: 5, marginBottom: 15, paddingBottom: 20 }}>
                <BackButton custom={true} />
                <Text style={{...styles.title, marginTop: 3, textAlign: 'center', width: '90%'}}>
                    Selecciona un país
                </Text>
            </View>
            {countryLoadStatus === QUERIES_STATUS.SUCCESS && <FlatList
                data={countries}
                renderItem={({item})=>{
                    console.log(item)
                    return(
                    <TouchableOpacity  key={item.id} onPress={()=>{onSelect(item.code_country, item.avatar, item.id)}} style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginHorizontal: '10%', alignItems: 'center'}}>
                        <Text style={{color: '#653F90', fontSize: 20}}>{item.name} (+{item.code_country})</Text>
                        {item.code_country === selected && <View style={{backgroundColor: 'green', padding: 2, borderRadius:500}}>
                                <Icon name='uniE90E' size={12} color='white'/>
                            </View> 
                        }
                    </TouchableOpacity>
                    )
                }}
            />}
            {countryLoadStatus === QUERIES_STATUS.FAILURE &&
                <View>
                    <Text>{countryLoadErrors.msg}</Text>
                </View>
            }
            {countryLoadStatus === QUERIES_STATUS.LOADING &&
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner color='#653F90'/>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 0,
        position: "relative",
    },
    strenghtContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    setContainer: {
        marginVertical: 10,
        marginHorizontal: '10%'
    },
    inputContainer: {
        marginVertical: 5,
        paddingVertical: 5,
        borderBottomColor: '#653F90',
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        fontSize: 20
    },
    iconContainer: {
        paddingHorizontal: 10
    },
    button: {
        backgroundColor: '#653F90',
        padding: 20,
        alignItems: 'stretch',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'ProximaNova-Black'
    },
    title: {
        marginBottom: 5,
        fontFamily: 'ProximaNova-Black',
        color: '#653F90',
        fontSize: 25,
        alignSelf: 'center',
    },
    name: {
        fontFamily: 'ProximaNova-Black',
        color: '#653F90',
        fontSize: 30,
    },
    email: {
        fontFamily: 'ProximaNova-Regular',
        color: '#653F90',
        fontSize: 20,
    },
    label: {
        marginTop: 25,
        marginBottom: 8,
        color: '#653F90',
        fontSize: 20,

    }
})

const mapStateToProps = (state) => {
    return({
        countries: state.Country.countries,
        countryLoadStatus: state.Country.loadCountries.status,
        countryLoadErrors: state.Country.loadCountries.errors
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        loadCountries: () => {
            dispatch(loadCountries())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryPicker)
