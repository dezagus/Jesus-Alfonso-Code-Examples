import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Image, ScrollView } from 'react-native'
import BackButton from '../../Commons/BackButton/BackButton'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../../Commons/Icons/Icon'

const PasswordStrength = ({strength = 0}) => {
    //strength goes from 0 to 3
    return(
        <View style={{alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100, height: 10, position: 'relative', backgroundColor: 'transparent', justifyContent: 'center', marginRight: 5}}>
                {strength > 0 && <View style={{width: 100, height: 2, position: 'absolute', left: 0, backgroundColor: '#DEDEDE'}}></View>}
                {strength > 0 && <View style={{width: strength === 1 ? 33 : strength === 2 ? 50 : 100, height: 2, position: 'absolute', left: 0, backgroundColor: strength === 1 ? 'red' : (strength === 2 ? '#FFCB24' : '#69E7B4')}}></View>}
            </View>
            {strength > 0 && <Text style={{color: strength === 1 ? 'red' : (strength === 2 ? '#FFCB24' : '#69E7B4')}}>{strength === 1  ? 'Debil' : (strength === 2 ? 'Medio' : 'Fuerte')}</Text>}
        </View>
    )            
}

const ChangePassword = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [hideNewPassword, setHideNewPassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const checkPasswordStrength = (pwd) => {
        let str = 0
        if(pwd && pwd.length <= 10)
            str = 2
            if(pwd && pwd.length <= 6)
            str = 1
        if(pwd && pwd.length <= 4)
            str = 0
        return str
    }

    useEffect(()=> {
        const str = checkPasswordStrength(newPassword)
        setPasswordStrength(str)
    }, [newPassword])

    return (
        <ScrollView style={styles.root}>
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, backgroundColor: 'white', elevation: 5, marginBottom: 15, paddingBottom: 20 }}>
                <BackButton custom={true} />
                <Text style={{...styles.title, marginTop: 3, textAlign: 'center', width: '90%'}}>
                    Cambiar Constraseña
                </Text>
            </View>
            <View style={styles.setContainer}>
                <Text style={styles.label}>Contraseña Actual</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={password} secureTextEntry={hidePassword} onChangeText={(val)=>{setPassword(val)}}/>
                    <TouchableOpacity onPress={()=>{setHidePassword(!hidePassword)}} style={styles.iconContainer}>
                        <Icon
                            name={hidePassword ? 'eye-closed' : 'eye-open'}
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.setContainer}>
                <Text style={styles.label}>Cambiar contraseña</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={newPassword} secureTextEntry={hideNewPassword} onChangeText={(val)=>{setNewPassword(val)}}/>
                    <TouchableOpacity onPress={()=>{setHideNewPassword(!hideNewPassword)}} style={styles.iconContainer}>
                        <Icon
                            name={hideNewPassword ? 'eye-closed' : 'eye-open'}
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
                <PasswordStrength strength={passwordStrength}/>
            </View>
            <View style={styles.setContainer}>
                <Text style={{...styles.label, ...(passwordConfirmation === newPassword ? {} : {color: 'red'})}}>{passwordConfirmation === newPassword ? 'Confirmar contraseña' : 'La contraseña no coincide'}</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={passwordConfirmation} secureTextEntry={hideConfirmPassword} onChangeText={(val)=>{setPasswordConfirmation(val)}} />
                    <TouchableOpacity onPress={()=>{setHideConfirmPassword(!hideConfirmPassword)}} style={styles.iconContainer}>
                        <Icon
                            name={hideConfirmPassword ? 'eye-closed' : 'eye-open'}
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableHighlight style={{...styles.button, marginHorizontal: '10%', marginTop: 20, ...((passwordConfirmation !== newPassword || !password || !newPassword || !passwordConfirmation) ? {backgroundColor: '#DEDEDE'} : {})}} disabled={passwordConfirmation !== newPassword || !password || !newPassword || !passwordConfirmation} onPress={()=>{}}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableHighlight>
        </ScrollView>
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

export default ChangePassword
