import { json } from 'sequelize';
import db from '../models/index';
import CRUDservice from '../services/CRUDservice';
import { UPDATE } from 'sequelize/lib/query-types';
import userService from '../services/userService';

let HomePage = (req, res) => {
   return res.render('homePage.ejs');
};

let manager = async (req, res) => {
   try {
      let data = await CRUDservice.getAllUser();  // Gọi hàm để lấy dữ liệu
      return res.render('managerAccount.ejs', { dataTable: data });  // Gửi dữ liệu vào view
   } catch (error) {
      console.error(error);
      return res.status(500).send('Error occurred while fetching user data');
   }
}

let createAccount = (req, res) => {
   return res.render('createAccount.ejs', { errorMessage: null, oldInput: null });
}

let postCreateAccount = async (req, res) => {
   try {
      const { loginName, password, phoneNumber, roleId, email } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!loginName || !password || !phoneNumber || !roleId) {
         return res.render('createAccount.ejs', {
            errorMessage: 'Vui lòng điền đầy đủ các trường bắt buộc.',
            oldInput: req.body
         });
      }

      // Kiểm tra trùng phoneNumber
      const phoneExists = await CRUDservice.checkUserPhone(phoneNumber);
      if (phoneExists) {
         return res.render('createAccount.ejs', {
            errorMessage: 'Số điện thoại đã tồn tại, vui lòng sử dụng số khác.',
            oldInput: req.body
         });
      }

      // Kiểm tra trùng loginName
      const loginNameExists = await CRUDservice.checkUserLoginName(loginName);
      if (loginNameExists) {
         return res.render('createAccount.ejs', {
            errorMessage: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.',
            oldInput: req.body
         });
      }

      // Nếu có email, kiểm tra email trùng
      if (email) {
         const emailExists = await CRUDservice.checkUserMail(email);
         if (emailExists) {
            return res.render('createAccount.ejs', {
               errorMessage: 'Email đã được sử dụng.',
               oldInput: req.body
            });
         }
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.render('createAccount.ejs', {
            errorMessage: 'Email không đúng định dạng.',
            oldInput: req.body
         });
      }

      // Tạo user mới
      await CRUDservice.createNewUser(req.body);

      return res.redirect('/managerAccount');

   } catch (error) {
      console.error(error);
      return res.status(500).send("Đã xảy ra lỗi khi tạo người dùng.");
   }
};

let updateAccount = async (req, res) => {
   let userId = req.query.id;
   if (userId) {
      let userData = await CRUDservice.getUserInfoById(userId);
      return res.render("updateAccount.ejs", {
         user: userData
      });
   } else {
      return res.send("User not found")
   }
}

let putUpdateAccount = async (req, res) => {
   let data = req.body;
   let result = await CRUDservice.updateUserData(data);

   if (result.errCode === 0) {
      return res.render("managerAccount.ejs", {
         dataTable: result.users,
         message: 'Update successful'
      });
   } else {
      return res.render("updateAccount.ejs", {
         user: data, // render lại dữ liệu đã nhập
         error: result.errMessage || 'Update failed'
      });
   }
}

let deleteAccount = async (req, res) => {
   let id = req.query.id;
   if (id) {
      try {
         await CRUDservice.deleteUserById(id);
         return res.redirect('/managerAccount'); // Chuyển hướng sau khi xóa thành công
      } catch (error) {
         console.error(error);
         return res.status(500).send("Error deleting user");
      }
   } else {
      return res.send("User not found");
   }
}

module.exports = {
   HomePage: HomePage,
   manager: manager,
   createAccount: createAccount,
   postCreateAccount: postCreateAccount,
   updateAccount: updateAccount,
   putUpdateAccount: putUpdateAccount,
   deleteAccount: deleteAccount,
}