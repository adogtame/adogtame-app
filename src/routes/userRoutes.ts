import { Router, Request, Response } from 'express';
import userController from "../controller/userController";

class UserRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/', (req: Request, res: Response) => {
            res.send('Main!!!');
            //res.render("partials/principal");
        });

        // Login
        this.router.get('/signin', userController.signin);
        this.router.post('/signin', userController.login);


        // Registro
        this.router.get('/signup', userController.signup);
        this.router.post('/signup', userController.addUser);
        
        this.router.get('/signupAnimal', userController.signupAnimal);
        this.router.post('/signupAnimal', userController.addAnimal);


        // Home del usuario
        this.router.get('/home',userController.home);
        this.router.get('/control',userController.control);
        this.router.post('/procesar',userController.procesar);
        this.router.get('/salir',userController.endSession);
        this.router.get('/error',userController.showError);
        this.router.get('/delete/:id',userController.delete);
        this.router.get('/adoptados',userController.adoptados);
        this.router.get('/solicitudesEnviadas',userController.solicitudesEnviadas);
        this.router.get('/solicitudesRecibidas',userController.solicitudesRecibidas);


        // CRUD
		this.router.get('/list',userController.list);
		this.router.get('/listAnimals',userController.listAnimals);
		this.router.get('/listAnimalsUser/:id',userController.listAnimalsUser);


		this.router.get('/find/:id',userController.find);
		this.router.get('/findAnimal/:id',userController.findAnimal);
		this.router.post('/add',userController.addUser);
		this.router.put('/update/:id',userController.update);
		this.router.delete('/delete/:id',userController.delete);

        //
		this.router.post('/dToken',userController.dToken);

        
        // FIN DEL CRUD
        

        //Cesar Jueves
        this.router.post('/comentario', userController.addComentario);

		this.router.get('/listComentarios/:id',userController.listComentarios);

		this.router.get('/listUsuariosLikes/:id',userController.listUsuariosLikes);
        
		this.router.put('/updateLikeDislikeComentario/:idComentario',userController.updateLikeDislikeComentario);

		this.router.get('/findUserWithMail/:mail',userController.findUserWithMail);





        //APARTADO ADMIN
        //Para no crear otro objeto q sea admin lo metemos en user



        this.router.delete('/deleteComentario/:id',userController.deleteComentario);	


        
        //



    }
}

//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
export default userRoutes.router;
