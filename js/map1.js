mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 3.8,
    center: [-100, 39],
    projection: 'albers'
});

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.json');
    let covidData = await response.json();
    map.on('load', function loadingData() {
        map.addSource('covidData', {
            type: 'geojson',
            data: covidData
        });

        map.addLayer({
            'id': 'covidData-layer',
            'type': 'fill',
            'source': 'covidData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FED976',
                    20,
                    '#FD8D3C',
                    50,
                    '#FEB24C',
                    70,
                    '#E31A1C',
                    100,
                    '#BD0026'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });   

    const layers = [
        '0-19',
        '20-49',
        '50-69',
        '70-99',
        '100 and more',
    ];
    const colors = [
        '#FED97670',
        '#FD8D3C70',
        '#FC4E2A70',
        '#BD002670',
        '#80002670'
    ];

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid-19 Rate<br><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({point}) => {
        const covidRate = map.queryRenderedFeatures(point, {
            layers: ['covidData-layer']
        });
        document.getElementById('text-description').innerHTML = covidRate.length ?
            `<h3>Rate: ${covidRate[0].properties.rates}</h3> <p>${covidRate[0].properties.county}, ${covidRate[0].properties.state}</p>` :
            `<p>Hover over a county!</p><p>Source: <a href="https://data.census.gov/table/ACSDP5Y2018.DP05?g=0100000US$050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&hidePreview=true">US Census</a></p>`;
    });  
}
geojsonFetch();