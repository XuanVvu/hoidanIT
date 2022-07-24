
import db from "../models/index";
let getHomePage = async (req, res) => {
    let data = await db.user.findAll();
    return res.render('homepage.ejs')
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage
};