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
            const comentarios = yield this.db.query('SELECT * FROM comentarios_usuarios WHERE idAnimal = ?', [id]);
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return comentarios[0];
        });
    }
    listUsuariosLikes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const comentarios = yield this.db.query('SELECT * FROM usuario_comentario_like WHERE idUsuario = ?', [id]);
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
}
//Exportamos el enrutador con 
const userModel = new UserModel();
exports.default = userModel;
//# sourceMappingURL=userModel.js.map