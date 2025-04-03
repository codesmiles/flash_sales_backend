# ToDo

Implement a cache middleware
```js
const cache = (req, res, next) => {
  const { id } = req.params;

  client.get(id, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));  // Serve cached data
    } else {
      next();  // Proceed to the next middleware
    }
  });
};

app.get('/data/:id', cache, (req, res) ✅=> {
  // Simulate fetching data from a database
  const data = { id: req.params.id, value: 'Some data' };

  // Save data to Redis
  client.setex(req.params.id, 3600, JSON.stringify(data));

  res.json(data);
});
```
## Endpoints
- Auth: createUser✅, loginUser✅, forgotPassword✅, resetPassword✅
- admin: createProduct✅, CreatePromo✅, activePromo✅, leaderboard
- user: buyProduct, buyPromoproduct, availablePromoProduct, leaderboard,

## Features
- authentication✅
- cache integration✅
- rate-limit✅
- heavy load checks
- database sessions and transactions to ensure consistent query performance
- error handling
- race condition and concurrency control

## To Do 
- modular type settings
-  Proper validation process
- Documentation
- Tests
- Proper reusable response formatting

 <!-- check if product for a promo is available  -->
 <!-- if yes update the promo with it's necessary promo condition -->
 <!-- if no seed in the products more than 200 allocated unit for flash sale promo -->
 <!-- endpoint for normal sales  -->
 <!-- endpoint for flash sales and if a promo product is exhausted no deficit -->
 <!-- endpoint to return the remaining stock from a promo with product id -->


 ```ts
export class CustomerService extends CustomerAbstract { 
    async buyProduct(payload: BuyProductType, session?:ClientSession): Promise<ISale> {
        // start session and transaction
        // find product by id and check if it exists
        // check the available unit left and return an error if its at 0 or after deducting the units it will be less than 0
        // update the available units and create a sales receipt
        // end the session and commit the transaction
        // return a successful transaction and sales receipt
        // if any error occurs rollback the transaction and return an error message
    }

    async buyPromoProduct(payload: BuyPromoProductType, session?: ClientSession): Promise<ISale> {
        // start the transaction
        // find promo by id and check if it's active
        // find product by id check if is_promo is true and check both units and available units
        // if assigned promo unit or regular === 0 or regular unit <= promo unit update the the is_promo to false and return an error
        // If the purchasing promo unit when deducted is going to be less than 0 return an error
        // Update the product according to the units create a sales receipt for the promo purchase and return the sales receipts
        // return a success and commit the transaction
        // if any error occurs rollback the transaction and return an error message
    }

    async availablePromoProduct(payload: AvailablePromoProductType, session?: ClientSession): Promise<IProduct> {
        // apply cache middleware here to cache pages every 1 hour
        //use the promoId to find all the products attached to promo based on their details
        // reduce excess data from the incomng products at the database level
        // find promo by id
        // cache each page per hour
        // return the promo and all the products attached to it in a paginated format
    }
    
}
 ```