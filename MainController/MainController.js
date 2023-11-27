const con = require('../Connection/Dbconnection');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');  
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "kcnisperos25@gmail.com",
      pass: "crheaxzjbuiqpnbn",
    }
  });

login = (req, res)=>{
    const message = req.flash("message");
    res.render('Pages/index',{message});
}
signup = (req, res)=>{
    res.render('Pages/signup');
}
postsignup = (req, res)=>{
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;

    var v_key = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;

    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    let thisdate = cYear+"-"+cMonth+"-"+cDay;
    
    for ( var i = 0; i < 20; i++ ) {
        v_key += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const sql = "INSERT INTO `users` (`user_id`, `fullname`, `email`, `password_hash`, `is_verified`, `verification_key`, `date_created`, `usertype`) VALUES (NULL, ? , ?, ?, ?, ?, ?,?)";
    
    bcrypt.hash(password, 10, function(err, hash) {  
        con.query(sql,[fullname,email, hash, 0,v_key,thisdate ,"user"])

        var mailOptions = {
                    from: '"Kevin Nisperos?" <kcnisperos25@gmail.com>',
                    to: email,
                    subject: 'Verification Code ✔',
                    text: 'Click The Link To Verify Your Account. http://localhost:5000/verified/'+email
                };
                
            
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    
                });
                req.flash("message", "Registered successfully! Check Your Email To Verify Your Account!");
        res.redirect("/");
     });  
}
verified = (req,res)=>{
    const email = req.params.email;
    const sql = "UPDATE `users` SET `is_verified` = ? WHERE `users`.`email` = ?";
    con.query(sql,[1,email]);

    req.flash("message", "Your Account "+ email + " is now Verified!");
    res.redirect("/")
}
postlogin = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    let status = 0;

    const sql = "SELECT * FROM `users` WHERE email = ?";
    con.query(sql,email,(err,result)=>{
        status = result[0].is_verified;
        bcrypt.compare(password, result[0].password_hash, function(err, match) {
            if(match){
                if(status == 0){
                    req.flash("message", "Account Not Verified");
                    res.redirect("/");
                }
                else if(status == 2){
                    req.flash("message", "Requested Password Reset");
                    res.redirect("/");
                }
                else{
                    if(result[0].restriction == 0){
                        req.session.username = result[0].fullname;
                        req.session.usertype = result[0].usertype;
                        req.session.email = result[0].email;
                        if(result[0].usertype == 'admin'){
                            res.redirect('adminhome');
                        }else{
                            res.redirect('homepage');
                        }
                    }
                    else{
                        req.flash("message", "Your Account has been restricted");
                        res.redirect("/");
                    }
                }
            }
            else{
                req.flash("message", "Check Username And Password!");
                res.redirect("/");
            }
        });
    });
}
resetpassword = (req, res)=>{
    const message = req.flash("message");
    res.render('Pages/resetpassword',{message})
}
postresetpassword = (req, res)=>{
    const email = req.body.email;

    var v_key = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;

    const sql = "SELECT * FROM `users` WHERE email = ?";
    con.query(sql,email,(err,result)=>{
        if(result.length > 0){

            for ( var i = 0; i < 20; i++ ) {
                v_key += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            const sql = "UPDATE `users` SET `is_verified` = ?, verification_key = ? WHERE `users`.`email` = ?";
            con.query(sql,[2,v_key,email]);
                
    
            var mailOptions = {
                        from: '"Kevin Nisperos?" <kcnisperos25@gmail.com>',
                        to: email,
                        subject: 'Verification Code ✔',
                        text: 'Reset Password',
                        html: "<p>Verification Code: <b> "+v_key+"</b> </p><p>Click The Link To Reset Your Password. http://localhost:5000/resetlinkpassword/"+email+"</p>"
                    };
                    
                
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        
                    });
        
            req.flash("message", "Check Your email for Password Reset Link & Verification code");
            res.redirect('resetpassword');
        }else{
            req.flash("message", "Email Not found!");
            res.redirect('resetpassword');
        }
    });
}
resetlinkpassword = (req,res)=>{
    const email = req.params.email;
    const message = req.flash("message");
    res.render("Pages/newpassword",{message,email});
}
newpassword = (req,res)=>{
    const email = req.body.email;
    const v_code = req.body.v_code;
    const password = req.body.password;

    const sql = "SELECT * FROM `users` WHERE email = ?";
    con.query(sql,email,(err,result)=>{
        if(result[0].verification_key == v_code){
            const updatesql = "update `users` set `is_verified` = ? , `password_hash` = ? WHERE `email` = ?";

            bcrypt.hash(password, 10, function(err, hash) {  
                con.query(updatesql,[1,hash,email]);
                req.flash("message", "Password Reset Successfully!");
            res.redirect('/');
            });

        }
        else{
            req.flash("message", "Verification Code Not Match!");
            res.redirect('resetlinkpassword/'+email);
        }
    });

}
homepage = (req, res)=>{
    const name = req.session.username;
    const sql="SELECT * FROM `item` where `featured`=?";
    con.query(sql,[1],(err, result)=>{
        res.render('Pages/homepage',{name,output:result});
    })
}
shop = (req, res)=>{
    const name = req.session.username;
    const message = req.flash("message");
    const sql="SELECT * FROM `item`";
    const sql1="SELECT * FROM `category`";
    con.query(sql,(err, result)=>{
        con.query(sql1,(err, result1)=>{
            res.render('Pages/shop',{name,output:result,message,cats:result1});
        })
    })
}

