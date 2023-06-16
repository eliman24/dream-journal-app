const fs = require("fs");

const db = require("./db_connection");

/**** Drop existing tables, if any ****/

const drop_dreams_table_sql = "DROP TABLE IF EXISTS dreams;"

db.execute(drop_dreams_table_sql);

const drop_dream_type_table_sql = "DROP TABLE IF EXISTS dream_type;"

db.execute(drop_dream_type_table_sql);

/**** Create tables ****/

const create_dream_type_table_sql = `
    CREATE TABLE dream_type (
        typeId INT NOT NULL AUTO_INCREMENT,
        typeName VARCHAR(45) NOT NULL,
        PRIMARY KEY (typeId));
`
db.execute(create_dream_type_table_sql);

const create_dreams_table_sql = `
    CREATE TABLE dreams (
        dreamId INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(45) NOT NULL,
        date DATE NOT NULL,
        typeId INT NOT NULL,
        description VARCHAR(600) NOT NULL,
        PRIMARY KEY (dreamId),
        INDEX dreamType_idx (typeId ASC),
        CONSTRAINT dreamType
            FOREIGN KEY (typeId)
            REFERENCES dream_type (typeId)
            ON DELETE RESTRICT
            ON UPDATE CASCADE);
`

db.execute(create_dreams_table_sql);

db.end();