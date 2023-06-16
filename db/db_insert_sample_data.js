const db = require("./db_connection");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_dreams_table_sql = "DELETE FROM dreams;"

db.execute(delete_dreams_table_sql);

const delete_dream_type_table_sql = "DELETE FROM dream_type;"

db.execute(delete_dream_type_table_sql);

/**** Create some sample subjects and assignments ****/

const insert_dream_type_sql = `
    INSERT INTO dream_type 
        (typeId, typeName) 
    VALUES 
        (?, ?);
`

db.execute(insert_dream_type_sql, [1, 'Normal Dream']);

db.execute(insert_dream_type_sql, [2, 'Lucid Dream']);

db.execute(insert_dream_type_sql, [3, 'Progressive Dream']);

db.execute(insert_dream_type_sql, [4, 'False-Awakending Dream']);

db.execute(insert_dream_type_sql, [5, 'Daydream']);

db.execute(insert_dream_type_sql, [6, 'Vivid dream']);

db.execute(insert_dream_type_sql, [7, 'Recurring Dream']);

db.execute(insert_dream_type_sql, [8, 'Prophetic Dream']);

db.execute(insert_dream_type_sql, [9, 'Nightmare']);

const insert_dream_sql = `
    INSERT INTO dreams 
        (title, date, typeId, description) 
    VALUES 
        (?, ?, ?, ?);
`

//typeId: 1 => 'Normal Dream'
db.execute(insert_dream_sql, ['Driving Off Cliff', '2023-04-01', 1, 
        'It was pretty nice out. My friend was driving me, my sister, and my grandma on the highway. All of a sudden, she drove off the side of the cliff we were on. I immediately screamed, I was so scared of dying, but somehow we were coasting on top of the water below the cliff. I was absolutely terrified. Im glad that it was just a dream.']);

//typeId: 2 => 'Lucid Dream'
db.execute(insert_dream_sql, ['Flying Over Ocean', '2023-04-2', 2,
    'I found myself soaring above the vast expanse of the ocean. With complete control over my flight, I effortlessly glided through the air, reveling in the exhilarating sensation of freedom. The ocean stretched out beneath me, its shimmering waves reflecting the golden hues of the setting sun. The cool breeze caressed my face as I dipped and soared, feeling weightless and untethered. It was a dream of pure liberation, where the boundaries of reality dissolved, and I embraced the limitless possibilities of the open sky.']);

//typeId: 9 => 'Nightmare'
db.execute(insert_dream_sql, ['Naked At School', '2023-04-03', 9,
    'The nightmare engulfed me as I stood naked in my old school, feeling exposed and humiliated amidst judgmental eyes.']);

db.end();