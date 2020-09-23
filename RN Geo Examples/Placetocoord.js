class Placetocoord{
    async placetocoords(place_id){
        console.log("convertir place_id a coordenadas")
        let result = await fetch("https://maps.googleapis.com/maps/api/geocode/json?key=API_KEY&place_id="+place_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()).then((res) => {
            return res;
        })
        return result;
    }

}

export default new Placetocoord()
