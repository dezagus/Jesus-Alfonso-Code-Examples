import React from 'react'
import { View, Text, Image, ImageBackground } from 'react-native'
import { StyleSheet } from 'react-native'

const PetAvatar = ({imageSource, style, name}) => {
    return (
        <View style={{height: "auto", maxWidth: 575*0.15, borderTopLeftRadius: 110, borderTopRightRadius: 110, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginVertica: 5, paddingHorizontal: 130*0.15, ...style}}>
            <View style={{backgroundColor: 'transparent', position: 'relative', height: 458*0.15, justifyContent: 'center', alignItems: 'center'}}>
                <Image style={[styles.petImg, {backgroundColor: 'pink'}]} source={imageSource}/>
                <Image style={{position: 'absolute', height: 458*0.15, width: 541*0.15, alignSelf: 'center', top: 0, backgroundColor: 'transparent', transform: [{translateX: -30*0.1}]}} source={require('../../../../assets/adornoPet.png')}/>
            </View>
            <Text numberOfLines={1} style={{color: "#653F90", textTransform: 'capitalize', fontSize: 15, marginTop: 2}}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    petImg: {
        width: 350*0.15,
        height: 350*0.15,
        alignSelf: 'center',
        backgroundColor: 'pink',
        borderWidth: 1,
        borderColor: 'rgb(204,159,255)',
        borderRadius: 150,
    }
})

export default PetAvatar
