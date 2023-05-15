import db from "../database/database.connection.js"


export async function insertRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    if (daysRented <= 0) return res.sendStatus(400);

    try {
        const customerExists = await db.query(`select customers.id from customers where customers.id = $1`, [customerId]);
        console.log(customerExists);
        if (!customerExists.rowCount) return res.sendStatus(400);
        const gamesExists = await db.query(`select * from games where gameS.id = $1`, [gameId]);
        if (!gamesExists.rowCount) return res.sendStatus(400);

        const rentDate = (await db.query(`select current_date`)).rows[0].current_date;
        const pricePerDay = await db.query(`select games."pricePerDay" from  games where games.id = $1`, [gameId]);
        const originalPrice = Number(pricePerDay.rows[0].pricePerDay) * daysRented;
        const insert = await db.query(`insert into rentals ("customerId", "gameId", "daysRented", "originalPrice", "rentDate")
        values ($1, $2, $3, $4, $5)`, [customerId, gameId, daysRented, originalPrice, rentDate]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRentals(req, res) {

    try {
        const result = await db.query(`select rentals.*, customers.name as customerName, games.name as gameName
        from rentals, customers, games where customers.id = rentals."customerId"
        and games.id = rentals."gameId"`);


        
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }


}