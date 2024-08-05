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

/***GET home page.***/
router.get('/', function(req, res, next) {
  res.render('index');
});

/***Login***/
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

/***LOG OUT *
* The main purpose of this function is to *
* delete all tokens and cookie from the API and the webApp.***/
router.post('/logout', async (req, res, next) => {
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

/***Render the admin settings page***/
router.get('/admin/settings', async (req, res, next) => {
  try { 
    const token = req.cookies['xxx-Oauth'];
    var allUsers = null;
    var allAppointments = null; 
    var allAvailability = null;
    var AllTherapy = null;
    if (token) {
      allUsers = await axios.post(`${api_url}/user/GetAllUsers`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      allAppointments = await axios.post(`${api_url}/appointment/GetAllAppointments`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      allAvailability = await axios.post(`${api_url}/Availability/ReadAvailability`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      
      AllTherapy = await axios.post(`${api_url}/therapy/ReadAllTherapy`, {}, {});
    }

    res.render('moke2', { users: allUsers.data.users , appointments: allAppointments.data.appointments, availabilities: allAvailability.data.availabilities, therapies: AllTherapy.data.therapies});
  } catch (error) {
    console.error(error); 
    next(error);
  }
});

/***Render the user settings page***/
router.get('/user/settings', async (req,res,next) => {
  try {
    const token = req.cookies['xxx-Oauth'];
    var response = null;
    var appointmentList = null;
    if (token) {
       response = await axios.post(`${api_url}/user/FindByUsername`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      appointmentList = await axios.post(`${api_url}/appointment/FindAppointmentByCookie`,{},{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    res.render('moke3', { user: response.data.users, appointments : appointmentList.data.appointments })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

/***Update a client***/
router.post('/user/Edit', async (req,res,next) => {
  try {
    const token = req.cookies['xxx-Oauth']
    const {id, firstName, lastName, userName, email, phoneNumber} = req.body
    console.log({id, firstName, lastName, userName, email, phoneNumber})
    if(token){
      const response = axios.post(`${api_url}/user/UpdateUser`,{id, firstName, lastName, userName, email, phoneNumber},{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
    }
    req.redirect('/')
  } catch (error) {
    console.log(error)
    next(error); 
  }
})

/***Edit Availability***/
router.post('/admin/edit_availability',async (req,res,next) =>{
  try {
    const token = req.cookies['xxx-Oauth']
    const {id2, therapistName2,availableDay2, availableTime2} = req.body
    if(token){
      const response = await axios.post(`${api_url}/availability/editavailability`,{
        id: id2,
        therapistName : therapistName2,
        availableDay : availableDay2,
        availableTime : `${availableTime2}:00`
      },{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Edit therapy***/
router.post('/admin/edit_therapy', async (req,res,next) => {
  try{
    const token = req.cookies['xxx-Oauth'];
    const {id, name, description, price} = req.body
    if(token){
      const response = await axios.post(`${api_url}/therapy/edittherapy`, {id, name, description, price},{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
    }
    res.redirect('/')
  }catch(error){
    console.log(error);
    next(error);
  }
})

router.post('/admin/add_availablity', async function(req,res,next){
  try{
    const token = req.cookies['xxx-Oauth']
    const { id, therapistName, availableDay, availableTime } = req.body;
  var response = null
  
  if(token){
   response = await axios.post(`${api_url}/availability/addavailability`,{
    id,
    therapistName,
    availableDay,
    availableTime: `${availableTime}:00`
   },{
      headers: {
        'Authorization': `Bearer ${token}`
       
      }
    });
  }
  res.redirect('/')
  }catch(error){
    console.error(error)
    next(error)
  }
})

router.post('/admin/add_therapy', async function(req,res,next){
  try {
    const token = req.cookies['xxx-Oauth']
    const {id , name, description, price } = req.body
    var response = null;
    if(token){
      response = await axios.post(`${api_url}/therapy/CreateTherapy`,{id , name, description, price },{
        headers: {
          'Authorization': `Bearer ${token}`
         
        }
      });
    }
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/admin/cancel_appointment', async function(req,res,next){
  try {
    const token = req.cookies['xxx-Oauth']
    var appointment = null
    const appointmentId = req.body.appointmentId
    console.log(appointmentId)
    if (token) {
      await axios.post(`${api_url}/Appointment/CancelAppointment`,  JSON.stringify(appointmentId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      return res.status(401).send("Unauthorized: No token provided.");
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post('/admin/delete_therapy', async function(req,res,next){
  try {
    const token = req.cookies['xxx-Oauth']
    const id = req.body.therapyId
    console.log(id)
    if(token){
      const response = await axios.post(`${api_url}/therapy/deletetherapy`,JSON.stringify(id),{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    res.redirect('/')
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
})

router.post('/admin/delete_availability', async function (req,res ,next){
  try {
    const token = req.cookies['xxx-Oauth']
    const id = req.body.availableId
    if(token){
      const response = await axios.post(`${api_url}/availability/deleteavailability`,JSON.stringify(id),{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
      res.redirect('/')
  } catch (error) {
    console.error(error);
    next(error)
  }
})

/***Delete client on admin side***/
router.post('/admin/delete_client', async function(req, res, next){
  try {
    const token = req.cookies['xxx-Oauth']
    const name = req.body.username
    if(token){
      const response = await axios.post(`${api_url}/user/deleteuser`,JSON.stringify(name), {
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Find appointment by name***/
router.post('/admin/findAppointmentByName', async function(req,res,next){
  try {
    const token = req.cookies['xxx-Oauth']
    const search = req.body
    if(token){
      const response = await axios.post(`${api_url}/appointment/FindAppointmentByUsername`,JSON.stringify(search.appointmentName), {
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.appointments)
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Find appointment by date***/
router.post('/admin/findAppointmentByDate', async function(req,res,next){
  try {
    const token = req.cookies['xxx-Oauth']
    const search = req.body.appointmentDate
    if(token){
      const response = await axios.post(`${api_url}/appointment/FindAppointmentByDatetime`,JSON.stringify(search),{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      })
      console.log(response)
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Find Therapy by name***/
router.post('/admin/FindTherapyByName', async function(req,res, next){
  try {
    const token = req.cookies['xxx-Oauth']
    const search = req.body.therapyName
    if(token){
      const response = await axios.post(`${api_url}/therapy/FindTherapyByName`,JSON.stringify(search),{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data.therapy)
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Find availability by therapist name***/
router.post('/admin/FindAvailabilityByTherapistName', async function(req,res, next){
  try {
    const token = req.cookies['xxx-Oauth']
    const search = req.body.therapistName
    if(token){
      const response = await axios.post(`${api_url}/availability/FindAvailabilityByTherapistName`,JSON.stringify(search),{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data)
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***Update User Email***/
router.post('/user/EditEmail', async function(req, res, next){
  try {
    const token = req.cookies['xxx-Oauth']
    const user = req.body
    console.log(user)
    if(token){
      const response = await axios.post(`${api_url}/user/UpdateEmail`, user , {
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    }
    res.redirect('/')
  }catch(error){
    console.log(error)
    next(error)
  }
})

/***Confirm Email***/
router.get('/confirm_email', async function(req,res,next){
  try {
    const userId = req.query.id
    const code = req.query.code
    if(userId && code){
      const response = await axios.post(`${api_url}/user/ConfirmUserEmail`,{UserId: userId, Code: code})
    }

    res.render('confirmEmail')
  } catch (error) {
    console.log(error)
    next(error)
  }
 
})

module.exports = router;
