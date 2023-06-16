const db = require("./db_connection");

/**** Read the dream_type table ****/

const select_dream_type_sql = "SELECT * FROM dream_type";

db.execute(select_dream_type_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'dream_type' contents:")
        console.log(results);
    }
);

/**** Read the dreams table, joined with dream_type table ****/


const select_dreams_sql = `
SELECT *
FROM dreams
JOIN dream_type
    ON dreams.typeId = dream_type.typeId
ORDER BY
    dreams.dreamId;
`;

db.execute(select_dreams_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'dreams' contents:")
        console.log(results);
    }
);

db.end();