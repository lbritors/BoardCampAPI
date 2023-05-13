import db from "../database/database.connection.js"


export async function insertRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const result = await db.query(`select games."pricePerDay" from  games join rentals on games.id = "gameId" join 
        customers on customers.id = "customerId"`);
        console.log(result);
        res.send(result.fields)
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getRentals(req, res) {
   
    

    try {
        const result = await db.query(`select customers.id, customers.name from customers join rentals
         on rentals.customerId = customers.id join games on games.id = rentals.gamesId;`)
        
    } catch (err) {
        res.status(500).send(err.message);
    }


}