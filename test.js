var realtime = require('rtd-realtime');

realtime.VehiclePositions.write( (err,feed) => {
    // 'err' will be supplied if an error occured in the request or decoding of the feed,
    // otherwise 'err' will be null
    // 'feed' will be supplied as decode json representation of a GTFS-RT feed
    // A JSON file of the feed will be written to your file system
});