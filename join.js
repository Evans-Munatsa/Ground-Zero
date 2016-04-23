
exports.watch = function(req, res){
    var locationWatch = req.params.watch_location;

    var services = req.getServices();



    res.render('watch_added');

};

exports.home = function(req, res, next){
    res.render('join');
};
