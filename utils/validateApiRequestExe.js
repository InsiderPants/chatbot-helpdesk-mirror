const jwtStrategy	= require('passport-jwt').Strategy,
	  extractJWT	= require('passport-jwt').ExtractJwt,
	  mongoose 		= require('mongoose'),
	  Executive     = require('../models/executiveDB'),
	  {jwtCode}		= require('../config/keys');

const options ={};
options.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtCode;

module.exports = (passport) =>{
	passport.use(new jwtStrategy(options,(jwt_payload,done)=>{
		Executive.findOne({'email': jwt_payload.email})
			.then(executive => {
				if(executive){
					console.log('valid')
					return done(null,executive);
				}else{
					return done(null,false);
				}
			})
			.catch(err => console.log(err));
	}));
};