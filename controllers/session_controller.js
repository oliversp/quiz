// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

	console.log('exports.create');
        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
        }

		
        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username,timeout: new Date().getTime()};
		
		console.log('Athentication.....redirecciona **************');
        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion 
exports.destroy = function(req, res) {
	
    delete req.session.user;
	delete req.session.timeout;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};

exports.SessionTimeOut =function (req, res, next) {

 var  _actual = new Date();

if (req.session.user){
	
	if (_actual.getTime() - req.session.user.timeout > 10000){
		   delete req.session.user;
		   delete req.session.timeout;
		   res.render('sessions/expired', {errors: [{"message": 'SessionTimeOut. Ha supuerado los dos minutos de inactividad.'}]} );
    }
	 else{
		 req.session.user.timeout=new Date().getTime();
		 console.log('CheckTime session.usuario registrado ...' +  req.session.user.timeout);
		 next();
    	 }	
}		 
else
	next();
 
}