import React from 'react'
import { StyleSheet } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const MapInput = ({
    defaultValue = '',
    isoCountryCode = null,
    onPress = () => { },
    onFocus = () => { },
    ...props
}) => {
    return (
        <GooglePlacesAutocomplete
            placeholder={''}
            fetchDetails={true}
            returnKeyType={'search'}
            getDefaultValue={() =>
                `${defaultValue}`
            }
            onPress={(data, details = null) => {
                onPress(data.description, details.geometry.location)
            }}
            textInputProps={{
                onFocus
            }}
            query={{
                key: 'AIzaSyDuD-3eGh7vNWJyU04aT7h9wJqZb38QBqc',
                language: 'es',
                components: isoCountryCode ? `country:${isoCountryCode}` : '',
            }}
            placeholderTextColor={'#653F90'}
            styles={styles}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    listView: {
        backgroundColor: 'white',
    },
    description: {
        color: '#653F90', //Description List Tex Color
    },
    container: {
        backgroundColor: 'white',
        marginBottom: 20
    },
    textInputContainer: {
        borderRadius: 5,
        backgroundColor: '#F4F5F9',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    textInput: {
        color: '#653F90', //text Color
        fontSize: 16,
        backgroundColor: '#F4F5F9',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 20,
        marginLeft: 0,
        marginRight: 0
    },
})

export default MapInput
