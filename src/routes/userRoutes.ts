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
        
        this.router.get('/signupOrg', userController.signupOrg);
        this.router.post('/signupOrg', userController.addUser);


        // Home del usuario
        this.router.get('/home',userController.home);
        this.router.get('/control',userController.control);
        this.router.post('/procesar',userController.procesar);
        this.router.get('/salir',userController.endSession);
        this.router.get('/error',userController.showError);
        this.router.get('/delete/:id',userController.delete);



        // CRUD
		this.router.get('/list',userController.list);
		this.router.get('/find/:id',userController.find);
		this.router.post('/add',userController.addUser);
		this.router.put('/update/:id',userController.update);
		this.router.delete('/delete/:id',userController.delete);

        // FIN DEL CRUD
        
    }
}

//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
export default userRoutes.router;
