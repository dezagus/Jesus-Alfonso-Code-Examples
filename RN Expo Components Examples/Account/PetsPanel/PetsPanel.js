import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import PetThumbnail from '../PetThumbnail/PetThumbnail'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { getUserPets } from '../../../../Store/actions/UserPetActions'
import { QUERIES_STATUS } from '../../../../Store/types'
import { Spinner } from 'native-base'

const PetsPanel = ({pets, getUserPets, loadStatus}) => {

    useEffect(()=>{
        getUserPets();
    },[])

    
    // console.log(pets, 'estas son mis mascotas')
    return (
        <View style={styles.root}>
            {
                loadStatus !== QUERIES_STATUS.LOADING && <React.Fragment>
                {pets.length > 0 && <Text style={styles.title}>Mascotas</Text>}
                <ScrollView style={styles.thumbnailWrapper} horizontal showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {pets.map((pet, index)=>{
                        return <PetThumbnail 
                            key={index}
                            imageSource={pet.image_url ? {uri: `${pet.image_url}`} : pet.pet_id === 2 ? require('../../../../assets/gatito.png') : require('../../../../assets/perrito2.png')}
                            name={pet.name}
                        />
                    })}
                </ScrollView>
                </React.Fragment>
            }
            {
                loadStatus === QUERIES_STATUS.LOADING &&
                <Spinner
                    color='#653F90'
                    size={20}
                    style={{alignSelf: 'center', flex: 1}}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        paddingHorizontal: "10%",
        paddingVertical: 15,
        alignItems: 'stretch',
    },
    title: {
        fontSize: 18,
        color: "#653F90"
    },
    thumbnailWrapper: {
        paddingTop: 15,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        minWidth: '100%'
    }
})

const mapStateToProps = (state) => {
    return ({
        pets: state.UserPet.userPets,
        loadStatus: state.UserPet.getUserPets.status
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        getUserPets: () => {
            dispatch(getUserPets())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(PetsPanel)
