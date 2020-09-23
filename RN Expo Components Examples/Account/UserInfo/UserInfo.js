import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import UserAvatar from '../../Commons/UserAvatar/UserAvatar'
import PetsPanel from '../PetsPanel/PetsPanel'
import { connect } from 'react-redux';

const UserInfo = (props) => {
    const {user} = props;
    useEffect(() => {
        console.log('mounting component')
    }, [])

    return (
        <View style={styles.root}>
            <UserAvatar editButton={true} imageSource={require("../../../../assets/user.png")} style={styles.avatar}/>
            <Text style={styles.name}>{user.fullname}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <PetsPanel/>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFF',
        width: '85%',
        marginHorizontal: '7.5%',
        marginTop: 140,
        paddingTop: 65,
        alignItems: 'center',
        borderRadius: 5,
        elevation: 1
    },
    avatar: {
        position: 'absolute',
        top: -70
    },
    name: {
        textAlign: "center",
        color: '#653F90',
        fontSize: 30,
        fontWeight: 'bold'
    },
    email:{
        fontSize: 20,
        color: "#653F90"
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
