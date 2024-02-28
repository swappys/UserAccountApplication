import User from '../models/user';
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
    
    //If the user exists in the database then compare the password
    user.comparePasswords(password, (err,match)=>{
        if(!match || err) return res.status(400).send("Wrong password");

    });
}catch(err){
    console.log("THERE WAS AN ERROR IN LOGGING IN", err);
    res.status(400).send("Signin Failed");
}

}