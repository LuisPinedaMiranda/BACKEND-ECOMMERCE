var Usuario = require('../models/usuario');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_usuario_admin = async function (req, res) {
  console.log(req.user);

  if (req.user) {
    let data = req.body;

    let usuarios = await Usuario.find({ email: data.email });

    if (usuarios.length >= 1) {
      res.status(200).send({ data: undefined, message: "El correo ya existe" });
    } else {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (err) {
          res.status(403).send({data: undefined,message: "No se pudo encriptar la contraseña"});
        } else {
          data.password = hash;
          let usuario = await Usuario.create(data);
          res.status(200).send({ data: usuario });
        }
      });
    }
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

//Método Login
const login_usuario = async function(req, res){
    var data = req.body;

    // Es un arreglo de usuarios aunque solo trae un registro
    var usuarios = await Usuario.find({email: data.email});

    if(usuarios.length >= 1){
        //CORREO EXISTE
        bcrypt.compare(data.password, usuarios[0].password, async function(err,check){
           
            if(check){
                res.status(200).send({
                    token:jwt.createToken(usuarios[0]), 
                    usuario:usuarios[0]});
            }else{
                res.status(200).send({data:undefined, message:'La contraseña es incorrecta'})
            }
        })

    }else{
        res.status(200).send({data:undefined, message:'No se encontró el correo electrónico'});
    }
    
}

module.exports = {
    registro_usuario_admin,
    login_usuario
}