require('dotenv').config
var express = require('express');
var router = express.Router();
const jwtDecode = require('jsonwebtoken').decode;
var axios = require('axios')
var api_url = process.env.API_URL


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', async function(req, res, next) {

  const { email, password } = req.body;

  try {
    const response = await axios.post(`${api_url}/route/login`, {
      email,
      password,
    });

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    const token = response.data.myJwtToken.token;
    const decodedToken = jwtDecode(token);

    const role = decodedToken[roleClaim];
    const name = decodedToken[nameClaim];

    console.log('Role:', role);
    console.log('UserName:', name);
    console.log('Decoded Token:', decodedToken);
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

module.exports = router;
