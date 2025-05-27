import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {

   router.get('/', homeController.HomePage);
   router.get('/managerAccount', homeController.manager);
   router.get('/createAccount', homeController.createAccount);
   router.post('/post-createAccount', homeController.postCreateAccount);
   router.get('/updateAccount', homeController.updateAccount);
   router.post('/put-updateAccount', homeController.putUpdateAccount);
   router.get('/deleteAccount', homeController.deleteAccount);

   router.post('/api/login', userController.handleLogin);
   router.get('/api/get-all-users', userController.handleGetAllUsers);
   router.post('/api/create-new-user', userController.handleCreateNewUser);
   router.put('/api/edit-user', userController.handleEditUser);
   router.delete('/api/delete-user', userController.handleDeleteUser);

   router.post('/api/register', userController.handleRegister);



   return app.use("/", router);
}


module.exports = initWebRoutes;  