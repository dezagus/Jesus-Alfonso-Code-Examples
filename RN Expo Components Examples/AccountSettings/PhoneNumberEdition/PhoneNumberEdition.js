import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import BackButton from '../../Commons/BackButton/BackButton'
import LaikaIconButton from '../../Commons/Button/LaikaIconButton'
import { connect } from 'react-redux';

const PhoneNumberEdition = ({navigation, user}) => {
    const [code, setCode] = useState(navigation.getParam('code'));
    const [number, setNumber] = useState(navigation.getParam('number'));
    const [flag, setFlag] = useState(navigation.getParam('flag'));
    const [country_id, setCountryId] = useState(null);

    const onSelectCode = (code, flag, country_id) => {
        setCode(code)
        setFlag(flag)
        setCountryId(country_id)
    }
    
    return (
        <ScrollView style={styles.root}>
            <BackButton custom={true} style={{}}/>
            <Text style={styles.title}>¿Cuál es tu número?</Text>
            <Text style={styles.text}>Te enviaremos un mensaje de texto para validar tu número de teléfono.</Text>
            <Text style={styles.label}>Teléfono</Text>
            <View style={{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{width: 45, height: 30}} source={{uri: flag}}/>
                <TouchableOpacity onPress={()=>{navigation.navigate('CountryPicker', {onSelect: onSelectCode})}} style={{borderRadius: 5, paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, backgroundColor: '#F4F5F9', marginRight: 10}}>
                    <Text style={{fontSize: 20, fontFamily: 'ProximaNova-Black', color: '#653F90'}}>{code}</Text>
                </TouchableOpacity>
                <View style={{borderRadius: 5, paddingVertical: 5, minHeight: 30, paddingHorizontal: 10, backgroundColor: '#F4F5F9', flex:1}}>
                    <TextInput keyboardType='numeric' style={{fontSize: 20, color: '#A3A8B5'}} defaultValue={number} onChangeText={number=>setNumber(number)}/>
                </View>
            </View>
            <LaikaIconButton action={()=>{navigation.navigate('InsertSmsCode', {formData: user})}} style={{marginHorizontal: 0, maxHeight: 80, height: 50, marginVertical: 20}} textAlign="center" title='Recibir scódigo por sms' icon="noun_sms_1251382"/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 0,
        position: "relative",
        marginHorizontal: '10%',
        marginVertical: 40
    },
    button: {
        backgroundColor: '#653F90',
        padding: 20,
        alignItems: 'stretch',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'ProximaNova-Black'
    },
    title: {
        marginBottom: 5,
        fontFamily: 'ProximaNova-Regular',
        color: '#653F90',
        fontSize: 28,
        marginTop: 30
    },
    text: {
        fontFamily: 'ProximaNova-Regular',
        color: '#653F90',
        fontSize: 18,
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

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberEdition)
