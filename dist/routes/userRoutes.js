"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            res.send('Main!!!');
            //res.render("partials/principal");
        });
        // Login
        this.router.get('/signin', userController_1.default.signin);
        this.router.post('/signin', userController_1.default.login);
        // Registro
        this.router.get('/signup', userController_1.default.signup);
        this.router.post('/signup', userController_1.default.addUser);
        this.router.get('/signupAnimal', userController_1.default.signupAnimal);
        this.router.post('/signupAnimal', userController_1.default.addAnimal);
        // Home del usuario
        this.router.get('/home', userController_1.default.home);
        this.router.get('/control', userController_1.default.control);
        this.router.post('/procesar', userController_1.default.procesar);
        this.router.get('/salir', userController_1.default.endSession);
        this.router.get('/error', userController_1.default.showError);
        this.router.get('/delete/:id', userController_1.default.delete);
        this.router.get('/adoptados', userController_1.default.adoptados);
        this.router.get('/solicitudesEnviadas', userController_1.default.solicitudesEnviadas);
        this.router.get('/solicitudesRecibidas', userController_1.default.solicitudesRecibidas);
        //Notificaciones
        //Buscar los id de animal de los animales del usuario logueado y interesados de ese animal
        this.router.get('/notificacionesListarInteresadosDeAnimalNoVistos/:id', userController_1.default.notificacionesListarInteresadosDeAnimalNoVistos);
        //
        //Interes
        this.router.post('/mostrarInteres/:idAnimal', userController_1.default.mostrarInteres);
        this.router.post('/quitarInteres/:idAnimal', userController_1.default.quitarInteres);
        this.router.post('/cargarInteres/:idAnimal', userController_1.default.cargarInteres);
        this.router.get('/cargarInteresados/:idAnimal', userController_1.default.cargarInteresados);
        //
        this.router.get('/siguiendoAnimales/:idUsuario', userController_1.default.siguiendoAnimales);
        //   
        //Adopcion animal        
        this.router.post('/comenzarAdopcion', userController_1.default.comenzarAdopcion);
        this.router.post('/confirmarAdopcion/:idAnimal', userController_1.default.confirmarAdopcion);
        this.router.get('/estadoAnimal/:idAnimal', userController_1.default.estadoAnimal);
        this.router.delete('/cancelarProcesoAdopcion/:idAnimal', userController_1.default.cancelarProcesoAdopcion);
        //
        //Confirmacion de registro via nodemailer
        this.router.get('/confirmar/:token', userController_1.default.confirmarRegistro);
        // 
        this.router.get('/list', userController_1.default.list);
        this.router.get('/listAnimals', userController_1.default.listAnimals);
        this.router.get('/listarAnimalesAdoptados', userController_1.default.listarAnimalesAdoptados);
        this.router.post('/listAnimalsFiltrado', userController_1.default.listAnimalsFiltrado);
        this.router.get('/listAnimalsUser/:id', userController_1.default.listAnimalsUser);
        this.router.get('/find/:id', userController_1.default.find);
        this.router.get('/findAnimal/:id', userController_1.default.findAnimal);
        this.router.post('/add', userController_1.default.addUser);
        this.router.put('/update/:id', userController_1.default.update);
        this.router.delete('/delete/:id', userController_1.default.delete);
        //
        this.router.post('/dToken', userController_1.default.dToken);
        // FIN DEL CRUD
        this.router.get('/findUserWithMail/:mail', userController_1.default.findUserWithMail);
        //APARTADO ADMIN
        //Para no crear otro objeto q sea admin lo metemos en user
        //Esto del comentario falta borrar
        //this.router.delete('/deleteComentario/:id',userController.deleteComentario);	
        //
    }
}
//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
//# sourceMappingURL=userRoutes.js.map