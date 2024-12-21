var jwt = require ('jwt-simple');
var moment = require('moment'); 
var secret = "diego";

 exports.decodeToken = function(req, res, next){
    //console.log(req.headers);

    if(!req.headers.authorization){
        return res.status(403).send({message:'NoHeadersError'});
    }

    //var token = req.headers.authorization;
    token = req.headers.authorization.replace("Bearer ", "").trim(); //Se le aplicó el .trim() para quitarle el Bearer si no no se reconoce el JWT
    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({message:'InvalidToken'});
    }else{
        try{
            var payload = jwt.decode(token, secret);
            console.log(payload);
        } catch(error){
            console.error('Token error:', error.message);  // Imprime el error exacto
            return res.status(403).send({ message: 'Error Token', error: error.message });
        }
    }

    //Ahora el campo usuario va a tener la payload decodificada desde el token
    req.user = payload;
    next();
 }