const express = require("express")
const app = express()
const port = 3000
const { Client } = require("pg");
// SQL Query
const qry = "SELECT * FROM ocean";
// https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const klient = new Client({
    user: "cnhjxtsg", // Brug din egen bruger her
    host: "ella.db.elephantsql.com", // Brug din egen Server her
    database: "cnhjxtsg", // Din kalorie database
    password: "upgJibmF0KoKihjkz99NVslqBDCrTbZJ", // Dit password i skyen.
    port: 5432
    });

klient.connect();

// Fejlfinding
app.get("/data", async (req, res) => {
    try {
        let queryData = await klient.query(qry);
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

app.listen(port, () => {
    console.log(`Appl. lytter på http://localhost:${port}`)
    })

    
