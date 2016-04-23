var Promise = require('bluebird');

module.exports = function(connection){

    var query = function(query, data){
        return new Promise(function(resolve, reject){
            data = data || [];
            connection.query(query, data, function(err, results){
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    var addLocation = function(location){
        location.time = Date.now();
        return query("insert into locations set ?", location);
    };

    var getLocations = function(location){
        return query("select id, description, latitude, longitude from locations");
    };

    var deleteLocation = function(locationId){
        return query("delete from locations where id = ?", [Number(locationId)]);
    };

    var isIn = function(ids){
        console.log(ids);
        return query("select * from locations where id in (?)", [ids])
    };

    var notIn = function(ids){
        return query("select * from locations where id not in (?)", [ids])
    };

    return {
        addLocation : addLocation,
        getLocations : getLocations,
        deleteLocation : deleteLocation,
        isIn : isIn,
        notIn : notIn
    };

}
