define(() => {
    const util = {
        async post(url, data) {
            return fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            })
        }
    };

    return util;
});