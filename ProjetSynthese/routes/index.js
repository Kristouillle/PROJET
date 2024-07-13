require('dotenv').config
var express = require('express');
var router = express.Router();
const jwtDecode = require('jsonwebtoken').decode;
var axios = require('axios')
var api_url = process.env.API_URL


/***Moke for featureA1 delete when the project is over***/
router.get('/moke', function(req,res,next){
  res.render('moke')
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


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
    if (cookies && cookies.length > 0) {
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
      secure: false, // switch to true when we have a domain and a certificate
      sameSite: 'Strict',
      maxAge: 45 * 1000 
    }

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

    res.append('Set-Cookie', `xxx-Oauth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${cookieOptions.maxAge / 1000}`);
    res.redirect('/');
  } catch (error) {
    console.error('An error occurred during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

/***Register***/
router.post('/register', async function(req, res, next){
  try {
    const {firstName, lastName, username , email ,passwordHash, phoneNumber} = req.body;
    console.log({firstName, lastName, username , email ,passwordHash, phoneNumber})

    const response = await axios.post(`${api_url}/user/register`, {
      firstName,
      lastName,
      username,
      email,
      passwordHash,
      phoneNumber
    }); 

    res.redirect('/moke')
  } catch (error) {
    console.error('Logout error:', error);
    next(error); 
  }
})

/***LOG OUT***/
/// Summary
/// The main purpose of this function is to 
/// delete all tokens and cookie from the API and the webApp.
router.post('/logout', async function (req, res, next) {
  try {
    // Retrieve cookie value from the request
    const token = req.cookies['xxx-Oauth'];
    
    if (token) {
      await axios.post(`${api_url}/route/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Redirect the user to the '/moke' route until the real end point is finish
    res.clearCookie('xxx-Oauth');
    res.clearCookie('xxx-OauthR');
    res.redirect('/moke');
    
  } catch (error) {
    console.error('Logout error:', error);
    next(error); 
  }
});


module.exports = router;
