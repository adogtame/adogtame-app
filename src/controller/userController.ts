import { Request, Response } from 'express';
import userModel from '../models/userModel';
import flash from "connect-flash";
import jwt from "jsonwebtoken";
import jwtDecode, { JwtPayload } from "jwt-decode";
import nodemailer from "nodemailer";

class UserController {

    // Login
    public signin(req: Request, res: Response) {
        console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
    }

    public async login(req: Request, res: Response) {
        console.log('SERVIDOR -> DENTRO DE LOGIN');
        const { email, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarEmail(email);

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

                    const token: string = jwt.sign({ _id: result.id }, "secretKey");

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
    }

    public dToken(req: Request, res: Response) {

        //const { token } = req.params;
        const token = req.body.token;
        console.log(token);
        // const decoded = jwtDecode<JwtPayload>(token); // Returns with the JwtPayload type
        // console.log(decoded);


        const decoded = jwt.verify(token, "secretKey");
        var userId = decoded;
        console.log("Q onda, el usuario cual es", userId)

        console.log(decoded)


        return res.json({ user: (<any>decoded)._id });
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
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/signupAnimalForm", { mi_session: true });
    }


    public async home(req: Request, res: Response) {
        console.log(req.body);
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/home", { mi_session: true });
    }


    public async adoptados(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/adoptados");
    }


    //adopcion animal
    public async comenzarAdopcion(req: Request, res: Response) {


        const adopcionData = req.body;



        console.log(req.body);
        // console.log("El id del Interesado", idInteresado);
        // const { idAnimal } = req.params;
        // console.log("El id del animal", idAnimal);
        const result = await userModel.comenzarAdopcion({data: adopcionData});

        console.log("El result",result);
        return res.json(result);



    }

    public async confirmarAdopcion(req: Request, res: Response) {


        const idUsuario = req.body.idInteresado;


        const { idAnimal } = req.params;


        console.log(req.body);
        const result = await userModel.confirmarAdopcion(idAnimal, idUsuario);

        console.log("El result",result);
        return res.json(result);



    }



    public async estadoAnimal(req: Request, res: Response) {
        console.log(req.body);
        const { idAnimal } = req.params;
        const estado = await userModel.estadoAnimal(idAnimal);
        console.log(estado);
        return res.json(estado);
        //res.send('Listado de animales!!!');
    }



    public async cancelarProcesoAdopcion(req: Request, res: Response) {
        console.log(req.body);
        
        const { idAnimal } = req.params; 
        
        const result = await userModel.cancelarProcesoAdopcion(idAnimal);
        console.log(result);
        return res.json(result);
    }

    //



    public async solicitudesEnviadas(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/solicitudesEnviadas");
    }

    public async solicitudesRecibidas(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/solicitudesRecibidas");
    }


    public async control(req: Request, res: Response) {
        if (!req.session.auth) {
            //res.redirect("/");
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion -- chauuuuuuuu');
            res.redirect("./error");
        }
        //res.send('Controles');

        const usuarios = await userModel.listar();
        //const users = usuarios;
        res.render('partials/controls', { users: usuarios, mi_session: true });
    }

    public async procesar(req: Request, res: Response) {
        if (!req.session.auth) {
            //res.redirect("/");
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
        }

        console.log(req.body);

        let usuario = req.body.usuario;
        var usuarios: any = [];
        console.log(usuario);

        if (usuario !== undefined) {
            for (let elemento of usuario) {
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado) {
                    usuarios.push(encontrado);
                    console.log(encontrado);
                }

            }
        }
        console.log(usuarios);
        res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });

    }

    public endSession(req: Request, res: Response) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }

    public showError(req: Request, res: Response) {
        res.render("partials/error");
        //res.send({ "Usuario y/o contraseña incorrectos flash": req.body });
    }


    //Notificaciones

        public async notificacionesListarInteresadosDeAnimalNoVistos(req: Request, res: Response) {
            console.log(req.body);
            const { id } = req.params;
            const animales = await userModel.notificacionesListarInteresadosDeAnimalNoVistos(id);
            console.log(animales);
            return res.json(animales);
            
        }
    //




    //
    public async list(req: Request, res: Response) {
        console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
    }

    public async listAnimals(req: Request, res: Response) {
        console.log(req.body);
        const animales = await userModel.listarAnimales();
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
    } 


    public async listarAnimalesAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const animales = await userModel.listarAnimalesAdoptados();
        console.log(animales);
        return res.json(animales);
    }

    public async fechaAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const fechaAdoptado = await userModel.fechaAdoptados();
        console.log(fechaAdoptado);
        return res.json(fechaAdoptado);
    }



    public async listAnimalsFiltrado(req: Request, res: Response) {
        console.log(req.body);
        const filtro  = req.body.filtro;
        console.log("q aaaaa", filtro);
        var incluyeTipo:any=[];
        var excluyeTipo:any=[];
        var incluyeTamano:any=[];
        var excluyeTamano:any=[];
        if(filtro.perroF==true){
            if(filtro.perroE==true){            
                excluyeTipo.push("perro");

                if(filtro.gatoF==false && filtro.chicoF==false && filtro.medianoF==false && filtro.grandeF==false){
                
                    excluyeTipo.push("gato");
                    excluyeTamano.push("chico");
                    excluyeTamano.push("mediano");
                    excluyeTamano.push("grande");
                }

            }
            else
            {                
                incluyeTipo.push("perro");
            }
            
        }
        else
        {

            if(filtro.perroE==true){

                
                excluyeTipo.push("perro");

            }


        }

        if(filtro.gatoF==true){
            
            if(filtro.gatoE==true){

                excluyeTipo.push("gato");

                if(filtro.perroF==false && filtro.chicoF==false && filtro.medianoF==false && filtro.grandeF==false){
                
                    excluyeTipo.push("perro");
                    excluyeTamano.push("chico");
                    excluyeTamano.push("mediano");
                    excluyeTamano.push("grande");
                }

   

            }
            else
            {

                incluyeTipo.push("gato");
            }
            
        }
        else
        {
            if(filtro.gatoE==true){

                excluyeTipo.push("gato");
                
            }
            
        }
    


        if(filtro.chicoF==true){
            
            if(filtro.chicoE==true){

                excluyeTamano.push("chico");

                if(filtro.perroF==false && filtro.gatoF==false && filtro.medianoF==false && filtro.grandeF==false){
                
                    excluyeTipo.push("perro");
                    excluyeTipo.push("gato");
                    excluyeTamano.push("mediano");
                    excluyeTamano.push("grande");
                }

            }
            else
            {

                incluyeTamano.push("chico");
            }
            
        }
        else
        {
            if(filtro.chicoE==true){

                excluyeTamano.push("chico");
                
            }
            
        }



        if(filtro.medianoF==true){
            
            if(filtro.medianoE==true){

                excluyeTamano.push("mediano");

                if(filtro.perroF==false && filtro.gatoF==false && filtro.chicoF==false && filtro.grandeF==false){
                
                    excluyeTipo.push("perro");
                    excluyeTipo.push("gato");
                    excluyeTamano.push("chico");
                    excluyeTamano.push("grande");
                }

            }
            else
            {

                incluyeTamano.push("mediano");
            }
            
        }
        else
        {
            if(filtro.medianoE==true){

                excluyeTamano.push("mediano");
                
            }
            
        }



        if(filtro.grandeF==true){
            
            if(filtro.grandeE==true){

                excluyeTamano.push("grande");

                if(filtro.perroF==false && filtro.gatoF==false && filtro.chicoF==false && filtro.medianoF==false){
                
                    excluyeTipo.push("perro");
                    excluyeTipo.push("gato");
                    excluyeTamano.push("chico");
                    excluyeTamano.push("mediano");
                }

            }
            else
            {

                incluyeTamano.push("grande");
            }
            
        }
        else
        {
            if(filtro.grandeE==true){

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
        const animales = await userModel.listAnimalsFiltrado(incluyeTipo, excluyeTipo, incluyeTamano, excluyeTamano);
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
    }

    public async listAnimalsUser(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const animales = await userModel.listarAnimalesUser(id);
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
    }



    public async find(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        return res.status(404).json({ text: "User doesn't exists" });
    }


    public async findUserWithMail(req: Request, res: Response) {
        console.log(req.params.id);
        const { mail } = req.params;
        const usuario = await userModel.buscarEmail(mail);
        if (usuario)
            return res.json(usuario);
        return res.status(404).json({ text: "User doesn't exists" });
    }


    public async findAnimal(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const animal = await userModel.buscarIdAnimal(id);
        if (animal)
            return res.json(animal);
        return res.status(404).json({ text: "animal doesn't exists" });
    }

    public async addUser(req: Request, res: Response) {
        const usuario = req.body;
        const { nombre, email, nro_celular } = req.body;
        delete usuario.repassword;
        console.log(req.body);
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: "OAuth2",
                    user: "christianbogarin@gmail.com",
                    clientId: "813392039318-bgaesokpjaiefg7h4go6gs8nuhgb1ur5.apps.googleusercontent.com",
                    clientSecret: "RDDrDR1rgfGI_cfG0e3lKz_4",
                    refreshToken: "1//04eaSkZEEfe51CgYIARAAGAQSNwF-L9IrmoTr0gCqboJQ5De8cYJxX3O02e7qNJi7Aunqp0R06T5I5LKncOfk3qOtfXSrmhiNZ8E"
                }
            });

            const result = await userModel.crear(usuario);
            // res.redirect("./signin");

            const user = await userModel.buscarEmail(usuario.email);
            console.log('Servidor user => ', user);

            const token: string = jwt.sign(
                { _id: user.id },
                "secretKey",
                {
                    expiresIn: '1d',
                }
            );

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

            const info = await transporter.sendMail({
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

    }

    public async confirmarRegistro(req: Request, res: Response) {
        try {
            const jwtPayload = jwt.verify(req.params.token, 'secretKey');
            console.log('jwtPayload', jwtPayload);
            interface JWTPayload {
                _id: string;
            }
            const id = (jwtPayload as JWTPayload)._id;
            console.log('Servidor id => ', id);
            const result = await userModel.confirmarUsuario(1, id);
            return res.status(200).json({ message: result });
        } catch (e) {
            console.log('Servidor entro en el catch');
            res.send('error');
        }
    }

    public async addAnimal(req: Request, res: Response) {
        const animal = req.body;

        console.log("Q onda cuantos son", req.body);

        const busqueda = await userModel.buscarAnimal(animal.nombre, animal.idDador);
        if (!busqueda) {

            const result = await userModel.crearAnimal(animal);


            //Hace falta pasar el id del nuevo animal creado, asi lo devolvemos para poder ir a ese perfil de animal


            console.log("EL id aca ", result);
            // res.redirect("./signin");   
            return res.json({ id: result });


        }


        return res.status(403).json({ message: 'animal exists!!' });




    }



    public async update(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');

        //creo hay q cambiar por res.status.json
        return res.json({ text: 'updating a user ' + id });
    }

    public async delete(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        //return res.json({ text: 'deleting a user ' + id });
        res.redirect('../control');
    }
    //FIN CRUD


    //Interes

    public async mostrarInteres(req: Request, res: Response) {


        const idInteresado = req.body.idInteresado;



        console.log(req.body);
        console.log("El id del interesado", idInteresado);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.mostrarInteres(idAnimal, idInteresado);

        return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });



    }


    public async quitarInteres(req: Request, res: Response) {


        const idInteresado = req.body.idInteresado;



        console.log(req.body);
        console.log("El id del interesado", idInteresado);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.quitarInteres(idAnimal, idInteresado);

        return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });



    }
    

    public async cargarInteres(req: Request, res: Response) {


        const idUsuario = req.body.idUsuario;



        console.log(req.body);
        console.log("El id del Usuario", idUsuario);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.cargarInteres(idAnimal, idUsuario);

        console.log("El pinche result",result);
        return res.json(result);



    }



    public async cargarInteresados(req: Request, res: Response) {


        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.cargarInteresados(idAnimal);

        console.log("El result  ",result);
        return res.json(result);



    }


    //

    public async siguiendoAnimales(req: Request, res: Response) {


        const { idUsuario } = req.params;
        console.log("El id del usuario", idUsuario);
        const result = await userModel.siguiendoAnimales(idUsuario);

        console.log("El result  ",result);
        return res.json(result);



    }

    //






    //APARTADO ADMIN


    public async deleteComentario(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminarComentario(id);
        //return res.json({ text: 'deleting a user ' + id });
        //res.redirect('../abmProductos');

        res.status(200).json({ text: "Comentario eliminado correctamente" });
    }







}

const userController = new UserController();
export default userController;

