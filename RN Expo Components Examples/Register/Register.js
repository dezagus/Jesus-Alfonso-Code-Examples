import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import FacebookLogo from '../../../assets/facebookLogo.png';
import GoogleLogo from '../../../assets/googleLogo.png';
import { IgressEmailModal } from '../Commons/DisplayModal/DisplayModal';
import Icon from '../Commons/Icons/Icon';
import { passwordStrength, registerUser, resetEmailValidator, facebookAuthentication, googleAuthentication, serviceAuthenticationReset } from '../../../Store/actions/AuthenticationActions';
import { connect } from 'react-redux';
import { QUERIES_STATUS } from '../../../Store/types';
import { Spinner } from 'native-base';

const PetCheckbox = ({ checked = false, onPress }) => {

    const defaultAction = () => { console.log('Ninguna accion ha sido asociada a este boton') }

    return (
        <TouchableOpacity onPress={onPress ? onPress : defaultAction} style={{...styles.checkbox, backgroundColor: checked ? '#3366FF' : '#F0F0F0'}}>
            {checked && 
                <Icon
                    name='uniE90E'
                    size={18}
                    color='white'
                />
            }
        </TouchableOpacity>
    )
}

const PasswordStrength = ({ strength = 0 }) => {
    //strength goes from 0 to 3
    return (
        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 100, height: 10, position: 'relative', backgroundColor: 'transparent', justifyContent: 'center', marginRight: 5 }}>
                {strength > 0 && <View style={{ width: 100, height: 2, position: 'absolute', left: 0, backgroundColor: '#DEDEDE' }}></View>}
                {strength > 0 && <View style={{ width: strength === 1 ? 33 : strength === 2 ? 50 : 100, height: 2, position: 'absolute', left: 0, backgroundColor: strength === 1 ? 'red' : (strength === 2 ? '#FFCB24' : '#69E7B4') }}></View>}
            </View>
            {strength > 0 && <Text style={{ color: strength === 1 ? 'red' : (strength === 2 ? '#FFCB24' : '#69E7B4') }}>{strength === 1 ? 'Débil' : (strength === 2 ? 'Medio' : 'Fuerte')}</Text>}
        </View>
    )
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            email: '',
            password: '',
            dog: false,
            cat: false,
            hidePassword: true,
            icon: 'eye-open',
            iconColor: '#653F90',
            isModalVisible: false,
            inputNameValidation: false,
            inputEmailValidation: false,
            inputPassValidation: false,
            inputPetValidation: false,
            passwordStrength: 0
        }
    }

    componentDidMount() {
        this.props.resetCheck();
    }

    componentDidUpdate(prevProps) {
        if (this.props.checkEmailStatus !== prevProps.checkEmailStatus && this.props.checkEmailStatus === QUERIES_STATUS.SUCCESS) {
            console.log(this.props.checkEmailStatus)
            let pets = []
            if (this.state.dog)
                pets.push(1)
            if (this.state.cat)
                pets.push(2)
            this.props.navigation.navigate('TermsAndConditons', {
                onPress: () => {
                    this.props.navigation.navigate('AddCellNumber', {
                        formData: { email: this.state.email, password: this.state.password, fullname: this.state.fullname, petsType: pets },
                    })
                }
            })
        }
    }

    changeIcon() {
        this.setState(prevState => ({
            icon: prevState.hidePassword ? 'eye-closed' : 'eye-open',
            hidePassword: !prevState.hidePassword,
        }))
    }
    checkBoxCheckDog() {
        this.setState({
            dog: !this.state.dog,
        })
    }
    checkBoxCheckCat() {
        this.setState({
            cat: !this.state.cat,
        })
    }
    changeModalVisibility = (bool) => {
        this.setState({ isModalVisible: bool });
    }

    formValidation = () => {
        const spaceRegex = /(^(\s)+$)|^$/;

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        const validPassword = !spaceRegex.test(this.state.password);
        const validUser = emailRegex.test(this.state.email);
        const validName = !spaceRegex.test(this.state.fullname);

        this.setState({
            inputEmailValidation: !validUser,
            inputPassValidation: !validPassword,
            iconColor: validPassword ? '#653F90' : '#ff676a',
            inputNameValidation: !validName,
        })
        return (!!validPassword && !!validUser && !!validName)
    }

    checkNavigateTo = () => {
        if (!isEmpty(this.props.user)) {
            console.log('user', this.props.user)
            if (this.props.user.city_id == null) {
                this.props.navigation.replace('ShippingAddress');
            } else {
                this.props.navigation.navigate('Home');
            }
        }
    }

    handleRegister = () => {
        let pets = []
        if (this.state.dog)
            pets.push(1)
        if (this.state.cat)
            pets.push(2)
        if (this.formValidation()) {
            this.props.registerUser({
                email: this.state.email,
                password: this.state.password,
                fullname: this.state.fullname,
                petsType: pets
            })
        }
    }

    render() {
        // const {icon} = this.props;
        if (this.props.serviceAuthenticationStatus === QUERIES_STATUS.SUCCESS) {
            this.checkNavigateTo();
        }
        if (this.props.serviceAuthenticationStatus === 'INTERRUPTED') {
            console.log('form data del estado', this.props.serviceAuthenticationFormData)
            this.props.navigation.navigate('AddCellNumber', { formData: this.props.serviceAuthenticationFormData })
        }
        const { password } = this.state;
        const modalIngresoText = 'Laika tendrá acceso a la siguiente información: Nombre, dirección de correo electrónico y otra información  publica';
        userName = this.state.userName;
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.registerTitle}>¡Regístrate y deja a tus mascotas en las mejores manos!</Text>
                <View style={styles.registerForm}>
                    <View
                        style={
                            [
                                styles.textAlertBox,
                                this.state.inputNameValidation && styles.textAlertBoxView,
                                this.state.inputEmailValidation && styles.textAlertBoxView,
                                this.state.inputPassValidation && styles.textAlertBoxView
                            ]
                        }
                    >
                        <View style={styles.textAlertTexts}>
                            <Text style={styles.textAlertTitle}>
                                Parece que te hacen falta datos.
                                </Text>
                            <Text style={styles.textAlertText}>
                                Revisa el formulario antes de continuar los espacios no pueden ir en blanco.
                                </Text>
                        </View>
                        <Icon
                            style={styles.alertIcon}
                            name='int-error'
                            size={20}
                            color="#fff"
                        />
                    </View>
                    <View
                        style={
                            [
                                styles.inputBox,
                                this.state.fullname && styles.inputActive,
                                this.state.inputNameValidation && styles.inputEmptyAlert
                            ]
                        }
                    >
                        {this.state.fullname !== '' && <Text style={{
                            color: '#7C8494',
                            fontFamily: 'ProximaNova-Regular',
                            fontSize: 12
                        }}>
                            Nombre completo
                            </Text>}
                        <TextInput
                            style={{ color: this.state.inputNameValidation ? '#ff676a' : '#653F90' }}
                            placeholder={"Nombre completo"}
                            placeholderTextColor={this.state.inputNameValidation ? '#ff676a' : "#7C8494"}
                            underlineColorAndroid="transparent"
                            onChangeText={(value) => this.setState({ fullname: value })}
                        />
                    </View>
                    <View
                        style={
                            [
                                styles.inputBox,
                                this.state.email && styles.inputActive,
                                this.state.inputEmailValidation && styles.inputEmptyAlert
                            ]
                        }
                    >
                        {this.state.email !== '' && <Text style={{
                            color: '#7C8494',
                            fontFamily: 'ProximaNova-Regular',
                            fontSize: 12
                        }}>
                            Correo
                            </Text>}
                        <TextInput
                            style={{ color: this.state.inputEmailValidation ? '#ff676a' : '#653F90' }}
                            placeholder={"Correo"}
                            keyboardType='email-address'
                            placeholderTextColor={this.state.inputEmailValidation ? '#ff676a' : "#7C8494"}
                            underlineColorAndroid="transparent"
                            onChangeText={(value) => this.setState({ email: value })}
                            autoCapitalize='none'
                        />
                    </View>
                    <View
                        style={
                            [
                                styles.inputBox,
                                this.state.password && styles.inputActive,
                                this.state.inputPassValidation && styles.inputEmptyAlert
                            ]
                        }
                    >
                        {this.state.password !== '' && <Text style={{
                            color: '#7C8494',
                            fontFamily: 'ProximaNova-Regular',
                            fontSize: 12
                        }}>
                            Contraseña
                            </Text>}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={{ width: '90%', color: this.state.inputPassValidation ? '#ff676a' : '#653F90' }}
                                placeholder={"Contraseña"}
                                placeholderTextColor={this.state.inputPassValidation ? '#ff676a' : "#7C8494"}
                                underlineColorAndroid="transparent"
                                secureTextEntry={this.state.hidePassword}
                                onChangeText={(value) => this.setState({
                                    password: value,
                                    passwordStrength: passwordStrength(value)
                                })}
                                autoCapitalize='none'
                            />
                            <TouchableOpacity
                                style={styles.showHidePass}
                                onPress={() => this.changeIcon()}
                            >
                                <Icon
                                    name={this.state.icon}
                                    size={14}
                                    color={this.state.iconColor}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.checkBoxsForm}>
                    <Text style={{ ...styles.checkBoxTitle, color: this.state.inputPetValidation ? '#ff676a' : '#653F90' }}>¿Tienes mascota?</Text>
                    <View style={styles.checkBoxs}>
                        <View style={styles.checkBoxPet}>
                            <Text style={styles.checkBoxText}>Perro</Text>
                            <PetCheckbox
                                checked={this.state.dog}
                                onPress={() => this.checkBoxCheckDog()}
                            />
                        </View>
                        <View style={styles.checkBoxPet}>
                            <Text style={styles.checkBoxText}>Gato</Text>
                            <PetCheckbox
                                checked={this.state.cat}
                                onPress={() => this.checkBoxCheckCat()}
                            />
                        </View>
                        <View>
                            <PasswordStrength strength={this.state.passwordStrength} />
                        </View>
                    </View>
                </View>
                <Text style={{ color: '#ff676a' }}>{this.props.checkEmailErrors.msg}</Text>
                <TouchableOpacity
                    style={{ ...styles.defaultBtn, alignItems: 'center' }}
                    onPress={() => { this.handleRegister() }}
                >
                    {(this.props.checkEmailStatus !== QUERIES_STATUS.LOADING) &&
                        <Text style={styles.buttonText}>Crear cuenta</Text>
                    }
                    {this.props.checkEmailStatus === QUERIES_STATUS.LOADING &&
                        <Spinner
                            color='white'
                            style={{ width: 25, height: 25 }}
                        />
                    }
                </TouchableOpacity>
                <View style={styles.singInEmail}>
                    <Text style={styles.singInEmailText}>¿Ya tienes cuenta?</Text>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Text style={[styles.singInEmailText, styles.singInEmailTextLink]}>
                            Ingresa con tu email
                            </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.boderLineBox}>
                    <View style={styles.boderLine}></View>
                    <Text style={styles.boderLineText}>O</Text>
                    <View style={styles.boderLine}></View>
                </View>
                <View style={styles.singInSocial}>
                    <TouchableOpacity
                        style={styles.singInSocialButton}
                        onPress={() => { this.props.loginWithFacebook() }}
                    >
                        <Text style={[styles.singInSocialText, styles.singInSocialFacebook]}>
                            Iniciar sesión con Facebook
                            </Text>
                        <Image
                            style={styles.singInSocialIconFacebook}
                            source={FacebookLogo}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.singInSocialButton}
                        onPress={() => { this.props.loginWithGoogle() }}
                    >
                        <Text style={styles.singInSocialText}>
                            Iniciar sesión con Google
                            </Text>
                        <Image
                            style={styles.singInSocialIconGoogle}
                            source={GoogleLogo}
                        />
                    </TouchableOpacity>
                    <Modal
                        visible={this.props.serviceAuthenticationStatus === QUERIES_STATUS.LOADING}
                        transparent={true}
                        onRequestClose={() => this.changeModalVisibility(false)}
                        animationType="slide"
                    >
                        <View style={{ backgroundColor: '#00000060', flex: 1, justifyContent: 'center' }}>
                            <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 5, marginHorizontal: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                <Spinner
                                    color='#653F90'
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
                <Modal
                    visible={this.state.isModalVisible}
                    transparent={true}
                    onRequestClose={() => this.changeModalVisibility(false)}
                    animationType="slide"
                >
                    <IgressEmailModal
                        modalIngresoText={modalIngresoText}
                        userName={userName}
                        changeModalVisibility={this.changeModalVisibility}
                    />
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        marginHorizontal: 25,
    },
    loadingContainer: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    registerTitle: {
        color: '#653F90',
        fontSize: wp(9.8),
        fontFamily: 'ProximaNova-Black',
        alignSelf: 'center',
    },
    registerForm: {
        marginBottom: 5,
    },
    textAlertBox: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#ff676a',
        borderRadius: 5,
        opacity: 0,
    },
    textAlertBoxView: {
        opacity: 1
    },
    textAlertTitle: {
        fontFamily: 'ProximaNova-Semibold',
        color: '#fff',
        fontSize: 14,
    },
    textAlertText: {
        fontFamily: 'ProximaNova-Regular',
        color: '#fff',
        fontSize: 9,
    },
    alertIcon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
    inputBox: {
        marginVertical: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f4f5f933',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    inputActive: {
        borderWidth: 1,
        borderColor: '#653F90',
    },
    inputEmptyAlert: {
        backgroundColor: 'rgba(255,103,106,.08)',
        borderColor: '#ff676a',
        color: '#ff676a'
    },
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    showHidePass: {
        alignSelf: 'center',
    },
    checkBoxsForm: {
        marginBottom: 0,
        marginLeft: 15
    },
    checkBoxTitle: {
        fontFamily: 'ProximaNova-Semibold',
        color: '#653F90',
        fontSize: 16,
    },
    checkBoxs: {
        marginVertical: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'green'
    },
    checkBoxPet: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxText: {
        fontFamily: 'ProximaNova-Semibold',
        color: '#653F90',
        fontSize: 14,
        alignSelf: 'center',
    },
    strengthBar: {
        width: '50%',
        alignItems: 'flex-end',
        backgroundColor: 'red'
    },
    defaultBtn: {
        marginVertical: 10,
        paddingVertical: 15,
        backgroundColor: '#653f90',
        borderRadius: 5,
        elevation: 3,
    },
    buttonText: {
        fontFamily: 'ProximaNova-Regular',
        color: '#fff',
        fontSize: 22,
        alignSelf: 'center',
    },
    singInEmail: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    singInEmailText: {
        paddingHorizontal: 3,
        fontFamily: 'ProximaNova-Regular',
        color: '#653f90',
        fontSize: 16,
    },
    singInEmailTextLink: {
        fontFamily: 'ProximaNova-Semibold',
    },
    boderLineBox: {
        width: '100%',
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    boderLine: {
        height: 1,
        backgroundColor: '#653F90',
        flex: 1
    },
    boderLineText: {
        padding: 5,
        fontFamily: 'ProximaNova-Semibold',
        color: '#653f90',
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    singInSocial: {
        marginVertical: 5,
    },
    singInSocialButton: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    singInSocialText: {
        marginRight: 15,
        marginVertical: 3,
        fontFamily: 'ProximaNova-Regular',
        color: '#222d39',
        fontSize: 22,
    },
    singInSocialFacebook: {
        color: '#3c5a9a',
    },
    singInSocialIconFacebook: {
        width: 13,
        height: 28,
        alignSelf: 'center',
    },
    singInSocialIconGoogle: {
        width: 20,
        height: 20,
        alignSelf: 'center',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    }
})

const mapStateToProps = (state) => {
    return ({
        checkEmailStatus: state.Authentication.checkEmail.status,
        checkEmailErrors: state.Authentication.checkEmail.errors,
        serviceAuthenticationStatus: state.Authentication.serviceAuthentication.status,
        serviceAuthenticationErrors: state.Authentication.serviceAuthentication.errors,
        serviceAuthenticationFormData: state.Authentication.serviceAuthentication.userData,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        registerUser: (userData) => {
            dispatch(registerUser(userData))
        },
        resetCheck: () => {
            dispatch(resetEmailValidator())
        },
        loginWithFacebook: () => {
            dispatch(facebookAuthentication())
        },
        loginWithGoogle: () => {
            dispatch(googleAuthentication())
        },
        serviceAuthenticationReset: () => {
            dispatch(serviceAuthenticationReset())
        },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
