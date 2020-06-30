var data = [{type: 'densitymapbox', lon: [10, 20, 30], lat: [15, 25, 35], z: [1, 3, 2]}];

var layout = {width: 600, height: 400, mapbox: {style: 'stamen-terrain'}};

Plotly.newPlot('myDiv', data, layout);