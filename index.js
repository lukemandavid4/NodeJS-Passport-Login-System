if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require(`express`)
const bcrypt = require(`bcrypt`)
const path = require(`path`)
const app = express()
const flash = require(`express-flash`)
const session = require(`express-session`)
const passport = require(`passport`)
const initializePassport = require(`./passport-config`) /888338882
initializePassport(passport, email =>{
  users.find(user => user.email === email)
  id => users.find(user => user.id === id)
})
const users = [] 

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}))
app.use(express.json()) 
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.get(`/`, (req, res) =>{
  res.render('index.ejs')
})
app.get(`/login`, (req, res) =>{
  res.render('login.ejs')
})
app.post(`/login`, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login', 
  failureFlash: true
}))

app.get(`/register`, (req, res) =>{
  res.render('register.ejs')
})
app.post(`/register`, async (req, res) =>{
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect(`/login`)
  }catch{
    res.redirect(`/register`)
  }
  console.log(users)
})

const port = process.env.PORT || 3000
app.listen(port, () =>{
  console.log(`Running on port ${port}...`)
})