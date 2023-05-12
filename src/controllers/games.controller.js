import db from "../database/database.connection.js";

export async function getGames(req, res) {

    try {
        const result = await db.query(`select * from games`);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
        const nameExists = await db.query(`select games.name from games where games.name = ${name}`);
        if (nameExists) return res.sendStatus(409);
        const insert = await db.query(`insert into games (name,image,stockTotal, pricePerDay) values 
        (${name}, ${image}, ${stockTotal}, ${pricePerDay}`);
        res.sendStatus(201);
        
    } catch (err) {
        res.status(500).send(err.message);
    }

}