import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import UserInfo from './UserInfo/UserInfo';
import BackButton from '../Commons/BackButton/BackButton'
import ButtonGroup from '../Commons/ButtonGroup/ButtonGroup';
import { loadUserAddresses } from '../../../Store/actions/AddressActions';
import { useDispatch } from 'react-redux';
import { getPhones } from '../../../Store/actions/PhoneActions';

const buttons = []

const Account = (props) => {
    const dispatch = useDispatch();
    return (
        <ScrollView style={styles.container}>
            <BackButton />
            <UserInfo />
            <View style={{ paddingVertical: 10 }}>
                <ButtonGroup
                    texts={["Configurar mi cuenta", "Historial de pedidos"]}
                    icons={["all-order", "pending-shipments"]}
                    actions={[
                        () => { props.navigation.navigate('AccountSettings') },
                        () => { props.navigation.navigate('PurchaseHistory') }
                    ]}
                />
                <ButtonGroup
                    texts={["Referir amigos", "Membresía", "Agregar nueva mascota"]}
                    icons={["invite", "noun_id-badge_2986233", "grupo-5589"]}
                    actions={[
                        () => { props.navigation.navigate('Referals') },
                        () => { props.navigation.navigate('LaikaMember') },
                        () => { props.navigation.navigate('AddPets') }
                    ]}
                />
                <ButtonGroup
                    texts={["Mis direcciones", "Mis Tarjetas", "Mis teléfonos", "LaikaCoins"]}
                    icons={["shipping", "payment", "noun_phone_3063219", "noun_phone_3063219", "noun_phone_3063219"]}
                    actions={[
                        () => { dispatch(loadUserAddresses()); props.navigation.navigate('MisDirecciones')},
                        () => { props.navigation.navigate('PaymentMethods') },
                        () => { dispatch(getPhones()); props.navigation.navigate('PhoneNumbers') },
                        () => { props.navigation.navigate('LaikaCoins') }
                    ]}
                />
                <ButtonGroup
                    texts={["Notificaciones y Seguimientos", "Soporte", "Políticas de privacidad"]}
                    icons={["bell", "support", "shield"]}
                    actions={[
                        () => { props.navigation.navigate('Notifications') },
                        () => { props.navigation.navigate('Support') },
                        () => { props.navigation.navigate('Privacy') }
                    ]}
                />
            </View>
        </ScrollView>
    );
}

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        backgroundColor: '#FBFBFB',
        width: '100%',
    }
})