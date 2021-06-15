import { Request, Response } from 'express';
import userModel from '../models/userModel';
import flash from "connect-flash";
import jwt from "jsonwebtoken";
import jwtDecode, { JwtPayload } from "jwt-decode";

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
            
            return res.status(404).json({ message:"Usuario no registrado"});
            //req.flash('error_session', 'Usuario y/o Password Incorrectos');
            //res.redirect("./signin");
        }
			//res.send({ "Usuario no registrado Recibido": req.body }); El profe dejo esta linea pero no valida si el user es incorrecto
		if (result.id == id && result.password == password) {
            const token:string=jwt.sign({_id: result.id},"secretKey");
            
		    console.log(result.id);
			req.session.user = result;
			req.session.auth = true;
            res.status(200).json({ message:"Bienvenido "+result.id,token:token});
			//res.redirect("./home");
			return;
		}
		//res.send({ "Usuario y/o contraseña incorrectos": req.body });
		//req.flash('error_session', 'Usuario y/o Password Incorrectos');
		//res.redirect("./error");
        
        return res.status(403).json({ message:"Usuario y/o contraseña incorrectos"});
	}

    public dToken(req: Request, res: Response){
        
        //const { token } = req.params;
        const token = req.body.token;
        console.log(token);
        // const decoded = jwtDecode<JwtPayload>(token); // Returns with the JwtPayload type
        // console.log(decoded);
        

        const decoded = jwt.verify(token, "secretKey");  
        var userId = decoded;
        console.log(userId)  

        console.log(decoded)  


        return res.json({user: (<any>decoded)._id});
        // return res.send({
        //      user: (<any>decoded)._id
        // });
       
            
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


	// Registro Animal
	public signupAnimal(req: Request, res: Response) {
		console.log(req.body);
        if(!req.session.auth){
            res.render("partials/signinForm");
        }
        res.render("partials/signupAnimalForm", {mi_session:true });
	}

   
	public async home(req: Request, res: Response) {
		console.log(req.body);
        if(!req.session.auth){
            res.render("partials/signinForm");
        }
        res.render("partials/home", {mi_session:true });
	}


	public async adoptados(req: Request, res: Response) {
		console.log(req.body);
            res.render("partials/adoptados");
	}

	public async solicitudesEnviadas(req: Request, res: Response) {
		console.log(req.body);
            res.render("partials/solicitudesEnviadas");
	}

    public async solicitudesRecibidas(req: Request, res: Response) {
		console.log(req.body);
            res.render("partials/solicitudesRecibidas");
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
    
    public async listAnimals(req:Request,res:Response){
        console.log(req.body);
        const animales = await userModel.listarAnimales();
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
	}

    public async listAnimalsUser(req:Request,res:Response){
        console.log(req.body);
        const { id } = req.params;
        const animales = await userModel.listarAnimalesUser(id);
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
	}
    


	public async find(req:Request,res:Response){
        console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);        
        return res.status(404).json({ text: "User doesn't exists" });
	}

    public async findAnimal(req:Request,res:Response){
        console.log(req.params.id);
        const { id } = req.params;
        const animal = await userModel.buscarIdAnimal(id);
        if (animal)
            return res.json(animal);        
        return res.status(404).json({ text: "animal doesn't exists" });
	}

	public async addUser(req:Request,res:Response){
        const usuario = req.body;
        delete usuario.repassword;
        console.log(req.body);
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
           // res.redirect("./signin");
           return res.status(200).json({ message: 'User saved!!' });
            //return res.json({ message: 'User saved!!' });
        }
        //return res.json({ message: 'User exists!!' });
        return res.status(403).json({ message: 'User exists!!' });
        
	}

    public async addAnimal(req:Request,res:Response){
        const animal = req.body;
        
        console.log(req.body);
      
        
        const result = await userModel.crearAnimal(animal);
        // res.redirect("./signin");
        return res.status(200).json({ message: 'Animal saved!!' });
           
           
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

