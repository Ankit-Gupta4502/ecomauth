const app = require("express")();
const db = require("./db/db")
const bodyParser = require("body-parser");
const ecomUser = require("./db/ecomUser");
app.use(bodyParser.json())
const cors = require("cors")
app.use(cors())

app.use((req, res, next) => {
    const allowedOrigins = ['https://ecom-front-taupe.vercel.app/login', 'http://localhost:3000',];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return next();
  });
const { body, validationResult } = require('express-validator');
const formatErr = (err) => {
    const errors = {}
    err.forEach((item) => {
        errors[item.param] = item.msg
    })
    return errors
}
const validateLogin = (req, res) => {
    return [
        body('email').not().isEmpty().isEmail(),
        body('password').not().isEmpty().withMessage("Password is required")
    ]
}
app.post('/login', validateLogin(), async (req, res) => {
    const { email, password, } = req.body
    try {
        const validateErr = validationResult(req)
        const errors = formatErr(validationResult(req).array());
        console.log(validateErr);
        if (!validateErr.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        else {
            const user = await ecomUser.findOne({
                email,
            })
            ;
            if (!Object.keys(user).length) {
                return res.status(200).send({ message: "User not registered", user })
            }if(password!==user.password){
                return res.status(400).send({ message: "Please Enter Correct Password" })
            }else{
                return res.status(200).send({ message: "Login Successful",user})
            }
            
        }

    } catch (error) {
        return res.status(400).send({ message: "Something went wrong", error })
    }
})

const validateRegister = (req, res) => {
    return [body('email').isEmail().withMessage("Email is required"),
    body('password').not().isEmpty().withMessage("Password is required"), body('name').not().isEmpty().withMessage("Name is required"), body('password_confirmation').not().isEmpty().withMessage("Confirm Password is required")]

}
app.post("/register", validateRegister(), async (req, res) => {
    const { name, email, password, password_confirmation } = req.body
    const validateErr = validationResult(req)
    const errors = formatErr(validationResult(req).array())
    // console.log(errors);
    if (!validateErr.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }
    try {
        if (password_confirmation !== password) {
            return res.status(400).send({ message: "Password does not match" })
        } else {
            const user = await ecomUser.create({
                name,
                password,
                email
            })
            return res.status(200).send({ message: "User registered successfully", user })
        }
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong", error })
    }
})
app.listen(8000, () => console.log("Listening on 8000"))