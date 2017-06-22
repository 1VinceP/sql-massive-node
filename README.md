<img src="https://devmounta.in/img/logowhiteblue.png" width="250" align="right">

# Project Summary

In this project, we are going to make our first full CRUD back-end that uses a database.

## Step 1

### Summary

In this step. we are going to create a bare-bones server.

### Instructions

* Run `npm init -y`.
* Use npm to install and save `express`, `body-parser`, `cors`, and `massive`.
* Create a `.gitignore` to ignore the `node_modules` folder.
* Create an `index.js` file.
* Require all the packages that we installed and saved.
* Get your server listening on port `3000`.

### Solution

<details>

<summary> <code> .gitignore </code> </summary>

```
node_modules
```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');

const app = express();

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
```

</details>

## Step 2

### Summary

In this step, we are going to add massive to the server so we can connect to a database.

### Instructions

* Create a `connectionString` variable that connects to the `sandbox` database. 
  * Create the `sanbox` database if it doesn't exist.
* Use `massive` and the `connectionString` to establish a connection.
* In the `.then` callback from `massive`, set `db` on app to equal the database instance.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://username:password@localhost/sandbox";

const app = express();
massive( connectionString ).then( dbInstance => app.set('db', dbInstance) );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
```

</details>

## Step 3

### Summary

In this step, we are going to create our table and the `.sql` files we'll need to preform operations on our data. The schema for our table will look like:

* ID - Serial Primary Key
* Name - varchar(40)
* Description - varchar(80)
* Price - integer
* Imageurl - text

### Instructions

* Create a `Products` table in the `sandbox` database.
* Create a folder called `db`.
  * Create a `create_product.sql` file.
  * Create a `read_products.sql` file.
  * Create a `read_product.sql` file.
  * Create a `update_product.sql` file.
  * Create a `delete_product.sql` file.
* `create_product.sql`:
  * Should be able to add a new product to the `Products` table.
  * Should have four parameters ( Name, Description, Price, ImageUrl ).
* `read_products.sql`:
  * Should be able to return all products from the `Products` table.
* `read_product.sql`:
  * Should be able to returna a specific product from the `Products` table.
  * Should use a parameter to find the product whose `ProductID` matches.
* `update_product.sql`:
  * Should be able to update the description of a specific product from the `Products` table.
  * Should use a parameter to find the product whose `ProductID` matches.
  * Should use a parameter to update the value of the `Description`.
* `delete_product.sql`:
  * Should be able to delete a specific product from the `Products` table.
  * Should use a parameter to find the product whose `ProductID` matches.

### Solution

<details>

<summary> <code> CREATE TABLE Products </code> </summary>

```sql
CREATE TABLE Products (
  ProductID SERIAL PRIMARY KEY NOT NULL,
  Name varchar(40) NOT NULL,
  Description varchar(80) NOT NULL,
  Price integer NOT NULL,
  ImageUrl text NOT NULL
);
```

</details>

<details>

<summary> <code> SQL </code> </summary>

<details>

<summary> <code> create_product.sql </code> </summary>

```sql
INSERT INTO Products ( Name, Description, Price, ImageUrl ) VALUES ( $1, $2, $3, $4 );
```

</details>

<details>

<summary> <code> read_products.sql </code> </summary>

```sql
SELECT * FROM Products;
```

</details>

<details>

<summary> <code> read_product.sql </code> </summary>

```sql
SELECT * FROM Products WHERE ProductID = $1;
```

</details>

<details>

<summary> <code> update_product.sql </code> </summary>

```sql
UPDATE Products SET Description = $2 WHERE ProductID = $1;
```

</details>

<details>

<summary> <code> delete_product.sql </code> </summary>

```sql
DELETE FROM Products WHERE ProductID = $1;
```

</details>

</details>


## Step 4

### Summary

In this step, we will export our `app` so we can create a controller that will use the database instance.

### Instructions

* Use `module.exports` to export `app`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://username:password@localhost/sandbox";

