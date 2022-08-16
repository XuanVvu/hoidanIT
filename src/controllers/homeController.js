import db from "../models/index";
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })

    } catch (e) {
        console.log(e)
    }

}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send('successfully');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        //check user data not found

        //let userData
        return res.render('editCRUD.ejs', {
            userData
        });
    } else {
        return res.send("Users not found")
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.send('update done!');
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        await CRUDService.deleteUserData(userId);
        return res.send('Delete the user succed');
    } else {
        return res.send("Users not found");
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};