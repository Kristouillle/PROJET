require('dotenv').config
var express = require('express');
var router = express.Router();
const jwtDecode = require('jsonwebtoken').decode;
var axios = require('axios')
var api_url = process.env.API_URL

//moke page need to be replace with a cute page every time you see one!!!!

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/reset_password', function(req,res,next){
  res.render('moke')
})


router.post('/login', async function(req, res, next) {

  const { email, password } = req.body;
  try {
    const response = await axios.post(`${api_url}/route/login`, {
      email,
      password
    }, {
      withCredentials: true 
    });

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      cookies.forEach(cookie => {
        res.append('Set-Cookie', cookie);
      });
    }

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    const token = response.data.myJwtToken.token;
    const decodedToken = jwtDecode(token);

    const role = decodedToken[roleClaim];
    const name = decodedToken[nameClaim];

    console.log('Role:', role);
    console.log('UserName:', name);
    console.log('Decoded Token:', decodedToken);

    const cookieOptions = {
      httpOnly: true,
      secure: false, // switch to true when we have a domaine and a certificat
      sameSite: `strict`,
      maxAge: 45 // we need to find a balance in time for production
    }

    res.append('Set-Cookie', `xxx-Oauth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${cookieOptions.maxAge}`);
    
    /*
    // Redirection based on role
    if (role === 'admin') {
      console.log('Redirect to /admin');
      res.redirect('/admin');
    } else if (role === 'user' || role === 'member') {
      console.log('Redirect to /user');
      res.redirect('/user');
    } else if (role === 'mod') {
      console.log('Redirect to /mod');
      res.redirect('/mod');
    } else {
      console.log('Unknown role, handle accordingly.');
      res.status(400).send('Unknown role, handle accordingly.');
    }
    */
   res.redirect('/')
  } catch (error) {
    console.error('An error occurred during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

router.post('/register', async function(req,res,next){
  const {firstName, lastName, username,email, passwordHash, phoneNumber} = req.body;

  try{
     console.log(firstName)
     console.log(lastName)
     console.log(username)
     console.log(email)
     console.log(passwordHash)
     console.log(phoneNumber)
     const response = await axios.post(`${api_url}/user/Register`,
      {
        firstName,
        lastName,
        username,
        email,
        passwordHash,
        phoneNumber
      })
      //Change the button to let know the client is demande is loading
      res.render('moke')
  }catch(error){
    console.error('An error occurred during login:', error);
    res.status(500).send('Seems like you incurred an error while creating a new user.');
  }

});

router.post('/logout',async function(req,res,next){
  //const response = await axios.post(`${api_url}/Route/LogOut`)
  res.clearCookie('RefreshToken');
  res.clearCookie('xxx-Oauth');
  res.redirect('/');
})

module.exports = router;
