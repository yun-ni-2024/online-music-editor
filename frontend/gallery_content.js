let config;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        console.log('Load config: ', data);
    })
    .catch(error => console.error('Error loading configuration:', error));
