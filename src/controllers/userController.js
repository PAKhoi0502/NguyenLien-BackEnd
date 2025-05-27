import userService from "../services/userService";

let handleLogin = async (req, res) => {
   let identifier = req.body.identifier; // có thể là loginName hoặc phoneNumber
   let password = req.body.password;

   if (!identifier || !password) {
      return res.status(400).json({
         errCode: 1,
         message: 'Missing inputs parameter!',
      });
   }

   let userData = await userService.handleUserLogin(identifier, password);

   return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {}
   });
}

let handleGetAllUsers = async (req, res) => {
   let id = req.query.id;

   if (!id) {
      return res.status(200).json({
         errCode: 1,
         errMessage: "Missing required parameter",
         users: []
      })
   }

   let users = await userService.getAllUsers(id);

   return res.status(200).json({
      errCode: 0,
      errMessage: "Ok",
      users
   })
}

let handleCreateNewUser = async (req, res) => {
   let message = await userService.createNewUser(req.body);
   console.log(message);
   return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
   if (!req.body.id) {
      return res.status(200).json({
         errCode: 1,
         errMessage: "Missing required parameters!"
      });
   }
   try {
      let message = await userService.deleteUser(req.body.id);
      return res.status(200).json(message);
   } catch (error) {
      console.error("Delete User Error:", error);
      return res.status(500).json({
         errCode: -1,
         errMessage: "Error from server"
      });
   }
}

let handleEditUser = async (req, res) => {
   let data = req.body;
   let message = await userService.updateUserData(data);
   return res.status(200).json(message)

}

let handleRegister = async (req, res) => {
   const { loginName, password } = req.body;
   const result = await userService.registerUser({ loginName, password });
   if (result.err) {
      return res.status(400).json({ message: result.msg });
   }
   return res.status(200).json({ message: result.msg, userId: result.userId });
};

module.exports = {
   handleLogin: handleLogin,
   handleGetAllUsers: handleGetAllUsers,
   handleCreateNewUser: handleCreateNewUser,
   handleEditUser: handleEditUser,
   handleDeleteUser: handleDeleteUser,
   handleRegister: handleRegister
}