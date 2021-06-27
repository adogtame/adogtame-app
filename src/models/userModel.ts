import { createPool } from 'mysql2/promise';

class UserModel {
	private db: any;
	constructor() {
		this.config(); //aplicamos la conexion con la BD.
	}

	async config() {//Parametro de conexion con la BD.
		this.db = await createPool({
			host: 'blto8v3zcreb9b7rgewp-mysql.services.clever-cloud.com',
			user: 'utjng23uz82553tn',
			password: 'IWsnwR20lAPraZ0aAicI',
			database: 'blto8v3zcreb9b7rgewp',
			connectionLimit: 10
		});
	}

	async listar() {//Devuelve todas las filas de la tabla usuario
		//const db=this.connection;
		const usuarios = await this.db.query('SELECT * FROM usuario');
		//console.log(usuarios[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return usuarios[0];
	}

	async listarAnimales() {//Devuelve todas las filas de la tabla usuario
		//const db=this.connection;
		const animales = await this.db.query('SELECT * FROM animal');
		//console.log(usuarios[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return animales[0];
	}

	async listarAnimalesUser(id: string) {//Devuelve todas las filas de la tabla usuario
		//const db=this.connection;
		const animales = await this.db.query('SELECT * FROM animal WHERE idDador = ?', [id]);
		//console.log(usuarios[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return animales[0];
	}


	//Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
	//Si no la encuentra devuelve null
	async buscarId(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM usuario WHERE id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}



	async buscarIdAnimal(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM animal WHERE id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
	//Si no la encuentra devuelve null
	async buscarNombre(nombre: string) {
		const encontrado: any = await this.db.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
	//Si no la encuentra devuelve null
	async buscarEmail(email: string) {
		const encontrado: any = await this.db.query('SELECT * FROM usuario WHERE email = ?', [email]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
	async crear(usuario: object) {
		const result = (await this.db.query('INSERT INTO usuario SET ?', [usuario]))[0].affectedRows;
		console.log(result);
		return result;

	}


	async crearAnimal(animal: object) {
		const result = (await this.db.query('INSERT INTO animal SET ?', [animal]))[0].affectedRows;

		
		const result2 = (await this.db.query('SELECT id FROM animal order by id desc limit 1'))[0][0];
		const { id } = result2;
		console.log("El result ",result2);
		console.log("El id", id);
		return id;
	}

	async buscarAnimal(nombre: string, dador: string) {
		const encontrado: any = await this.db.query('SELECT * FROM animal WHERE nombre = ? and idDador = ?', [nombre, dador]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}
	//Devuelve 1 si logro actualizar el usuario indicado por id
	async actualizar(usuario: object, id: string) {
		const result = (await this.db.query('UPDATE usuario SET ? WHERE id = ?', [usuario, id]))[0].affectedRows;
		console.log(result);
		return result;
	}

	//Devuelve 1 si logro eliminar el usuario indicado por id
	async eliminar(id: string) {
		const user = (await this.db.query('DELETE FROM usuario WHERE id = ?', [id]))[0].affectedRows;
		console.log(user);
		return user;
	}





	//Cesar Jueves
	async crearComentario(comentario: object) {
		const result = (await this.db.query('INSERT INTO comentarios_usuarios SET ?', [comentario]))[0].affectedRows;
		console.log(result);
		return result;
	}
	
	async listarComentarios(id: string) {//Devuelve todas las filas de la tabla usuario
		//const db=this.connection;
		const comentarios = await this.db.query('SELECT * FROM comentarios_usuarios WHERE idAnimal = ? order by id DESC', [id]);
		//console.log(usuarios[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return comentarios[0];
	}

	async listUsuariosLikes(id: string) {//Devuelve todas las filas de la tabla usuario
		//const db=this.connection;
		const comentarios = await this.db.query('SELECT * FROM usuario_comentario_like WHERE idUsuario = ? order by idComentario DESC', [id]);
		//console.log(usuarios[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return comentarios[0];
	}

	
	async updateLikeComentario(usuario: object, id: string) {
		
		const result = (await this.db.query('UPDATE comentarios_usuarios SET likes = likes + 1 WHERE id = ?', [id]))[0].affectedRows;
		
		const result2 = (await this.db.query('INSERT INTO usuario_comentario_like SET ?', [usuario]))[0].affectedRows;
				
		console.log(result);
		return result;
	}

	async updateDislikeComentario(usuario: object, id: string) {
		
		const result = (await this.db.query('UPDATE comentarios_usuarios SET dislikes = dislikes + 1 WHERE id = ?', [id]))[0].affectedRows;
		
		const result2 = (await this.db.query('INSERT INTO usuario_comentario_like SET ?', [usuario]))[0].affectedRows;
				
		console.log(result);
		return result;
	}

	async updateLikeQuitarComentario(idUsuario: string, idComentario: string) {
		
		const result = (await this.db.query('UPDATE comentarios_usuarios SET likes = likes - 1 WHERE id = ?', [idComentario]))[0].affectedRows;
		
		const result2 = (await this.db.query('DELETE FROM usuario_comentario_like WHERE idUsuario = ? and idComentario = ?', [idUsuario, idComentario]))[0].affectedRows;
			
		
		console.log(result);
		return result;
	}

	async updateDislikeQuitarComentario(idUsuario: object, idComentario: string) {
		
		const result = (await this.db.query('UPDATE comentarios_usuarios SET dislikes = dislikes - 1 WHERE id = ?', [idComentario]))[0].affectedRows;
		
		const result2 = (await this.db.query('DELETE FROM usuario_comentario_like WHERE idUsuario = ? and idComentario = ?', [idUsuario, idComentario]))[0].affectedRows;
		
		console.log(result);
		return result;
	}








	//APARTADO ADMIN

	
	async eliminarComentario(id: string) {
		const RES2 = (await this.db.query('DELETE FROM usuario_comentario_like WHERE idComentario = ?', [id]))[0].affectedRows;
		const RES = (await this.db.query('DELETE FROM comentarios_usuarios WHERE ID = ?', [id]))[0].affectedRows;

		console.log(RES);
		return RES;
	}





}

//Exportamos el enrutador con 
const userModel: UserModel = new UserModel();
export default userModel;
