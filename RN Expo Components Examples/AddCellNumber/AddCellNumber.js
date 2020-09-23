import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Picker, FlatList, TouchableOpacity } from 'react-native';
import { PostData, GetData } from '../Services/FetchData';
import { connect } from 'react-redux';
import { getTerms } from '../../../Store/actions/AuthenticationActions';

class AddCellNumber extends Component {
    constructor(){
        super();
        this.state={
            countryCode: undefined,
            phoneNumber: '',
            flag: undefined
        }
    }
    loadCountries () {
        let method = 'POST'
        let headers = {
            'Content-Type': 'application/json',
            'api-key-client' : '$2y$10$DAtaTvXcuyIXd.sWT0gnLueKF0U83Cu49XxAdhQQBg0ytoTR4dd/u'
        }
        let query =`query { countries{
            avatar
            code_country
            }
        }`;
        console.log(this.state);
        // GetData('', query, method, headers).then((response) => {
        //     console.log('Success:', response)
        //     this.setState({ code_country: response.data.countries.code_country });
        // })
        // console.log(this.state.code_country);
    }
    
    componentDidMount() {
        this.props.getTerms()
    }

    onSelect = (code, flag) => {
        console.log(code, flag)
        this.setState({countryCode: code, flag: flag})
    }

    render() {
        return (
            <View style={styles.container}>
                <Image 
                    style={styles.addCellNumberImg} 
                    source={require('../../../assets/addcellnumber.png')}
                />
                <Text style={styles.addCellNumberTitle}>
                    ¡Necesitamos tu número de celular para verificar tu cuenta!
                </Text>
                <View style={{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'stretch'}}>
                    <Image 
                        style={{width: 45, height: 30, alignSelf: 'center'}} 
                        source={{uri: `${this.state.flag}`}}
                    />
                    <TouchableOpacity 
                        onPress={()=>{this.props.navigation.navigate('CountryPicker', {current: this.state.countryCode, onSelect: this.onSelect})}} 
                        style={{
                            borderRadius: 5, 
                            paddingVertical: 5, 
                            minHeight: 30,
                            minWidth: 50,
                            paddingHorizontal: 10,
                            backgroundColor: '#F4F5F9',
                            marginRight: 10,
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{fontSize: 20, fontFamily: 'ProximaNova-Black', color: '#653F90'}}>
                            {this.state.countryCode ? `+${this.state.countryCode}` : ''}
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        borderRadius: 5, 
                        paddingVertical: 5, 
                        minHeight: 30, 
                        paddingHorizontal: 10, 
                        backgroundColor: '#F4F5F9', 
                        flex:1, 
                        justifyContent: 'center'
                    }}>
                        <TextInput 
                            keyboardType={'phone-pad'} 
                            style={{fontSize: 20, color: '#A3A8B5'}} 
                            placeholderTextColor={"#7C8494"} 
                            placeholder={"Número de celular"}
                            onChangeText={(text)=>{
                                this.setState({
                                    phoneNumber: text
                                })
                            }}
                            value={this.state.phoneNumber}
                        />
                    </View>
                </View>
                <Text style={styles.addCellNumberText}>
                    Ingresa el número de celular en Laika queremos darle lo mejor a tus mascotas.
                </Text>
                <TouchableOpacity
                    disabled={this.state.phoneNumber === '' || this.state.countryCode === undefined}
                    onPress={()=>{ this.props.navigation.navigate('InsertSmsCode', {
                        formData: {
                            ...this.props.navigation.getParam('formData'),
                            code: this.state.countryCode,
                            phoneNumber: this.state.phoneNumber
                            }
                        })}} 
                    style={styles.defaultBtn}
                >
                    <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
    },
    addCellNumberImg: {
        marginBottom: 20,
        width: 884*0.33,
        height: 660*0.33,
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    addCellNumberTitle: {
        marginBottom: 20,
        fontFamily: 'ProximaNova-Black',
        color: '#653F90',
        fontSize: 22,
        textAlign: 'center',
    },
    addCellNumberData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addCellNumberFlag: {
        width: 35,
        height: 20,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    inputBox: {
        marginVertical: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#F4F5F9',
        borderRadius: 5,
    },
    addCellNumberText: {
        marginBottom: 50,
        fontFamily: 'ProximaNova-Regular',
        color: '#653F90',
        fontSize: 22,
        textAlign: 'center',
    },
    defaultBtn: {
        marginVertical: 10,
        paddingVertical: 15,
        backgroundColor: '#653f90',
        borderRadius: 5,
        elevation: 8,
    },
    buttonText: {
        fontFamily: 'ProximaNova-Regular',
        color: '#fff',
        fontSize: 22,
        alignSelf: 'center',
    }
})

const mapStateToProps = (state) => {
    return ({

    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        getTerms: () => {
            dispatch(getTerms())
        },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCellNumber)