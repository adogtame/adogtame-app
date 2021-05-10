import { Request, Response } from 'express';
import userModel from '../models/userModel';
import flash from "connect-flash";


class UserController {

    // Login
	public signin(req: Request, res: Response) {
		console.log(req.body);
		// res.send('Sign In!!!');
		res.render("partials/signinForm");
	}

    public async login(req: Request, res: Response) {
		const { id, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
		const result = await userModel.buscarId(id);
		console.log(id);
		console.log(password);
		console.log(result);
		if (!result){
            req.flash('error_session', 'Usuario y/o Password Incorrectos');
            res.redirect("./signin");
        }
			//res.send({ "Usuario no registrado Recibido": req.body }); El profe dejo esta linea pero no valida si el user es incorrecto
		if (result.id == id && result.password == password) {
			req.session.user = result;
			req.session.auth = true;
			res.redirect("./home");
			return;
		}
		//res.send({ "Usuario y/o contraseña incorrectos": req.body });
		req.flash('error_session', 'Usuario y/o Password Incorrectos');
		res.redirect("./error");
	}

	// Registro Usuario
	public signup(req: Request, res: Response) {
		console.log(req.body);
		//res.send('Sign Up!!!');
		res.render("partials/signupForm");
	}

	// Registro Organizacion
	public signupOrg(req: Request, res: Response) {
		console.log(req.body);
		//res.send('Sign Up!!!');
		res.render("partials/signupOrgForm");
	}


	public home(req: Request, res: Response) {
		console.log(req.body);
		// res.send('Bienvenido!!!');
        if(!req.session.auth){
            res.render("partials/error");
        }
        res.render("partials/home", {mi_session:true });
	}

	public async control(req:Request,res:Response){
        if(!req.session.auth){
            //res.redirect("/");
            req.flash('error_session','Debes iniciar sesion para ver esta seccion -- chauuuuuuuu');
            res.redirect("./error");
        }
        //res.send('Controles');
        
        const usuarios = await userModel.listar();
        //const users = usuarios;
        res.render('partials/controls', { users: usuarios, mi_session:true });
	}

	public async procesar(req:Request,res:Response){
        if(!req.session.auth){
            //res.redirect("/");
            req.flash('error_session','Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
        }     

        console.log(req.body);

        let usuario=req.body.usuario;
        var usuarios:any=[];
        console.log(usuario);

        if(usuario!==undefined){
            for(let elemento of usuario){
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado){
                    usuarios.push(encontrado);
                    console.log(encontrado);
                }
                    
            }
        }
        console.log(usuarios);
        res.render("partials/seleccion",{usuarios,home:req.session.user, mi_session:true});

	}

    public endSession(req: Request, res: Response){
        console.log(req.body);
        req.session.user={};
        req.session.auth=false;
        req.session.destroy(()=>console.log("Session finalizada"));
        res.redirect("/");
    }

    public showError(req: Request, res: Response){
        res.render("partials/error");
        //res.send({ "Usuario y/o contraseña incorrectos flash": req.body });
    }





	//CRUD 
	public async list(req:Request,res:Response){
        console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
	}

	public async find(req:Request,res:Response){
        console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        res.status(404).json({ text: "User doesn't exists" });
	}

	public async addUser(req:Request,res:Response){
        const usuario = req.body;
        delete usuario.repassword;
        console.log(req.body);
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
            res.redirect("./signin");
            return res.json({ message: 'User saved!!' });
        }
        return res.json({ message: 'User exists!!' });
        
	}

	public async update(req:Request,res:Response){
        console.log(req.body);
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');
        return res.json({ text: 'updating a user ' + id });
	}

	public async delete(req:Request,res:Response){
		console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        //return res.json({ text: 'deleting a user ' + id });
        res.redirect('../control');
    }
	//FIN CRUD

}

const userController = new UserController();
export default userController;

