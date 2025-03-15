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

app.get('/data/:id', cache, (req, res) => {
  // Simulate fetching data from a database
  const data = { id: req.params.id, value: 'Some data' };

  // Save data to Redis
  client.setex(req.params.id, 3600, JSON.stringify(data));

  res.json(data);
});
```