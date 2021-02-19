export async function fetchApi (url, method, values) {
    return new Promise(async (resolve, reject) => {
        try {
            const prod = "https://material-tournaments.herokuapp.com/";
            const dev = "/api/";
            const apiUrl = process.env.NODE_ENV === 'production' ? prod : dev;
            const response = await fetch(
                `${apiUrl}${url}`,
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
export function basicFetch (url, method, values, loadingFunction, reloadOnSuccess, alertOnFailure, onSuccess, onFailure) {
    loadingFunction(true);
    setTimeout(async () => {
        try {
            await fetchApi(url, method, values);
            if (reloadOnSuccess) {
                window.location.reload();
            }
            if (onSuccess) {
                onSuccess();
            }
        } catch (e) {
            if (onFailure) {
                onFailure();
            }
            if (alertOnFailure) {
                alert(e);
            }
        } finally {
            loadingFunction(false);
        }
    }, 1000)
}