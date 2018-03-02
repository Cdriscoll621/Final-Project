// Requiring our models
var db = require("../models");
var bcrypt = require ("bcrypt");

var authController = require('../controllers/authcontroller.js');

module.exports = (app, passport)=>{
	app.get('/', (req, res)=>{
		res.render('index.ejs');
	});

	app.post('/login', (req, res)=>{
        db.user.findOne({where: {user_login : req.body.user_login}
        }).then((user)=>{
            bcrypt.compare(req.body.user_passwd, user.user_passwd, (err, loginSuccess)=>{
               if (loginSuccess){ 
                   res.json({status: "success"})
                }
                else{
                    res.json({status: "failure"})
                }
        
            })
        });
        
    });
	
    
    app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.post('/signup', (req, res)=>{
		
        const {user_login, user_passwd} = req.body;
        console.log(req.body);
        bcrypt.hash(user_passwd, 10, (err, hash)=>{
            console.log(hash);
            db.user.create({user_login: user_login, user_passwd: hash})
            .then(newUser => {
                res.json(newUser);
            })   
        })  
    });


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, (req, res)=>{
		res.render('profile.ejs', { user: req.user });
	});



	app.get('/:username/:password', (req, res)=>{
		var newUser = new User();
		newUser.local.username = req.params.username;
		newUser.local.password = req.params.password;
		console.log(newUser.local.username + " " + newUser.local.password);
		newUser.save((err)=>{
			if(err)
				throw err;
		});
		res.send("Success!");
	});

	app.get('/logout', (req, res)=>{
		req.logout();
		res.redirect('/');
	})
};

 const isLoggedIn = (req, res, next)=> {
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect('/login');
} 