exports.home = function(req, res, next){

    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.getLocations()
        })
        .then(function(locations){
            res.render('locations', { locations : locations });
        });
};



exports.add = function(req, res, next){
    var data = req.body;

    var location = {
        description : data.description,
        latitude : data.latitude,
        longitude : data.longitude
    };

    req.getServices('dataService')
        .then(function(services){
            var dataService = services.dataService;
            return dataService.addLocation(location)
        })
        .then(function(){
            res.redirect("/")
        });
};

exports.delete = function(req, res, next){
    var data = req.body;
    var locationId = req.params.locationId;

    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.deleteLocation(locationId)
        })
        .then(function(){
            res.redirect("/")
        });
};

exports.showAdd = function(req, res, next){
    res.render('location');
};
