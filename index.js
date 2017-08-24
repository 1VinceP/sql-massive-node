const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const massive = require('massive');
const controller = require('./products_controller');

let app = express();
app.use( bodyParser.json() );
app.use( cors() );

let port = 3000;

///////////// Connecting database
// postgres://[username]:[password]@[host]:[port]/[database]
massive( 'postgres://postgres:database@localhost:9000/sandbox' ).then( dbInstance => {
    app.set( 'db', dbInstance );
} )

app.post( '/api/product', controller.create )
app.get( '/api/products', controller.getAll )
app.get( '/api/product/:id', controller.getOne )
app.put( '/api/product/:id', controller.update )
app.delete( '/api/product/:id', controller.delete )

app.listen( port, () =>{
    console.log(`Eavesdropping on port ${port}`)
} )