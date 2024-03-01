import User from '../models/user';
import jwt from 'jsonwebtoken';


export const register = async(req, res)=>{
    console.log(req.body);
    const{firstName, lastName, password, email}= req.body;

    //validation of user input
    if(!firstName) return res.status(400).send("Name is required");
    if(!password || password.length < 6)
        return res
            .status(400)
            .send("Password is required and should be min 6 characters long");
    

    let userExist = await User.findOne({email}).exec();
    if(userExist) return res.status(400).send('Email is taken');

    //register user if not exist
    const user = new User(req.body);
    try{
        await user.save();
        console.log('USER CREATED', user);
        return res.json({ok:true});
    } catch(err){
        console.log('CREATION OF THE USER HAS FAILED',err);
        return res.status(400).send('Error. Try registering again');
    }    
}

export const login = async(req, res)=>{
    const{email, password}= req.body; //destructuring email and password from the request body
try{

    //First check if the user with the email provided exists
    let user = await User.findOne({email}).exec();
    if(!user) return res.status(400).send("User with that email was not found");

    //retrieve date from the database
    const storedDate = user.passwordChangeDate;
    //capture the current date
    const currentDate = new Date();
   
    /**  Set time to midnight for both currentDate and storedDate to consider only the 
     * Date component without time.   
    */
    storedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    /**
     * calculate the difference in milliseconds to get the difference and then
     * check if it is less than the allowed limit, if not then ask user to change the
     * password for them to successfully login
     */
    const dateDifference = currentDate - storedDate;

    // convert milliseconds to days
    const daysDifference = Math.floor(dateDifference / (1000 * 60 * 60 * 24));
   
    if(daysDifference>30){
        return res.status(400).send("Please consider changing your password to access the system");
    }
    
    //If the user exists in the database then compare the password
    user.comparePasswords(password, (err,match)=>{
        if(!match || err) return res.status(400).send("Wrong password");
    //If the passwords match, generate a JWT token and send to as a response
        let token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{
           expiresIn: '7d' 
        });
        res.json({token, user:{
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }});
    });
}catch(err){
    console.log("THERE WAS AN ERROR IN LOGGING IN", err);
    res.status(400).send("Signin Failed");
}
}


export const getAllUsers = async(req, res)=>{
    try{
    //Find all the users in the database
    let users = await User.find();
    res.send(users);
    } catch(err){
        console.log("THERE WAS SOME ISSUE IN GETTING THE USERS");
        res.status(400).send("Users fetch failed");
    }
}

export const updateUser = async(req, res)=>{
    try{
    let userId = req.params.id;
    let updateBody = req.body;
    console.log(userId);
    // Find the user in the database and then store it in user field
    const user = await User.findById(userId);

    if(!user) return res.status(400).send("User with that id was not found");

    //update the user properties and save the user 
    if(updateBody.email) user.email = updateBody.email;
    if(updateBody.firstName) user.firstName = updateBody.firstName;
    if(updateBody.lastName) user.lastName = updateBody.lastName;
    if(updateBody.password) user.password = updateBody.password;

    let userSaved = await user.save();
    console.log(userSaved)

    res.json({ok:true});
    }
    catch(err){
        console.log("THERE WAS SOME ISSUE IN UPDATING THE USER");
        res.status(400).send(`User update failed`);
    }

}

export const deleteUser = async(req, res)=>{
    try{
        let userId = req.params.id;
        //Get the user details from the database using the id
        const deletedUser = await User.findByIdAndDelete(userId);
    
        if(!deletedUser) return res.status(400).send("User with that id was not found");
    
        res.status(200).send(`User deleted`);
        }
        catch(err){
            console.log("THERE WAS SOME ISSUE IN DELETING THE USER");
            res.status(400).send(`User delete failed`);
        }
}




