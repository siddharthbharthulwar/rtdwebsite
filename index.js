var realtime = require('rtd-realtime');

function Position(latitude, longitude, bearing) {

    this.latitude = latitude;
    this.longitude = longitude;
    this.bearing = bearing;

}

function BusInstance(trip_id, route_id, direction_id, Position){

    this.trip_id = trip_id;
    this.route_id = route_id;
    this.direction_id = direction_id;
    this.Position = Position;

}

realtime.VehiclePositions.load( (err,feed) => {
    // 'err' will be supplied if an error occured in the request or decoding of the feed,
    // otherwise 'err' will be null
    // 'feed' will be supplied as decode json representation of a GTFS-RT feed
    var entity = feed['entity'];
    var instances = [];

    for (var i = 0; i < entity.length; i++){

        var obj = entity[i];

        if ( typeof obj.vehicle.trip !== 'undefined' && obj.vehicle.trip ){

            console.log(i);
            console.log(obj);
    
            var pos = Position(obj.vehicle.trip.latitude, obj.vehicle.trip.longitude, obj.vehicle.trip.bearing);
            var bus = BusInstance(obj.vehicle.trip.trip_id, obj.vehicle.trip.route_id, obj.vehicle.trip.direction_id, pos);
            instances.push(bus);

        }

    }

    console.log(instances);
});