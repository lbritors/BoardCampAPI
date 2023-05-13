
import db from "../database/database.connection.js"


export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfExists = await db.query(`select customers.cpf from customers where customers.cpf = $1`, [cpf]);
        if (cpfExists.rowCount) return res.sendStatus(409);
        const insert = await db.query(`insert into customers (name, phone, cpf, birthday) values ($1, $2, $3, $4)`, [name, phone,cpf, birthday]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getCustomers(req, res) {
    try {
        const result = await db.query(`select * from customers`);
        res.send(result.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await db.query(`select * from customers where id=$1`, [id]);
        res.send(customer.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomerById(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    
    
    try {
       
        const customer = await db.query(`SELECT * from customers where id=$1`, [id]);
        if (cpf && cpf !== customer.cpf) {
            const cpfExists = await db.query(`SELECT customers.cpf from customers where customer.cpf = $1`, [cpf]);
            if (cpfExists.rowCount) return res.sendStatus(409);
        }

        const cpfNew = cpf ? cpf : customer.rows[0].cpf;
        const nameNew = name ? name : customer.rows[0].name;
        const phoneNew = phone ? phone : customer.rows[0].phone;
        const birthdayNew = birthday ? birthday : customer.rows[0].birthday;
        const update = await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
        where customers.id=$5`, [nameNew, phoneNew, cpfNew, birthdayNew, id]);
        console.log(update);
        res.sendStatus(200);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}
