define(() => {
    const util = {
        async post(url, data) {
            let d = await fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });

            return await d.json();
        }
    };

    return util;
});