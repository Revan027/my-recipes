import { tableName } from './table-names';

export const DB_NAME = 'my_receipes_db';
export const DB_VERSION = 1;

export const version1: string[] = [
    `CREATE TABLE IF NOT EXISTS ${tableName.type} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.recipe} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    picture TEXT NULL,
    typeID INTEGER NOT NULL,
    FOREIGN KEY(typeID) REFERENCES ${tableName.type}(id)
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.step} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    position INTEGER NOT NULL,
    recipeID INTEGER NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES ${tableName.recipe}(id)
  );`,
    `CREATE TABLE IF NOT EXISTS ${tableName.ingredient} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    recipeID INTEGER NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES ${tableName.recipe}(id)
  );`,
    `INSERT INTO ${tableName.type} (name) VALUES
    ('Plat'),
    ('Entrée'),
    ('Salade'),
    ('Apéritif');`,
];

export const DB_UPGRADES = [{ toVersion: DB_VERSION, statements: version1 }];