logout = (req, res)=>{
    req.session.destroy();
    res.redirect('/');
}

//

adminhome = (req,res)=>{
    const message = req.flash("message");
    const sql = "SELECT * FROM `item`";
    const sql1 = "SELECT * FROM `category`";
    con.query(sql,(err,result)=>{
        con.query(sql1,(err,result1)=>{
            res.render('Pages/Admin/dash',{allitem:result,category:result1,message});
        });
    });
}
postadminhome = (req,res)=>{
    const Image = res.req.file.filename;
    const p_name = req.body.p_name; 
    const p_desc = req.body.p_desc; 
    const category = req.body.category; 
    const price = req.body.price; 
    const quantity = req.body.quantity; 
    const sql = "INSERT INTO `item` (`id`, `image`, `title`, `description`, `category`, `price`, `featured`, `quantity`) VALUES (NULL,?,?,?,?,?,?,?)";
    con.query(sql,[Image,p_name,p_desc,category,price,0,quantity],(err)=>{
        req.flash("message", "Product Added Successfully!");
        res.redirect('/adminhome')
    })
}
getitemedit = (req,res)=>{
    const message = req.flash("message");
    const id = req.params.id;
    const sql ="SELECT * FROM `item`";
    const edit ="SELECT * FROM `item` WHERE id = ?";
    const sql1 = "SELECT * FROM `category`";
    con.query(sql,(err, result)=>{
        con.query(sql1,(err, result1)=>{
            con.query(edit,[id],(err, result2)=>{
                res.render('Pages/Admin/edititem',{allitem:result,message,category:result1,result2});
            });
        });
    });
}
postsaveedit = (req,res)=>{
    const Image = res.req.file.filename;
    const p_name = req.body.p_name; 
    const p_desc = req.body.p_desc; 
    const category = req.body.category; 
    const price = req.body.price; 
    const quantity = req.body.quantity; 
    const mid = req.body.mid; 
    const old_image = req.body.old_image; 
    sql = "UPDATE `item` SET `image` = ?, `title` = ?, `description` = ?, `category` = ?, `price` = ?, `quantity` = ? WHERE `item`.`id`=?";
    con.query(sql,[Image,p_name,p_desc,category,price,quantity,mid])
    fs.unlink("./public/images/"+old_image,()=>{});
    req.flash("message", "Product Updated Successfully!");
    res.redirect('/adminhome');
}
getremoveid = (req,res)=>{
    id = req.params.id;
    image = req.params.image;
    
    const sql = "DELETE FROM `item` WHERE id = ?";
    con.query(sql,[id]);
    fs.unlink("./public/images/"+image,()=>{});
    req.flash("message", "Product Deleted Successfully!");
    res.redirect('/adminhome');
}
featured = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `item` SET `featured` = ? WHERE `item`.`id` = ?";
    con.query(sql,[1,id]);
    req.flash("message", "Product id now on Featured Items!");
    res.redirect('/adminhome');
    
}
unfeatured = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `item` SET `featured` = ? WHERE `item`.`id` = ?";
    con.query(sql,[0,id]);
    req.flash("message", "Product Unfeatured!");
    res.redirect('/adminhome');
}

removecategory = (req, res) =>{
    const id = req.params.id;
    const sql = "DELETE FROM `category` WHERE id = ?";
    con.query(sql,[id])
    req.flash("message", "Category Rmoved!");
    res.redirect('/adminhome');
}

addcategory = (req, res)=>{
    const category = req.body.category;
    const sql = "INSERT INTO `category` (`id`, `name`) VALUES (NULL, ?)";
    con.query(sql,[category]);
    req.flash("message", "New Category addded!");
    res.redirect('/adminhome');
}
users = (req,res)=>{
    const message = req.flash("message");
    const sql = "SELECT * FROM `users` WHERE usertype = ?";
    const sql1 = "SELECT * FROM `category`";
    con.query(sql,["user"],(err,result)=>{
        con.query(sql1,(err,result1)=>{
            res.render('Pages/Admin/users',{alluser:result,category:result1,message});
        });
    });
}
restrictaccount = (req, res) =>{
    const id = req.params.id;
    const sql = "UPDATE `users` SET `restriction` = ? WHERE `users`.`user_id` = ?"
    con.query(sql,[1,id]);
    req.flash("message", "Account Resctrict!");
    res.redirect('/users');
}

