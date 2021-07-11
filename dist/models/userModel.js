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
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
class UserModel {
    constructor() {
        this.config(); //aplicamos la conexion con la BD.
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield promise_1.createPool({
                host: 'blto8v3zcreb9b7rgewp-mysql.services.clever-cloud.com',
                user: 'utjng23uz82553tn',
                password: 'IWsnwR20lAPraZ0aAicI',
                database: 'blto8v3zcreb9b7rgewp',
                connectionLimit: 10
            });
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const usuarios = yield this.db.query('SELECT * FROM usuario');
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return usuarios[0];
        });
    }
    listarAnimales() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const animales = yield this.db.query('SELECT * FROM animal');
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
        });
    }
    listAnimalsFiltrado(incluyeTipo, excluyeTipo, incluyeTamano, excluyeTamano) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            var animales = [];
            console.log("Tipo i", incluyeTipo);
            console.log("Tipo e", excluyeTipo);
            console.log("Tamano i", incluyeTamano);
            console.log("Tamano e", excluyeTamano);
            if (incluyeTipo.length == 0) {
                console.log("incluyeTipo null");
                if (excluyeTipo.length == 0) {
                    console.log("excluyeTipo null");
                    if (incluyeTamano.length == 0) {
                        console.log("incluyeTamano null");
                        if (excluyeTamano.length == 0) {
                            console.log("Todas null");
                            animales = yield this.db.query('SELECT * FROM animal');
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tamano NOT IN (?)', [excluyeTamano]);
                        }
                    }
                    else {
                        console.log("incluyeTamano tiene");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tamano IN (?)', [incluyeTamano]);
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [incluyeTamano, excluyeTamano]);
                        }
                    }
                }
                else {
                    console.log("excluyeTipo tiene");
                    if (incluyeTamano.length == 0) {
                        console.log("incluyeTamano null");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?)', [excluyeTipo]);
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano NOT IN (?)', [excluyeTipo, excluyeTamano]);
                        }
                    }
                    else {
                        console.log("incluyeTamano tiene");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano IN (?)', [excluyeTipo, incluyeTamano]);
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [excluyeTipo, incluyeTamano, excluyeTamano]);
                        }
                    }
                }
            }
            else {
                console.log("IncluyeTipo tiene");
                if (excluyeTipo.length == 0) {
                    console.log("excluyeTipo null");
                    if (incluyeTamano.length == 0) {
                        console.log("incluyeTamano null");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?)', [incluyeTipo]);
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano NOT IN (?)', [incluyeTipo, excluyeTamano]);
                        }
                    }
                    else {
                        console.log("incluyeTamano tiene");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?)', [incluyeTipo, incluyeTamano]);
                        }
                        else {
                            console.log("excluyeTamano tiene");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [incluyeTipo, incluyeTamano, excluyeTamano]);
                        }
                    }
                }
                else {
                    console.log("excluyeTipo tiene");
                    if (incluyeTamano.length == 0) {
                        console.log("incluyeTamano null");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?))', [incluyeTipo, excluyeTipo]);
                        }
                        else {
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?)) AND tamano NOT IN (?)', [incluyeTipo, excluyeTipo, excluyeTamano]);
                        }
                    }
                    else {
                        console.log("incluyeTamano tiene");
                        if (excluyeTamano.length == 0) {
                            console.log("excluyeTamano null");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?)) AND tamano IN (?)', [incluyeTipo, excluyeTipo, incluyeTamano]);
                        }
                        else {
                            console.log("todas tienen");
                            animales = yield this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?) OR tamano IN (?))', [incluyeTipo, incluyeTamano, excluyeTipo, excluyeTamano]);
                        }
                    }
                }
            }
            console.log(animales[0]);
            //	
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
        });
    }
    listarAnimalesUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const animales = yield this.db.query('SELECT * FROM animal WHERE idDador = ?', [id]);
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    buscarIdAnimal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM animal WHERE id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarNombre(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE email = ?', [email]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    crear(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO usuario SET ?', [usuario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    confirmarUsuario(confirmado, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('confirmado => ', confirmado, 'id => ', id);
            const result = (yield this.db.query('UPDATE usuario SET confirmado = ? Where Id = ?', [confirmado, id]))[0].affectedRows;
            console.log('Confirmar usuario result =>', result);
            return result;
        });
    }
    crearAnimal(animal) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO animal SET ?', [animal]))[0].affectedRows;
            const result2 = (yield this.db.query('SELECT id FROM animal order by id desc limit 1'))[0][0];
            const { id } = result2;
            console.log("El result ", result2);
            console.log("El id", id);
            return id;
        });
    }
    buscarAnimal(nombre, dador) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM animal WHERE nombre = ? and idDador = ?', [nombre, dador]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro actualizar el usuario indicado por id
    actualizar(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE usuario SET ? WHERE id = ?', [usuario, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el usuario indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.db.query('DELETE FROM usuario WHERE id = ?', [id]))[0].affectedRows;
            console.log(user);
            return user;
        });
    }
    //interes
    mostrarInteres(idAnimal, idInteresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const interes = { idAnimal: idAnimal, idInteresado: idInteresado };
            const result = (yield this.db.query('INSERT INTO animal_interesado SET ?', [interes]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    quitarInteres(idAnimal, idInteresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('DELETE FROM animal_interesado WHERE idAnimal = ? and idInteresado = ?', [idAnimal, idInteresado]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    cargarInteres(idAnimal, idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", idAnimal, idUsuario);
            const encontrado = yield this.db.query('SELECT COUNT(1) as interes FROM animal_interesado WHERE idAnimal = ? and idInteresado = ?', [idAnimal, idUsuario]);
            //'SELECT * FROM animal
            console.log("q onda el result del model", encontrado[0][0]);
            console.log("q onda el result del model", encontrado[0][0].interes);
            return encontrado[0][0].interes;
        });
    }
    cargarInteresados(idAnimal) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", idAnimal);
            const encontrado = yield this.db.query('SELECT u.id, u.nombre, u.apellido, u.email FROM usuario as u inner join animal_interesado as i on i.idInteresado=u.id WHERE idAnimal = ?', [idAnimal]);
            //SELECT * FROM animal
            console.log("q onda el result del model", encontrado[0][0]);
            return encontrado[0][0];
        });
    }
    //
    //Cesar Jueves
    crearComentario(comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO comentarios_usuarios SET ?', [comentario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    listarComentarios(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const comentarios = yield this.db.query('SELECT * FROM comentarios_usuarios WHERE idAnimal = ? order by id DESC', [id]);
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return comentarios[0];
        });
    }
    listUsuariosLikes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const comentarios = yield this.db.query('SELECT * FROM usuario_comentario_like WHERE idUsuario = ? order by idComentario DESC', [id]);
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return comentarios[0];
        });
    }
    updateLikeComentario(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE comentarios_usuarios SET likes = likes + 1 WHERE id = ?', [id]))[0].affectedRows;
            const result2 = (yield this.db.query('INSERT INTO usuario_comentario_like SET ?', [usuario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    updateDislikeComentario(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE comentarios_usuarios SET dislikes = dislikes + 1 WHERE id = ?', [id]))[0].affectedRows;
            const result2 = (yield this.db.query('INSERT INTO usuario_comentario_like SET ?', [usuario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    updateLikeQuitarComentario(idUsuario, idComentario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE comentarios_usuarios SET likes = likes - 1 WHERE id = ?', [idComentario]))[0].affectedRows;
            const result2 = (yield this.db.query('DELETE FROM usuario_comentario_like WHERE idUsuario = ? and idComentario = ?', [idUsuario, idComentario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    updateDislikeQuitarComentario(idUsuario, idComentario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE comentarios_usuarios SET dislikes = dislikes - 1 WHERE id = ?', [idComentario]))[0].affectedRows;
            const result2 = (yield this.db.query('DELETE FROM usuario_comentario_like WHERE idUsuario = ? and idComentario = ?', [idUsuario, idComentario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //APARTADO ADMIN
    eliminarComentario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const RES2 = (yield this.db.query('DELETE FROM usuario_comentario_like WHERE idComentario = ?', [id]))[0].affectedRows;
            const RES = (yield this.db.query('DELETE FROM comentarios_usuarios WHERE ID = ?', [id]))[0].affectedRows;
            console.log(RES);
            return RES;
        });
    }
}
//Exportamos el enrutador con 
const userModel = new UserModel();
exports.default = userModel;
//# sourceMappingURL=userModel.js.map