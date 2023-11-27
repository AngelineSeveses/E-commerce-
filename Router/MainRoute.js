const express = require('express');
const controller = require('../MainController/MainController')
const myroute = express.Router();
const path = require('path'); 
const multer = require('multer');

const storage = multer.diskStorage({
    // image path for uploaded image
    destination:(req, file, cb)=>{
        cb(null, './public/images')
    },
    //getting the file name 
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

const redirection = (req,res,next)=>{
    if(!req.session.username){
        res.redirect('/');
    }
    else{
        next();
    }
}
const adredirection = (req,res,next)=>{
    if((!req.session.username) &&(req.session.usertype != 'admin')){
        res.redirect('/');
    }
    else{
        next();
    }
}

myroute.get('/',controller.login);
myroute.get('/mycart',controller.mycart);
myroute.get('/adminhome',adredirection,controller.adminhome);
myroute.post('/adminhome',adredirection,upload.single("image"),controller.postadminhome);
myroute.post('/getitemedit/adminhome',adredirection,upload.single("image"),controller.postadminhome);
myroute.post('/',controller.postlogin);
myroute.get('/signup',controller.signup);
myroute.post('/signup',controller.postsignup);
myroute.post('/getitemedit/postsaveedit',upload.single("image"),controller.postsaveedit);
myroute.get('/verified/:email',controller.verified);
myroute.get('/resetpassword',controller.resetpassword);
myroute.post('/resetpassword',controller.postresetpassword);
myroute.get('/resetlinkpassword/:email',controller.resetlinkpassword);
myroute.post('/newpassword',controller.newpassword);
myroute.post('/addcategory',controller.addcategory);
myroute.get('/homepage',redirection,controller.homepage);
myroute.get('/logout',controller.logout);
myroute.get('/listofbuyitem',controller.listofbuyitem);
myroute.get('/getitemedit/:id',controller.getitemedit);
myroute.get('/getremoveid/:id/:image',controller.getremoveid);
myroute.get('/featured/:id',controller.featured);
myroute.get('/unfeatured/:id',controller.unfeatured);
myroute.get('/removecategory/:id',controller.removecategory);
myroute.get('/unrestrictaccount/:id',controller.unrestrictaccount);
myroute.get('/restrictaccount/:id',controller.restrictaccount);
myroute.get('/shop',controller.shop);
myroute.get('/users',controller.users);
myroute.get('/prod_view/:id',controller.prod_view);
myroute.get('/approveorder/:id',controller.approveorder);
myroute.get('/declineorder/:id',controller.declineorder);
myroute.get('/finalize/:id',controller.finalize);
myroute.get('/adminremove/:id',controller.adminremove);
myroute.get('/toclaim/:id',controller.toclaim);
myroute.get('/donebuy/:id',controller.donebuy);
myroute.get('/removetocart/:id',controller.removetocart);
myroute.get('/shopbycategory/:id',controller.shopbycategory);
myroute.post('/useraddtocart',controller.useraddtocart);
myroute.post('/searchbydesc',controller.searchbydesc);

module.exports= myroute;