const app = module.exports = express();
massive( connectionString ).then( dbInstance => app.set('db', dbInstance) );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
```

</details>

## Step 5

### Summary

In this step, we will create a `products_controoler.js` file to will handle the logic of interacting with the database.

### Instructions

* Create a `products_controller.js` file.
* Use `module.exports` to export an object with five methods.
  * `create`, `getOne`, `getAll`, `update`, and `delete`.
* Inside of each method, access the database instance.
* Inside of each method use the correct SQL file.
  * `create` -> `create_product.sql`.
  * `getOne` -> `read_product.sql`.
  * `getAll` -> `read_products.sql`.
  * `update` -> `update_product.sql`.
  * `delete` -> `delete_product.sql`.
* Don't worry about the parameter(s) in this step.
* `create`, `update`, and `delete` should send status 200 on success and status 500 on failure.
* `getOne` should send status 200 and the product on success and status 500 on failure.
* `getAll` should send status 200 and the products on success and status 500 on failure.

### Solution

<details>

<summary> <code> products_controller.js </code> </summary>

```js
module.exports = {
  create: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.create_product()
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  },

  getOne: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.read_product()
      .then( product => res.status(200).send( product ) )
      .catch( () => res.status(500).send() );
  },

  getAll: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.read_products()
      .then( products => res.status(200).send( products ) )
      .catch( () => res.status(500).send() );
  },

  update: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.update_product()
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  },

  delete: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.delete_product()
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  }
};
```

</details>

## Step 6

### Summary

In this step, we will create endpoints that will call the methods on our controller. We will also require our controller in `index.js`.

### Instructions

* Create the following endpoints: ( `request method`, `url`, `controller method` )
  * `GET` - `/api/products` - `getAll`.
  * `GET` - `/api/product/:id` - `getOne`.
  * `PUT` - `/api/product/:id?desc=...` - `update`.
  * `POST` - `/api/product` - `create`.
  * `DELETE` - `/api/product/:id` - `delete`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://username:password@localhost/sandbox";
const pc = require('./products_controller');

const app = module.exports = express();
massive( connectionString ).then( dbInstance => app.set('db', dbInstance) );

app.post( '/api/product', pc.create );
app.get( '/api/products', pc.getAll );
app.get( '/api/product/:id', pc.getOne );
app.put( '/api/product/:id', pc.update );
app.delete( '/api/product/:id', pc.delete );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
```

</details>


## Step 7

### Summary

In this step, we'll modify the controller to use parameters.

### Instructions

* Open `products_controller.js`.
* Modify `update` to use `id` from `req.params` and `desc` from `req.query`.
* Modify `getOne` to use `id` from `req.params`.
* Modify `delete` to use `id` from `req.params`.

### Solution

<details>

<summary> <code> products_controller.js </code> </summary>

```js
module.exports = {
  create: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.create_product()
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  },

  getOne: ( req, res, next ) => {
    const dbInstance = req.app.get('db');
    const { params } = req; 

    dbInstance.read_product([ params.id ])
      .then( product => res.status(200).send( product ) )
      .catch( () => res.status(500).send() );
  },

  getAll: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.read_products()
      .then( products => res.status(200).send( products ) )
      .catch( () => res.status(500).send() );
  },

  update: ( req, res, next ) => {
    const dbInstance = req.app.get('db');
    const { params, query } = req;

    dbInstance.update_product([ params.id, query.desc ])
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  },

  delete: ( req, res, next ) => {
    const dbInstance = req.app.get('db');
    const { params } = req;

    dbInstance.delete_product([ params.id ])
      .then( () => res.status(200).send() )
      .catch( () => res.status(500).send() );
  }
};
```

</details>

## Step 8

### Summary

In this step, we'll test to make sure all the endpoint are working.

### Instructions

* Import the provided `postman_collection` into postman and make sure all the tests pass.

### Solution

<b> insert img here </b>

## Black Diamond

* Create a React front end to interact with your app.
* Use express static to serve up your React files from a build folder
* Create a single view that can insert, read, update, and delete products.
* Create a second view that just reads the products and displays them in a pretty way (like Jane.com or amazon).

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://devmounta.in/img/logowhiteblue.png" width="250">
</p>