unrestrictaccount = (req, res) =>{
    const id = req.params.id;
    const sql = "UPDATE `users` SET `restriction` = ? WHERE `users`.`user_id` = ?"
    con.query(sql,[0,id]);
    req.flash("message", "Account Unresctrict!");
    res.redirect('/users');
}
prod_view = (req, res) =>{
    const id = req.params.id;
    const sql = "SELECT * FROM `item`  WHERE id = ?";
    con.query(sql,[id],(err, result)=>{
        res.render("Pages/productview", {myresult:result});
    })
}
useraddtocart = (req, res)=>{
    const email = req.session.email;
    const qty = req.body.qty;
    const iid = req.body.iid;

    const sql = "SELECT * FROM `item` WHERE id = ?";
    con.query(sql,[iid],(err,result)=>{
        const all = result[0].quantity - qty;
        const price = result[0].price
        const image = result[0].image
        if (all < 0){
            req.flash("message", "Not enough stocks!");
            res.redirect('/shop');
        }else{
            const sql1 = "Update `item` SET  quantity =? WHERE id = ?"
            con.query(sql1,[all,iid],(err)=>{
                if(err){
                    res.send("<h1>error</h1>")
                }
                else{
                    const sql2 = "INSERT INTO `buy` (`id`, `item_id`, `user_email`, `quantity`, `status` , `image`, `price`) VALUES (NULL, ?, ?, ?,?,?,?)";
                    con.query(sql2,[iid,email,qty,"cart",image,price],(err)=>{
                        if (err){
                            res.send(err);
                        }
                        else{
                            req.flash("message", "Product Purchased Successfully!");
                            res.redirect('/shop');
                        }
                    });
                    
                }
            })
            
        }

        
    })
}
mycart = (req, res)=>{
    const message = req.flash("message");
    const sql = "SELECT * FROM `buy` where `user_email` = ?";
    const email = req.session.email;
    con.query(sql,[email],(err,result)=>{
        res.render('Pages/mycart',{myc:result,message});
    })
    
}
removetocart = (req,res) =>{
    const id = req.params.id;
    const sql = "DELETE FROM `buy` where `id` = ?";
    con.query(sql,[id]);
    req.flash("message", "Product remove  Successfully!");
    res.redirect('/shop');
}
finalize = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `buy` SET status = ? Where id = ?";
    con.query(sql,["pending", id]);
    req.flash("message", "Product Place Order Successfully!");
    res.redirect('/shop');
}
listofbuyitem = (req, res) => {
    const message = req.flash("message");
    const sql ="SELECT * FROM `buy` WHERE `status` NOT LIKE 'cart' ";
    con.query(sql,(err,result)=>{
        res.render('Pages/Admin/listbuyedproduct',{message,allitem:result});
    })
    
}
approveorder = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `buy` SET status = ? Where id = ?";
    con.query(sql,["approve", id]);
    req.flash("message", "Item Approved Successfully!");
    res.redirect('/listofbuyitem');

}
declineorder = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `buy` SET status = ? Where id = ?";
    con.query(sql,["Cancelled", id]);
    req.flash("message", "Item Declined!");
    res.redirect('/listofbuyitem');

}
toclaim = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `buy` SET status = ? Where id = ?";
    con.query(sql,["to claim", id]);
    req.flash("message", "Item ready to calim!");
    res.redirect('/listofbuyitem');

}
donebuy = (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE `buy` SET status = ? Where id = ?";
    con.query(sql,["done", id]);
    req.flash("message", "Itemclaimed!");
    res.redirect('/listofbuyitem');

}
adminremove = (req,res) =>{
    const id = req.params.id;
    const sql = "DELETE FROM `buy` where `id` = ?";
    con.query(sql,[id]);
    req.flash("message", "Product remove  Successfully!");
    res.redirect('/listofbuyitem');
}
shopbycategory = (req, res)=>{
    const mycat = req.params.id;
    const name = req.session.username;
    const message = req.flash("message");
    const sql="SELECT * FROM `item` WHERE category = ?";
    const sql1="SELECT * FROM `category`";
    con.query(sql,[mycat],(err, result)=>{
        con.query(sql1,(err, result1)=>{
            res.render('Pages/prodbybutton',{name,output:result,message,cats:result1});
        })
    })
}

searchbydesc = (req, res)=>{
    const mycat = req.body.search;
    const name = req.session.username;
    const message = req.flash("message");
    const sql="SELECT * FROM `item` WHERE description LIKE '%" +mycat +"%'";
    const sql1="SELECT * FROM `category`";
    con.query(sql,(err, result)=>{
        con.query(sql1,(err, result1)=>{
            res.render('Pages/prodbybutton',{name,output:result,message,cats:result1});
        })
    })
}
module.exports ={
    finalize,
    searchbydesc,
    shopbycategory,
    donebuy,
    toclaim,
    adminremove,
    declineorder,
    approveorder,
    listofbuyitem,
    removetocart,
    mycart,
    useraddtocart,
    prod_view,
    unrestrictaccount,
    restrictaccount,
    users,
    addcategory,
    login,
    signup,
    postsignup,
    verified,
    postlogin,
    resetpassword,
    postresetpassword,
    resetlinkpassword,
    newpassword,
    homepage,
    logout,
    adminhome,
    postadminhome,
    getitemedit,
    getremoveid,
    postsaveedit,
    featured,
    unfeatured,
    removecategory,
    shop
}