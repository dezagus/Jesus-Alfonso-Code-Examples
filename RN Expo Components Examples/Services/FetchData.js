export function PostData(endPoint, query, method, headers) {

    let baseURL = 'https://apiv2.laika.com.co/';

    return new Promise((resolve, reject) => {
        // fetch(baseURL + endPoint, {
        //     method: method,
        //     body: JSON.stringify(postData),
        //     headers: headers
        // })
        //     .then((response) => response.json())

        //     .then((responseJson) => {
        //         resolve(responseJson)
        //     })
        //     .catch((error) => {
        //         reject(error)
        //     })
        fetch(baseURL + endPoint, {
            method: method,
            body: JSON.stringify({query}),
            headers: headers
            }).then(res => {
                return res.json()
            })
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch(error => console.error('Error:', error))
            .then((response) => {
                // console.log('Success:', response);
                // reject(error)
            });
    })
}

export function GetData(endPoint, query, method, headers) {
    let baseURL = 'https://apiv2.laika.com.co/'
    // let headers = {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    // }
    return new Promise((resolve, reject) => {
        fetch(baseURL + endPoint, {
            method: method,
            body: JSON.stringify({query}),
            headers: headers
            }).then(res => {
                return res.json()
            })
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch((error) => {
                reject(error)
            })
    });
}