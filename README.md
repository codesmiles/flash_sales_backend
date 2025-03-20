# Backend Developer Assessment: Flash Sale System

This assessment is to evaluate your ability to design and implement a robust, high-performance API using MongoDB, Mongoose, and Express. The system must handle real-time inventory updates, ensure data consistency etc during a flash sale event that occurs multiple times a month.

## Assessment Requirements

1. Server Setup
   Develop a basic backend system that provides RESTful APIs to manage the flash sale event and user purchases.
   Establish a connection to a MongoDB database, ensuring it is structured to handle high transaction loads efficiently.✅
   Implement proper application structure for scalability, maintainability, and performance.✅
2. Flash Sale Simulation
   A product will be available for purchase with 200 allocated units at the start of each sale event.
   Users should be able to see in real time the remaining stock and buy the product, and after each successful transaction, the number of available units should decrease accurately.
   The system must prevent under-purchasing (units not reducing) or over-purchasing (going negative) under high traffic conditions, the total amount of units must be exact at the end of the sale so far users purchase successfully.
   The flash sale should be time-restricted, meaning:
   It begins at a specific, predefined time.
   It continues until all units are sold out.
   The sale can restart multiple times within a month, maintaining a possibility of proper inventory resets.
3. Leaderboard API
   The system must also expose an API to fetch a list of all users who successfully purchased the product, sorted in chronological order based on purchase time.
   The leaderboard must be efficiently queryable, even under high database loads.
4. Error Handling & System Robustness
   The system should gracefully reject purchases when stock runs out and provide meaningful error responses.
   Ensure users cannot bypass the sale timing restrictions to buy before the flash sale starts.
5. Security Considerations
   If you can, Implement security measures to prevent fraudulent transactions
   Ensure that a user cannot purchase more than the allowed quantity per transaction (if any limit exists).
   Bonus Enhancements
   Consider query performance at scale
   Handle race conditions and concurrency control
   Implement basic authentication

Send your submission to emmanuel@smuv.africa with the subject “Backend Developer Assessment" which should include
A public and accessible github repository
A clear README that clearly explains the steps to run the project.
Submit on the deadline sent to your email
GOOD LUCK!!!

<!-- 
MODELS

PRODUCT: _id, _name, _description, _price, _stock, _is_promo, _promo_quantity, _promo_condition{name:"string", description:"string"}
USER: _id, _name, _email, _password, 
SALES: _id, _product_id, _price, _stock, _is_promo, _quantity, _user_id

 -->