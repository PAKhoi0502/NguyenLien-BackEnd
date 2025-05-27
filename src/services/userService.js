import { resolveInclude } from "ejs";
import db from "../models/index"
import bcrypt from 'bcryptjs';
import { where } from "sequelize";
import validator from 'validator';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (identifier, password) => {
   return new Promise(async (resolve, reject) => {
      try {
         let userData = {};

         // Tìm user theo loginName hoặc phoneNumber
         let user = await db.User.findOne({
            where: {
               [db.Sequelize.Op.or]: [
                  { loginName: identifier },
                  { phoneNumber: identifier }
               ]
            },
            attributes: ['id', 'loginName', 'phoneNumber', 'roleId', 'password'],
            raw: true
         });

         if (!user) {
            userData.errCode = 1;
            userData.errMessage = "Invalid credentials";
            return resolve(userData);
         }

         let check = bcrypt.compareSync(password, user.password);
         if (check) {
            userData.errCode = 0;
            userData.errMessage = 'OK';
            delete user.password;
            userData.user = user;
         } else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password!';
         }

         resolve(userData);

      } catch (e) {
         reject(e);
      }
   });
};

const checkUserLoginName = async (loginName) => {
   try {
      let user = await db.User.findOne({
         where: { loginName: loginName }
      });
      return user ? true : false;
   } catch (error) {
      console.log("Error checking loginName:", error);
      return false;
   }
};

let getAllUsers = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let users = '';
         if (userId === 'ALL') {
            users = await db.User.findAll({
               attributes: {
                  exclude: ['password'] // remove password
               }
            })
         }
         if (userId && userId !== 'ALL') {
            users = await db.User.findOne({
               where: { id: userId },
               attributes: {
                  exclude: ['password'] // remove password
               }
            })
         }
         resolve(users)
      } catch (e) {
         reject(e);
      }
   })
}

let hashUserPassword = (password) => {
   return new Promise(async (resolve, reject) => {
      try {
         var hashPassword = await bcrypt.hashSync(password, salt);
         resolve(hashPassword);
      } catch (e) {
         reject(e);
      }
   })
};

let createNewUser = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         // Check trùng email
         let emailExists = await checkUserMail(data.email);
         if (emailExists) {
            return resolve({
               errCode: 1,
               errMessage: 'Email already exists!'
            });
         }

         // Check trùng loginName
         let loginNameExists = await checkUserLoginName(data.loginName);
         if (loginNameExists) {
            return resolve({
               errCode: 2,
               errMessage: 'Login name is already taken!'
            });
         }

         // Check trùng phoneNumber
         let phoneExists = await checkUserphoneNumber(data.phoneNumber);
         if (phoneExists) {
            return resolve({
               errCode: 3,
               errMessage: 'Phone number already exists!'
            });
         }

         // Nếu không trùng thì tạo user
         let hashPassword = await hashUserPassword(data.password);
         await db.User.create({
            loginName: data.loginName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: hashPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            gender: data.gender || null,
            roleId: data.roleId || 'R2'
         });

         resolve({
            errCode: 0,
            message: 'User created successfully!'
         });
      } catch (error) {
         reject(error);
      }
   });
};

let checkUserMail = (userEmail) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: { email: userEmail }
         });
         if (user) {
            resolve(true);
         } else {
            resolve(false);
         };
      } catch (e) {
         reject(e);
      }
   });
}

const checkUserphoneNumber = async (phoneNumber) => {
   try {
      let user = await db.User.findOne({
         where: { phoneNumber: phoneNumber }
      });
      return user ? true : false;
   } catch (error) {
      console.log("Error checking phoneNumber:", error);
      return false;
   }
};

let deleteUser = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: { id: userId }
         });
         if (!user) {
            return resolve({
               errCode: 2,
               errMessage: `The user isn't exist`
            });
         }
         await user.destroy();
         resolve({
            errCode: 0,
            errMessage: `The user is deleted`
         });
      } catch (error) {
         reject({
            errCode: -1,
            errMessage: "An error occurred while deleting the user"
         });
      }
   });
}

let updateUserData = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.id) {
            return resolve({
               errCode: 1,
               errMessage: 'Missing user ID'
            });
         }

         let user = await db.User.findOne({
            where: { id: data.id },
            raw: false
         });

         if (!user) {
            return resolve({
               errCode: 3,
               errMessage: 'User not found'
            });
         }

         if (data.email && data.email !== user.email) {
            const emailExists = await db.User.findOne({
               where: {
                  email: data.email,
                  id: { [db.Sequelize.Op.ne]: data.id }
               }
            });

            if (emailExists) {
               return resolve({
                  errCode: 4,
                  errMessage: 'Email already in use by another user'
               });
            }

            user.email = data.email;
         }

         // Cập nhật các trường có trong data (cho phép để trống)
         user.firstName = data.firstName || null;
         user.lastName = data.lastName || null;
         user.address = data.address || null;
         if (['M', 'F'].includes(data.gender)) {
            user.gender = data.gender;
         } else {
            user.gender = null;
         }

         await user.save();

         return resolve({
            errCode: 0,
            errMessage: 'Update user successfully'
         });

      } catch (error) {
         console.error(error);
         return reject({
            errCode: -1,
            errMessage: 'Server error while updating user'
         });
      }
   });
};

let registerUser = async ({ loginName, password }) => {
   // Validate loginName
   if (!loginName) {
      return { err: 1, msg: "Cần nhập tên tài khoản." };
   }
   if (!validator.isLength(loginName, { min: 8, max: 20 })) {
      return { err: 1, msg: "Tên tài khoản phải từ 8 đến 20 ký tự." };
   }
   if (!validator.isAlphanumeric(loginName)) {
      return { err: 1, msg: "Tên tài khoản chỉ gồm chữ và số, không có khoảng trắng hoặc ký tự đặc biệt." };
   }

   // Validate password
   if (!password) {
      return { err: 1, msg: "Cần nhập mật khẩu." };
   }
   if (!validator.isLength(password, { min: 8 })) {
      return { err: 1, msg: "Mật khẩu phải có ít nhất 8 ký tự." };
   }
   if (/\s/.test(password)) {
      return { err: 1, msg: "Mật khẩu không được chứa khoảng trắng." };
   }
   if (!/\d/.test(password)) {
      return { err: 1, msg: "Mật khẩu phải chứa ít nhất một số." };
   }

   // Kiểm tra loginName tồn tại
   const existLogin = await db.User.findOne({ where: { loginName } });
   if (existLogin) return { err: 1, msg: "Tên đăng nhập đã tồn tại." };

   const hashedPassword = await bcrypt.hash(password, 10);

   // Tạo user với roleId mặc định là 'R2'
   await db.User.create({
      loginName,
      password: hashedPassword,
      roleId: 'R2'  // Gán roleId mặc định user
   });

   return { err: 0, msg: "Đăng ký thành công!" };
};




export default {
   handleUserLogin: handleUserLogin,
   getAllUsers: getAllUsers,
   createNewUser: createNewUser,
   deleteUser: deleteUser,
   updateUserData: updateUserData,
   registerUser: registerUser
};