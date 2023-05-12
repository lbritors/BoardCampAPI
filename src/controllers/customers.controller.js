
import db from "../database/database.connection.js"


export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfExists = await db.query(`select customers.cpf from customers where customers.cpf = ${cpf}`);
        if (cpfExists) return res.sendStatus(409);
        const insert = await db.query(`insert into custumers (name, phone, cpf, birthday) values (${name}, ${phone}, ${cpf}, ${birthday})`);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getCustomer(req, res) {
    try {
        const result = await db.query(`select * from customers`);
        res.send(result);

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
    
    const customerEdited = {}
    if (cpf) customerEdited.cpf = cpf;
    
    try {
       
        const customer = await db.query(`SELECT * from customers where id=$1`, [id]);
        if (customerEdited.cpf && customerEdited.cpf !== customer.cpf) {
            const cpfExists = await db.query(`SELECT customers.cpf from customers where customer.cpf = ${cpf}`);
            if (cpfExists) return res.sendStatus(409);
        }

        const cpfNew = cpf ? cpf : customer.cpf;
        const nameNew = name ? name : customer.name;
        const phoneNew = phone ? phone : customer.phone;
        const birthdayNew = birthday ? birthday : customer.birthday;
        const update = await db.query(`UPDATE customers SET name=${nameNew}, phone=${phoneNew}, cpf=${cpfNew}, birthday=${birthdayNew}
        where customers.id=$1`, [id]);


        
    } catch (err) {
        res.status(500).send(err.message);
    }
}
