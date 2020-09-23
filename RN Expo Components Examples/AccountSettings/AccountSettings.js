import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import BackButton from '../Commons/BackButton/BackButton'
import UserAvatar from '../Commons/UserAvatar/UserAvatar'
import LaikaIconButton from '../Commons/Button/LaikaIconButton';
import { connect } from 'react-redux';

import Icon from '../Commons/Icons/Icon'

const AccountSettings = ({navigation, user}) => {
    const [number, setNumber] = useState(user.phone);
    const [code, setCode] = useState(user.country_phone.code_country);
    const [flag, setFlag] = useState(user.country_phone.avatar);
    const [country_id, setCountryId] = useState();

    const onSelectCode = (code, flag, country_id) => {
        setCode(code)
        setFlag(flag)
        setCountryId(country_id)
    }

    return (
        <ScrollView style={styles.root}>
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, backgroundColor: 'white', elevation: 5, marginBottom: 15, paddingBottom: 20 }}>
                <BackButton custom={true} />
                <Text style={{...styles.title, marginTop: 3, textAlign: 'center', width: '90%'}}>
                    Mi Cuenta
                </Text>
            </View>
            <View style={{backgroundColor: 'transparent', alignItems: 'center'}}>
                <UserAvatar imageSource={require('../../../assets/user.png')}/>
                <Text style={styles.name}>{user.fullname}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>
            <View style={{paddingHorizontal: '10%'}}>
                <Text style={styles.label}>Nombre y Apellido</Text>
                <View style={{borderRadius: 5, backgroundColor: '#F4F5F9', paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                        name='grupo-5330'
                        style={{marginRight: 10}}
                        size={20}
                    />
                    <TextInput style={{fontSize: 20, color: "#A3A8B5", flex: 1}} defaultValue={user.fullname} placeholder='Nombre y Apellido'/>
                </View>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={{borderRadius: 5, backgroundColor: '#F4F5F9', paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                        name='grupo-5332'
                        style={{marginRight: 10}}
                        size={15}
                    />
                    <TextInput style={{fontSize: 20, color: "#A3A8B5", flex: 1}} defaultValue={user.email} placeholder='Correo electrónico'/>
                </View>
                <Text style={styles.label}>Teléfono</Text>
                <View style={{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 45, height: 30}} source={{uri: flag}}/>
                    <TouchableOpacity onPress={()=>{navigation.navigate('CountryPicker', {onSelect: onSelectCode})}} style={{borderRadius: 5, paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, backgroundColor: '#F4F5F9', marginRight: 10}}>
                        <Text style={{fontSize: 20, fontFamily: 'ProximaNova-Black', color: '#653F90'}}>{code}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.navigate('PhoneNumberEdition', {code, number, flag})}} style={{borderRadius: 5, paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, backgroundColor: '#F4F5F9', flex:1}}>
                        <Text style={{fontSize: 20, color: '#A3A8B5'}}>{number}</Text>
                    </TouchableOpacity>
                </View>
                <LaikaIconButton action={()=>{navigation.navigate('ChangePassword')}} style={{marginHorizontal: 0, maxHeight: 80, height: 50, marginVertical: 50}} textAlign="center" title='Cambiar Contraseña' icon="noun_password_2068753-1"/>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 0,
        position: "relative",
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
        fontSize: 15,

    }
})

const mapStateToProps = (state) => {
    return ({
        user: state.Authentication.user.userInfo,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({})
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
