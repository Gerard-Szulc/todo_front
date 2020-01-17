export default (address, method = 'GET', body, contentType = 'application/json') => {

    let headers = new Headers({
    });

    const initObject = {
        method: method.toUpperCase(),
        headers,
        body: body,
        mode: 'cors',
        cache: 'default'
    };

    let myRequest = new Request(`${process.env.REACT_APP_BACKEND_URL}${address}`, initObject);

    return new Promise( async (resolve, reject) => {
        try {
            let response = await fetch(myRequest)
            resolve(await response.json())
        } catch (e) {
            reject(e)
        }
    })
}
