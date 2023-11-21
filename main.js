const express = require("express")
const app = express()
const port = 3000
const { Client } = require("pg");

// SQL Query til de forskellige dataset
const qry1 = "SELECT entity, code, mismanaged FROM capita";
const qry2 = "SELECT * FROM ocean";
const qry3 = "SELECT * FROM total";

// https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

//PostgreSQL klient setup
const klient = new Client({
    user: "cnhjxtsg", // Brug din egen bruger her
    host: "ella.db.elephantsql.com", // Brug din egen Server her
    database: "cnhjxtsg", // Din kalorie database
    password: "upgJibmF0KoKihjkz99NVslqBDCrTbZJ", // Dit password i skyen.
    port: 5432
});

//Connect til PostgresSQL database
klient.connect();

// Her defineres endpoint og fejlfinding for hvert dataset
//Dataset 1
app.get("/datacapita", async (req, res) => {
    try {
        let queryData = await klient.query(qry1);
        res.json({
            "ok": true,
            "data": queryData.rows,
        })
    } catch (error) {
        res.json({
            "ok": false,
            "message": error.message,
        })
    }
})

//Dataset 2
app.get("/dataocean", async (req, res) => {
    try {
        let queryData = await klient.query(qry2);
        res.json({
            "ok": true,
            "data": queryData.rows,
        })
    } catch (error) {
        res.json({
            "ok": false,
            "message": error.message,
        })
    }
})

//Dataset 3
app.get("/datatotal", async (req, res) => {
    try {
        let queryData = await klient.query(qry3);
        res.json({
            "ok": true,
            "data": queryData.rows,
        })
    } catch (error) {
        res.json({
            "ok": false,
            "message": error.message,
        })
    }
})

// Express serveren startes
app.listen(port, () => {
    console.log(`Appl. lytter på http://localhost:${port}`)
})

    
