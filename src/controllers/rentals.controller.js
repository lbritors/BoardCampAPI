import db from "../database/database.connection.js"
import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js'

dayjs.locale('pt-br');

export async function insertRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    if (daysRented <= 0) return res.sendStatus(400);

    try {
        const customerExists = await db.query(`select customers.id from customers where customers.id = $1`, [customerId]);
        if (!customerExists.rowCount) return res.sendStatus(400);

        const gamesExists = await db.query(`select * from games where games.id = $1`, [gameId]);
        if (!gamesExists.rowCount) return res.sendStatus(400);

        const notAvailable = await db.query(`select count(*) from rentals where "returnDate" IS NULL and "gameId" = $1`, [gameId]);
        if (notAvailable.rows[0].count > gamesExists.rows[0].stockTotal) return res.sendStatus(400);

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

        const data = result.rows.map(r => {
            return {
                id: r.id,
                customerId: r.customerId,
                gameId: r.gameId,
                rentDate: dayjs(r.rentDate).format("YYYY-MM-DD"),
                daysRented: r.daysRented,
                returnDate: r.returnDate ? dayjs(r.returnDate).format("YYYY-MM-DD") : r.returnDate,
                originalPrice: r.originalPrice,
                delayFee: r.delayFee,
                customer: {
                    id: r.customerId,
                    name: r.customername
                },
                game: {
                    id: r.gameId,
                    name: r.gamename
                }
            }
        });
        
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function endRental(req, res) {
    const { id } = req.params;
    try {
        const rentalExists = await db.query(`select * from rentals where rentals.id = $1`, [id]);
        if (!rentalExists.rowCount) return res.sendStatus(404);
        if (rentalExists.rows[0].returnDate !== null) res.sendStatus(400);

        const dateOfReturn = dayjs().format("YYYY-MM-DD");
        const dateThatShoudaReturn = dayjs(rentalExists.rows[0].rentDate).add(rentalExists.rows[0].daysRented, 'day').format("YYYY-MM-DD");
        const d1 = new Date(dateOfReturn).getTime();
        const d2 = new Date(dateThatShoudaReturn).getTime();
        const diff = Math.abs(d1 - d2);
        const diffDays = diff / (1000 * 3600 * 24);
        console.log("diff",diffDays);
        const game = await db.query(`select * from games where games.id = $1`, [rentalExists.rows[0].gameId]);
        const gamePrice = game.rows[0].pricePerDay;

        let delayFee;
        if (d1 <= d2) {
            delayFee = 0;
        } else if(d1 > d2) {
            delayFee = diffDays * gamePrice;
        }

        // const updateReturnDate = await db.query(`update rentals set "returnDate"= $1,
        // "delayFee" = $2 where rentals.id = $3`, [dateOfReturn, delayFee, id]);

        res.status(200).send(updateReturnDate.rows[0]);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}
