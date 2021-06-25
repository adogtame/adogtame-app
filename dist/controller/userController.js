"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    // Login
    signin(req, res) {
        console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarEmail(email);
            console.log(email);
            console.log(password);
            console.log(result);
            if (!result) {
                return res.status(404).json({ message: "Usuario no registrado, no esta supuestamente" });
                //req.flash('error_session', 'Usuario y/o Password Incorrectos');
                //res.redirect("./signin");
            }
            //res.send({ "Usuario no registrado Recibido": req.body }); El profe dejo esta linea pero no valida si el user es incorrecto
            if (result.email == email && result.password == password) {
                const token = jsonwebtoken_1.default.sign({ _id: result.id }, "secretKey");
                console.log(result.id);
                req.session.user = result;
                req.session.auth = true;
                res.status(200).json({ message: result.id, token: token });
                //res.redirect("./home");
                return;
            }
            //res.send({ "Usuario y/o contraseña incorrectos": req.body });
            //req.flash('error_session', 'Usuario y/o Password Incorrectos');
            //res.redirect("./error");
            return res.status(403).json({ message: "Usuario y/o contraseña incorrectos" });
        });
    }
    dToken(req, res) {
        //const { token } = req.params;
        const token = req.body.token;
        console.log(token);
        // const decoded = jwtDecode<JwtPayload>(token); // Returns with the JwtPayload type
        // console.log(decoded);
        const decoded = jsonwebtoken_1.default.verify(token, "secretKey");
        var userId = decoded;
        console.log("Q onda, el usuario cual es", userId);
        console.log(decoded);
        return res.json({ user: decoded._id });
        // return res.send({
        //      user: (<any>decoded)._id
        // });
    }
    // Registro Usuario
    signup(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }
    // Registro Organizacion
    signupOrg(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupOrgForm");
    }
    // Registro Animal
    signupAnimal(req, res) {
        console.log(req.body);
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/signupAnimalForm", { mi_session: true });
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            if (!req.session.auth) {
                res.render("partials/signinForm");
            }
            res.render("partials/home", { mi_session: true });
        });
    }
    adoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/adoptados");
        });
    }
    solicitudesEnviadas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/solicitudesEnviadas");
        });
    }
    solicitudesRecibidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/solicitudesRecibidas");
        });
    }
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                //res.redirect("/");
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion -- chauuuuuuuu');
                res.redirect("./error");
            }
            //res.send('Controles');
            const usuarios = yield userModel_1.default.listar();
            //const users = usuarios;
            res.render('partials/controls', { users: usuarios, mi_session: true });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                //res.redirect("/");
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("./error");
            }
            console.log(req.body);
            let usuario = req.body.usuario;
            var usuarios = [];
            console.log(usuario);
            if (usuario !== undefined) {
                for (let elemento of usuario) {
                    const encontrado = yield userModel_1.default.buscarId(elemento);
                    if (encontrado) {
                        usuarios.push(encontrado);
                        console.log(encontrado);
                    }
                }
            }
            console.log(usuarios);
            res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });
        });
    }
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
    showError(req, res) {
        res.render("partials/error");
        //res.send({ "Usuario y/o contraseña incorrectos flash": req.body });
    }
    //CRUD 
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const usuarios = yield userModel_1.default.listar();
            console.log(usuarios);
            return res.json(usuarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    listAnimals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animales = yield userModel_1.default.listarAnimales();
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
        });
    }
    listAnimalsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const animales = yield userModel_1.default.listarAnimalesUser(id);
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            return res.status(404).json({ text: "User doesn't exists" });
        });
    }
    findUserWithMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { mail } = req.params;
            const usuario = yield userModel_1.default.buscarEmail(mail);
            if (usuario)
                return res.json(usuario);
            return res.status(404).json({ text: "User doesn't exists" });
        });
    }
    findAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const animal = yield userModel_1.default.buscarIdAnimal(id);
            if (animal)
                return res.json(animal);
            return res.status(404).json({ text: "animal doesn't exists" });
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            delete usuario.repassword;
            console.log(req.body);
            const busqueda = yield userModel_1.default.buscarNombre(usuario.nombre);
            if (!busqueda) {
                const result = yield userModel_1.default.crear(usuario);
                // res.redirect("./signin");
                const user = yield userModel_1.default.buscarEmail(usuario.email);
                const token = jsonwebtoken_1.default.sign({ _id: user.id }, "secretKey");
                return res.status(200).json({ message: user, token: token });
                //return res.json({ message: 'User saved!!' });
            }
            //return res.json({ message: 'User exists!!' });
            return res.status(403).json({ message: 'User exists!!' });
        });
    }
    addAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const animal = req.body;
            console.log("Q onda cuantos son", req.body);
            const Nombre = animal.nombre;
            const user = animal.idDador;
            const busqueda = yield userModel_1.default.buscarAnimal(animal.nombre, animal.idDador);
            if (!busqueda) {
                const result = yield userModel_1.default.crearAnimal(animal);
                //Hace falta pasar el id del nuevo animal creado, asi lo devolvemos para poder ir a ese perfil de animal
                console.log("EL id aca ", result);
                // res.redirect("./signin");   
                return res.json({ id: result });
            }
            return res.status(403).json({ message: 'animal exists!!' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const result = yield userModel_1.default.actualizar(req.body, id);
            //res.send('Usuario '+ req.params.id +' actualizado!!!');
            //creo hay q cambiar por res.status.json
            return res.json({ text: 'updating a user ' + id });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            //return res.json({ text: 'deleting a user ' + id });
            res.redirect('../control');
        });
    }
    //FIN CRUD
    //Cesar Jueves
    addComentario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comentario = req.body;
            console.log(req.body);
            if (comentario) {
                const result = yield userModel_1.default.crearComentario(comentario);
                // res.redirect("./signin");
                return res.status(200).json({ message: 'Comentario saved!!' });
                //return res.json({ message: 'User saved!!' });
            }
            //return res.json({ message: 'User exists!!' });
            return res.status(403).json({ message: 'error' });
        });
    }
    listComentarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const comentarios = yield userModel_1.default.listarComentarios(id);
            console.log(comentarios);
            return res.json(comentarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    listUsuariosLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const likes = yield userModel_1.default.listUsuariosLikes(id);
            console.log(likes);
            return res.json(likes);
            //res.send('Listado de usuarios!!!');
        });
    }
    updateLikeDislikeComentario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            if (usuario.like_dislike == "quitarDislike") {
                console.log(req.body);
                const { idComentario } = req.params;
                const idUsuario = usuario.idUsuario;
                const result = yield userModel_1.default.updateDislikeQuitarComentario(idUsuario, idComentario);
                return res.status(200).json({ text: 'updating comentario ' + idComentario });
            }
            else {
                if (usuario.like_dislike == "quitarLike") {
                    console.log(req.body);
                    const { idComentario } = req.params;
                    const idUsuario = usuario.idUsuario;
                    const result = yield userModel_1.default.updateLikeQuitarComentario(idUsuario, idComentario);
                    return res.status(200).json({ text: 'updating comentario ' + idComentario });
                }
                else {
                    if (usuario.like_dislike == "dislike") {
                        console.log(req.body);
                        const { idComentario } = req.params;
                        console.log(req.params);
                        console.log(idComentario);
                        const result = yield userModel_1.default.updateDislikeComentario(usuario, idComentario);
                        //res.send('Usuario '+ req.params.id +' actualizado!!!');
                        return res.status(200).json({ text: 'updating comentario ' + idComentario });
                    }
                    else {
                        if (usuario.like_dislike == "like") {
                            console.log(req.body);
                            const { idComentario } = req.params;
                            const result = yield userModel_1.default.updateLikeComentario(usuario, idComentario);
                            //res.send('Usuario '+ req.params.id +' actualizado!!!');
                            return res.status(200).json({ text: 'updating comentario ' + idComentario });
                        }
                        else {
                            return res.status(404).json({ text: 'MAL ' });
                        }
                    }
                }
            }
        });
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map