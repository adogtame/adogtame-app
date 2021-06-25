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
        // CRUD
        this.router.get('/list', userController_1.default.list);
        this.router.get('/listAnimals', userController_1.default.listAnimals);
        this.router.get('/listAnimalsUser/:id', userController_1.default.listAnimalsUser);
        this.router.get('/find/:id', userController_1.default.find);
        this.router.get('/findAnimal/:id', userController_1.default.findAnimal);
        this.router.post('/add', userController_1.default.addUser);
        this.router.put('/update/:id', userController_1.default.update);
        this.router.delete('/delete/:id', userController_1.default.delete);
        //
        this.router.post('/dToken', userController_1.default.dToken);
        // FIN DEL CRUD
        //Cesar Jueves
        this.router.post('/comentario', userController_1.default.addComentario);
        this.router.get('/listComentarios/:id', userController_1.default.listComentarios);
        this.router.get('/listUsuariosLikes/:id', userController_1.default.listUsuariosLikes);
        this.router.put('/updateLikeDislikeComentario/:idComentario', userController_1.default.updateLikeDislikeComentario);
        this.router.get('/findUserWithMail/:mail', userController_1.default.findUserWithMail);
    }
}
//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
//# sourceMappingURL=userRoutes.js.map