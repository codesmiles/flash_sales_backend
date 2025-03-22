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
- Auth: createUser, loginUser, forgotPassword, resetPassword✅
- admin: createProduct, CreatePromo, activePromo, leaderboard
- user: buyProduct, buyPromo, availablePromoProduct, leaderboard,

## Features
- authentication✅
- cache integration✅
- rate-limit✅
- heavy load checks
- database sessions and transactions to ensure consistent query performance
- error handling
- race condition and concurrency control

 <!-- check if product for a promo is available  -->
 <!-- if yes update the promo with it's necessary promo condition -->
 <!-- if no seed in the products more than 200 allocated unit for flash sale promo -->
 <!-- endpoint for normal sales  -->
 <!-- endpoint for flash sales and if a promo product is exhausted no deficit -->
 <!-- endpoint to return the remaining stock from a promo with product id -->