var geolib = require('geolib'),
    Promise = require('bluebird');

var handleError = function(res){
    return function(err){
        res.send({
            status : "failed",
            err : err.message,
            stacktrace : err.stack
        })
    };
};

exports.locations = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            //console.log('locations');
            return dataService.getLocations()
        })
        .then(function(locations){
            console.log(locations);
            res.send(locations);
        }).catch(handleError(res));
};

exports.distance_from = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.isIn([req.params.from, req.params.to])
        })
        .then(function(locations){

            var from = locations[0];
            var to = locations[1];

            var distance = geolib.getDistance(
                {latitude: Number(from.latitude), longitude: Number(from.longitude)},
                {latitude: Number(to.latitude), longitude: Number(to.longitude)}
            );

            res.send({
                from : from.description,
                to : to.description,
                distance : distance
            });
        }).catch(handleError(res));;
};

exports.get_all = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.isIn(JSON.parse(req.params.id));
        })
        .then(function(locations){

            var locations = locations.map(function(location){
                return {
                    lat : Number(location.latitude),
                    lng : Number(location.longitude)
                };
            });

            res.send({
                location : locations[0]
            });
        }).catch(handleError(res));;
};


exports.center = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.getLocations()
        })
        .then(function(locations){
            var center = geolib.getCenter(locations);
            res.send({center : center});
        }).catch(handleError(res));;
};


exports.distance = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.isIn([req.params.from, req.params.to]);
        })
        .then(function(locations){

            var from = locations[0];
            var to = locations[1];
            var distance = req.params.distance;

            var inCircle = geolib.isPointInCircle(
                {latitude: Number(from.latitude), longitude: Number(from.longitude)},
                {latitude: Number(to.latitude), longitude: Number(to.longitude)},
                distance
            );

            res.send({
                from : from.description,
                to : to.description,
                distance : distance,
                inCircle : inCircle
            });
        }).catch(handleError(res));;
};

exports.nearest = function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return Promise.join(dataService.isIn([req.params.from]), dataService.notIn([req.params.from]));
        })
        .then(function(results){

            var fromList = results[0];
            var locations = results[1];

            var from = fromList[0];
            var distance = req.params.distance;

            var locationsMap = {};
            locations.forEach(function(loc){
                locationsMap[loc.description] = {latitude : loc.latitude, longitude : loc.longitude};
            });

            var nearest = geolib.findNearest(
                from,
                locationsMap
            );

            nearest.nearest_to = from;

            res.send(nearest);
        }).catch(handleError(res));  ;
};
