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
const nodemailer_1 = __importDefault(require("nodemailer"));
class UserController {
    // Login
    signin(req, res) {
        console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('SERVIDOR -> DENTRO DE LOGIN');
            const { email, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarEmail(email);
            console.log("Este es el email", email);
            console.log("Este es el password", password);
            console.log("Este es el result", result);
            if (!result) {
                return res.status(404).json({ message: "Usuario no registrado, no esta supuestamente" });
                //req.flash('error_session', 'Usuario y/o Password Incorrectos');
                //res.redirect("./signin");
            }
            else {
                const confirmado = result.confirmado;
                console.log('Servidor confirmado => ', confirmado);
                if (confirmado == 0) {
                    console.log('Usuario no confirmado');
                    return res.status(404).json({ message: "Debes verificar tu cuenta primero para poder ingresar. Por favor, revisa tu e-mail" });
                }
                else {
                    //res.send({ "Usuario no registrado Recibido": req.body }); El profe dejo esta linea pero no valida si el user es incorrecto
                    if (result.email == email && result.password == password) {
                        const token = jsonwebtoken_1.default.sign({ _id: result.id }, "secretKey");
                        console.log("Este es el id del usuario", result.id);
                        req.session.user = result;
                        req.session.auth = true;
                        res.status(200).json({ message: result.id, token: token });
                        //res.redirect("./home");
                        return;
                    }
                    else {
                        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
                        //req.flash('error_session', 'Usuario y/o Password Incorrectos');
                        //res.redirect("./error");
                        return res.status(403).json({ message: "Usuario y/o contraseña incorrectos" });
                    }
                }
            }
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
    //adopcion animal
    comenzarAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adopcionData = req.body;
            console.log(req.body);
            // console.log("El id del Interesado", idInteresado);
            // const { idAnimal } = req.params;
            // console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.comenzarAdopcion({ data: adopcionData });
            console.log("El result", result);
            return res.json(result);
        });
    }
    confirmarAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUsuario = req.body.idInteresado;
            const { idAnimal } = req.params;
            console.log(req.body);
            const result = yield userModel_1.default.confirmarAdopcion(idAnimal, idUsuario);
            console.log("El result", result);
            return res.json(result);
        });
    }
    estadoAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { idAnimal } = req.params;
            const estado = yield userModel_1.default.estadoAnimal(idAnimal);
            console.log(estado);
            return res.json(estado);
            //res.send('Listado de animales!!!');
        });
    }
    cancelarProcesoAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { idAnimal } = req.params;
            const result = yield userModel_1.default.cancelarProcesoAdopcion(idAnimal);
            console.log(result);
            return res.json(result);
        });
    }
    //
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
    //Notificaciones
    notificacionesListar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const notificaciones = yield userModel_1.default.notificacionesListar(id);
            console.log(notificaciones);
            return res.json(notificaciones);
        });
    }
    notificacionesConteo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const conteo = yield userModel_1.default.notificacionesConteo(id);
            console.log(conteo);
            return res.json(conteo);
        });
    }
    notificacionesVistas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const vistas = yield userModel_1.default.notificacionesVistas(id);
            console.log(vistas);
            return res.json(vistas);
        });
    }
    //
    //
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
    listarAnimalesAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animales = yield userModel_1.default.listarAnimalesAdoptados();
            console.log(animales);
            return res.json(animales);
        });
    }
    fechaAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const fechaAdoptado = yield userModel_1.default.fechaAdoptados();
            console.log(fechaAdoptado);
            return res.json(fechaAdoptado);
        });
    }
    listAnimalsFiltrado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const filtro = req.body.filtro;
            console.log("q aaaaa", filtro);
            var incluyeTipo = [];
            var excluyeTipo = [];
            var incluyeTamano = [];
            var excluyeTamano = [];
            if (filtro.perroF == true) {
                if (filtro.perroE == true) {
                    excluyeTipo.push("perro");
                    if (filtro.gatoF == false && filtro.chicoF == false && filtro.medianoF == false && filtro.grandeF == false) {
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
                }
                else {
                    incluyeTipo.push("perro");
                }
            }
            else {
                if (filtro.perroE == true) {
                    excluyeTipo.push("perro");
                }
            }
            if (filtro.gatoF == true) {
                if (filtro.gatoE == true) {
                    excluyeTipo.push("gato");
                    if (filtro.perroF == false && filtro.chicoF == false && filtro.medianoF == false && filtro.grandeF == false) {
                        excluyeTipo.push("perro");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
                }
                else {
                    incluyeTipo.push("gato");
                }
            }
            else {
                if (filtro.gatoE == true) {
                    excluyeTipo.push("gato");
                }
            }
            if (filtro.chicoF == true) {
                if (filtro.chicoE == true) {
                    excluyeTamano.push("chico");
                    if (filtro.perroF == false && filtro.gatoF == false && filtro.medianoF == false && filtro.grandeF == false) {
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
                }
                else {
                    incluyeTamano.push("chico");
                }
            }
            else {
                if (filtro.chicoE == true) {
                    excluyeTamano.push("chico");
                }
            }
            if (filtro.medianoF == true) {
                if (filtro.medianoE == true) {
                    excluyeTamano.push("mediano");
                    if (filtro.perroF == false && filtro.gatoF == false && filtro.chicoF == false && filtro.grandeF == false) {
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("grande");
                    }
                }
                else {
                    incluyeTamano.push("mediano");
                }
            }
            else {
                if (filtro.medianoE == true) {
                    excluyeTamano.push("mediano");
                }
            }
            if (filtro.grandeF == true) {
                if (filtro.grandeE == true) {
                    excluyeTamano.push("grande");
                    if (filtro.perroF == false && filtro.gatoF == false && filtro.chicoF == false && filtro.medianoF == false) {
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                    }
                }
                else {
                    incluyeTamano.push("grande");
                }
            }
            else {
                if (filtro.grandeE == true) {
                    excluyeTamano.push("grande");
                }
            }
            // if(filtro.gatoE==false && filtro.perroE==false){
            //     excluye.push("Vacio");
            // }
            // if(filtro.gatoF==false && filtro.perroF==false){
            //     incluye.push("Vacio");
            // }
            console.log(incluyeTipo);
            console.log(excluyeTipo);
            console.log(incluyeTamano);
            console.log(excluyeTamano);
            const animales = yield userModel_1.default.listAnimalsFiltrado(incluyeTipo, excluyeTipo, incluyeTamano, excluyeTamano);
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
            const { nombre, email, nro_celular } = req.body;
            delete usuario.repassword;
            console.log(req.body);
            const busqueda = yield userModel_1.default.buscarNombre(usuario.nombre);
            if (!busqueda) {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "christianbogarin@gmail.com",
                        clientId: "813392039318-bgaesokpjaiefg7h4go6gs8nuhgb1ur5.apps.googleusercontent.com",
                        clientSecret: "RDDrDR1rgfGI_cfG0e3lKz_4",
                        refreshToken: "1//04eaSkZEEfe51CgYIARAAGAQSNwF-L9IrmoTr0gCqboJQ5De8cYJxX3O02e7qNJi7Aunqp0R06T5I5LKncOfk3qOtfXSrmhiNZ8E"
                    }
                });
                const result = yield userModel_1.default.crear(usuario);
                // res.redirect("./signin");
                const user = yield userModel_1.default.buscarEmail(usuario.email);
                console.log('Servidor user => ', user);
                const token = jsonwebtoken_1.default.sign({ _id: user.id }, "secretKey", {
                    expiresIn: '1d',
                });
                const url = `http://adogtameweb.herokuapp.com/usuarios/verificar/${token}`;
                var contentHTML = `
						<h1>Completa tu registro - Adogtame App</h1>
						<h2>Hola ${nombre}!</h2>
							
						<p>Por favor haz click en el siguiente link, o copialo en la barra de direcciones de tu navegador
						para completar el proceso de registro:</p>
						<a href="${url}">${url}</a>
						<img src="https://st2.depositphotos.com/1606449/7516/i/950/depositphotos_75163555-stock-photo-cats-and-dogs-hanging-paws.jpg"/>
						<p><h3><b>Adogtame S.A.</b></h3><br/>
						<b>Nuestro sitio web:</b> <a href="https://adogtame-frontend.herokuapp.com/">Adogtame Web</a><br/>
						<b>Nuestras redes:</b> <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png" width="32" heigth="32"/>
						<img src="https://images.vexels.com/media/users/3/223136/isolated/lists/984f500cf9de4519b02b354346eb72e0-facebook-icon-redes-sociales.png" width="32" height="32"/>
						<img src="https://image.similarpng.com/very-thumbnail/2020/06/Logo-Twitter-icon-transparent-PNG.png" width="32" height="32"/><br/>
						<b>Contacto:</b> adogtamesa@gmail.com - (54) 11 9999 5555
						</p>
					`;
                const info = yield transporter.sendMail({
                    from: "'Adogtame App' <adogtamesa@gmail.com>",
                    to: email,
                    subject: "Confirmacion de registro Adogtame App",
                    html: contentHTML
                });
                console.log('Message sent, info => ', info);
                console.log('token result => ', token);
                return res.status(200).json({ message: user, token: token });
                //return res.json({ message: 'User saved!!' });
            }
            //return res.json({ message: 'User exists!!' });
            return res.status(403).json({ message: 'User exists!!' });
        });
    }
    confirmarRegistro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwtPayload = jsonwebtoken_1.default.verify(req.params.token, 'secretKey');
                console.log('jwtPayload', jwtPayload);
                const id = jwtPayload._id;
                console.log('Servidor id => ', id);
                const result = yield userModel_1.default.confirmarUsuario(1, id);
                return res.status(200).json({ message: result });
            }
            catch (e) {
                console.log('Servidor entro en el catch');
                res.send('error');
            }
        });
    }
    addAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const animal = req.body;
            console.log("Q onda cuantos son", req.body);
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
    //Interes
    mostrarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idInteresado = req.body.idInteresado;
            console.log(req.body);
            console.log("El id del interesado", idInteresado);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.mostrarInteres(idAnimal, idInteresado);
            return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });
        });
    }
    quitarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idInteresado = req.body.idInteresado;
            console.log(req.body);
            console.log("El id del interesado", idInteresado);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.quitarInteres(idAnimal, idInteresado);
            return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });
        });
    }
    cargarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUsuario = req.body.idUsuario;
            console.log(req.body);
            console.log("El id del Usuario", idUsuario);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.cargarInteres(idAnimal, idUsuario);
            console.log("El pinche result", result);
            return res.json(result);
        });
    }
    cargarInteresados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.cargarInteresados(idAnimal);
            console.log("El result  ", result);
            return res.json(result);
        });
    }
    //
    siguiendoAnimales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUsuario } = req.params;
            console.log("El id del usuario", idUsuario);
            const result = yield userModel_1.default.siguiendoAnimales(idUsuario);
            console.log("El result  ", result);
            return res.json(result);
        });
    }
    //
    //Atualizar datos (Modificar / updates)
    updateDataUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const idUsuario = req.params.id;
            var usuarioCambios = req.body;
            console.log("idUsuario", idUsuario);
            console.log("usuarioCambios q hay", usuarioCambios);
            const result = yield userModel_1.default.updateDataUsuario(usuarioCambios, idUsuario);
            res.status(200).json({ text: "usuario actualizado correctamente" });
        });
    }
    //APARTADO ADMIN
    deleteComentario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminarComentario(id);
            //return res.json({ text: 'deleting a user ' + id });
            //res.redirect('../abmProductos');
            res.status(200).json({ text: "Comentario eliminado correctamente" });
        });
    }
    cantidadInteresados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { cantidad } = req.params;
            console.log("animal idd ", cantidad);
            const cantidadInteresados = yield userModel_1.default.cantidadInteresados(cantidad);
            console.log(cantidadInteresados);
            return res.json(cantidadInteresados);
        });
    }
    vacunasAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { vacuna } = req.params;
            console.log("animal id ", vacuna);
            const vacunas = yield userModel_1.default.vacunasAnimal(vacuna);
            console.log(vacunas);
            return res.json(vacunas);
        });
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map