import db from "../models/index";
import bcrypt from 'bcryptjs';
import { raw } from "body-parser";
var salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already existlet 
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);


                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Oke';
                        delete user.password
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }


            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email!`
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist
            let check = await checkUserEmail(data.email);

            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used, please try another email",

                });
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber,

            })
            resolve({
                errCode: 0,
                errMessage: "OKeee",

            });
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        console.log(user)

        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }

        await db.User.destroy({
            where: { id: userId },
            raw: true,
        })

        resolve({
            errCode: 0,
            errMessage: `The user is deleted`
        })
    })
}

let UpdateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter"
                })
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: "Update the user succeeds!"
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                })
            }

            // if (!user) {
            //     res.status(400).send({
            //         status: 'error',
            //         message: `Person with ${id} not found`
            //     })

            // } else {
            //     db.User.update({
            //         firstName: data.firstName,
            //         lastName: data.lastName,
            //         address: data.address,

            //     }, {
            //         where: { id: data.id },
            //     })
            // }

        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUser,
    createNewUser,
    deleteUser,
    UpdateUserData,
}