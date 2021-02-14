export async function fetchApi (url, method, values) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                `/api/${url}`,
                {
                    method: method.toUpperCase(),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: method === 'get' ? undefined : JSON.stringify(values)
                });
            if (response.status === 500) return reject('Server Unavailable');
            const apiResponse = await response.json();
            if (!apiResponse.success) {
                if (apiResponse.err === 'no-user') return reject('no-user');
                reject(apiResponse.err);
            }
            resolve(apiResponse.result);
        } catch (err) {
            if (err.message === 'Failed to fetch') return reject("You're offline");
            reject(err);
        }
    })
}
