import bcrypt from 'bcrypt';
import db from '../models/index';
import { where } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

let getAllUser = async () => {
   try {
      let users = await db.User.findAll({
         raw: true,
      });
      return users;
   } catch (error) {
      throw error;
   }
};

let createNewUser = async (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         // Bắt buộc các trường này
         if (!data.loginName || !data.phoneNumber || !data.password || !data.roleId) {
            return resolve({
               errCode: 1,
               errMessage: 'Missing required fields: loginName, phoneNumber, password, or roleId'
            });
         }

         // Check trùng loginName
         let loginExists = await checkUserLoginName(data.loginName);
         if (loginExists) {
            return resolve({ errCode: 2, errMessage: 'Login name already exists' });
         }

         // Check trùng phoneNumber
         let phoneExists = await checkUserPhone(data.phoneNumber);
         if (phoneExists) {
            return resolve({ errCode: 3, errMessage: 'Phone number already exists' });
         }

         // Nếu có nhập email thì check trùng
         if (data.email) {
            let emailExists = await checkUserMail(data.email);
            if (emailExists) {
               return resolve({ errCode: 4, errMessage: 'Email already exists' });
            }
         }

         // Hash password
         let hashPasswordFromBcrypt = await hashUserPassword(data.password);

         // Tạo user
         await db.User.create({
            loginName: data.loginName,
            password: hashPasswordFromBcrypt,
            email: data.email || null,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            address: data.address || null,
            gender: data.gender || null,
            image: data.image || null,
            roleId: data.roleId,
         });

         resolve({ errCode: 0, errMessage: 'Create new user succeed' });

      } catch (error) {
         reject(error);
      }
   });
};

let hashUserPassword = (password) => {
   return new Promise(async (resolve, reject) => {
      try {
         var hashPassword = await bcrypt.hashSync(password, salt)
         resolve(hashPassword);
      } catch (error) {
         reject(error);
      }
   })
}

let checkUserMail = async (email) => {
   try {
      let user = await db.User.findOne({ where: { email } });
      return user ? true : false;
   } catch (error) {
      console.error(error);
      return false;
   }
};

let checkUserLoginName = async (loginName) => {
   try {
      let user = await db.User.findOne({ where: { loginName } });
      return user ? true : false;
   } catch (error) {
      console.error(error);
      return false;
   }
};

let checkUserPhone = async (phoneNumber) => {
   try {
      let user = await db.User.findOne({ where: { phoneNumber } });
      return user ? true : false;
   } catch (error) {
      console.error(error);
      return false;
   }
};

let getUserInfoById = async (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: { id: userId },
            raw: true
         })
         if (user) {
            resolve(user)
         } else {
            resolve({});
         }
      } catch (error) {
         reject(error);
      }
   })

}

let updateUserData = async (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.id) {
            return resolve({ errCode: 1, errMessage: 'Missing user ID' });
         }

         let user = await db.User.findOne({ where: { id: data.id } });
         if (!user) {
            return resolve({ errCode: 2, errMessage: 'User not found' });
         }

         // Check email nếu nhập và khác
         if (data.email && data.email !== user.email) {
            let emailExists = await db.User.findOne({
               where: {
                  email: data.email,
                  id: { [db.Sequelize.Op.ne]: data.id }
               }
            });

            if (emailExists) {
               return resolve({ errCode: 3, errMessage: 'Email already in use by another user' });
            }

            user.email = data.email;
         }
         if (data.gender && (data.gender === 'M' || data.gender === 'F')) {
            user.gender = data.gender;
         }

         // ❌ Không được sửa loginName và phoneNumber

         // ✅ Cập nhật các trường còn lại nếu có
         user.firstName = data.firstName || null;
         user.lastName = data.lastName || null;
         user.address = data.address || null;
         user.gender = data.gender || null;
         user.image = data.image || null;
         user.roleId = data.roleId || user.roleId;
         user.positionID = data.positionID || null;

         await user.save();

         let allUsers = await db.User.findAll();
         resolve({ errCode: 0, errMessage: 'Update successful', users: allUsers });

      } catch (error) {
         console.error(error);
         reject({ errCode: -1, errMessage: 'Server error while updating user' });
      }
   });
};


let deleteUserById = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: { id: userId }
         })
         if (user) {
            await user.destroy();
         }
         resolve();
      } catch (error) {
         reject(error)
      }
   })
}
module.exports = {
   getAllUser: getAllUser,
   createNewUser: createNewUser,
   checkUserMail: checkUserMail,
   checkUserLoginName: checkUserLoginName,
   getUserInfoById: getUserInfoById,
   updateUserData: updateUserData,
   deleteUserById: deleteUserById,
   checkUserPhone: checkUserPhone,
};