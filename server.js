//used for printing colors in console.log
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const { syncAndSeed, models: {  User, Sale, Car} } = require('./db');

const app = express();
app.use(express.json());

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/sales', async(req, res, next)=> {
  try {
    res.status(201).send(await Sale.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/sales/:id', async(req, res, next)=> {
  try {
    const sale = await Sale.findByPk(req.params.id); 
    await sale.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/cars', async(req, res, next)=> {
  try {
    res.send(await Car.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/sales', async(req, res, next)=> {
  try {
    res.send(await Sale.findAll());
  }
  catch(ex){
    next(ex);
  }
});


const init = async()=> {
  try {
    if(process.env.SEED === 'true'){
      await syncAndSeed();
    }
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(chalk.green(`listening on port ${port}`)));
  }
  catch(ex){
    console.log(chalk.red(ex.message));
  }
};

init();
