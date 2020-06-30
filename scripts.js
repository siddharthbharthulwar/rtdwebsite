var realtime = require('rtd-realtime');
const { type } = require('os');
const { MAX_VARINT32_BYTES } = require('bytebuffer');
const { builtinModules } = require('module');

class Position {
    constructor(latitude, longitude, bearing) {

        this.latitude = latitude;
        this.longitude = longitude;
        this.bearing = bearing;

    }
}

class BusInstance {
    constructor(trip_id, route_id, direction_id, Position) {

        this.trip_id = trip_id.toString();
        this.route_id = route_id.toString();
        this.direction_id = direction_id.toString();
        this.Position = Position;
        this.identifier = this.route_id.concat(this.direction_id);

    }
}

class BunchingInstance {

    constructor(identifier, Position1, Position2) {

        this.identifier = identifier;
        this.position1 = Position1;
        this.position2 = Position2;
        this.midLat = midpoint(Position1, Position2)[0];
        this.midLon = midpoint(Position1, Position2)[1];

    }

}

function midpoint(Position1, Position2) {

    var temp = [(Position1.latitude + Position2.latitude) / 2, (Position1.longitude + Position2.longitude)  / 2];
    return temp;
}

const haversine = ([lat1, lon1], [lat2, lon2]) => {
    // Math lib function names
    const [pi, asin, sin, cos, sqrt, pow, round] = [
        'PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round'
    ]
    .map(k => Math[k]),

        // degrees as radians
        [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
        .map(x => x / 180 * pi),

        dLat = rlat2 - rlat1,
        dLon = rlon2 - rlon1,
        radius = 20902000; // feet

    // feet
    return round(
        radius * 2 * asin(
            sqrt(
                pow(sin(dLat / 2), 2) +
                pow(sin(dLon / 2), 2) *
                cos(rlat1) * cos(rlat2)
            )
        ) * 100
    ) / 100;
};


function checkMap(map) {

    var bunchinginstances = new Map();

    for (let [k, v] of map) {

        var buses = v;
        for (var i = 0; i < buses.length; i++){

            for (var j = 0; j < buses.length; j++){

                if (i != j && buses[i].identifier == buses[j].identifier){

                    var busOne = buses[i];
                    var busTwo = buses[j];
                    
                    var distance = haversine([busOne.Position.latitude, busOne.Position.longitude], [busTwo.Position.latitude, busTwo.Position.longitude]);
                    if (distance < 1000){
                        
                        var key = buses[i].identifier.concat(buses[i].Position.bearing.toString());
                        key.concat(buses[j].Position.bearing.toString());
                        console.log(typeof key);
                        bunchinginstances.set(key, new BunchingInstance(buses[i].identifier, buses[i].Position, buses[j].Position));

                    }
                }
            }
        }

    }

    console.log(bunchinginstances);
}

realtime.VehiclePositions.load( (err,feed) => {
    // 'err' will be supplied if an error occured in the request or decoding of the feed,
    // otherwise 'err' will be null
    // 'feed' will be supplied as decode json representation of a GTFS-RT feed
    var entity = feed['entity'];
    let busmap = new Map();

    for (var i = 0; i < entity.length; i++){

        var obj = entity[i];

        if ( typeof obj.vehicle.trip !== 'undefined' && obj.vehicle.trip ){

            var bus = new BusInstance(obj.vehicle.trip.trip_id, obj.vehicle.trip.route_id, obj.vehicle.trip.direction_id, new Position(obj.vehicle.position.latitude, obj.vehicle.position.longitude, obj.vehicle.position.bearing));
            var key = obj.vehicle.trip.route_id.concat(obj.vehicle.trip.direction_id);
            
            if (busmap.has(key)){
                
                var temp = busmap.get(key);
                temp.push(bus);
                busmap.set(key, temp);
            }
            else{

                var temp = new Array()
                temp.push(bus);
                busmap.set(key, temp);
            }

        }

    }

    checkMap(busmap);

});