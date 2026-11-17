import { tableName } from './table-names';

export const DB_NAME = 'my_receipes_db';
export const DB_VERSION = 5;

export const version5: string[] = [
  `CREATE TABLE IF NOT EXISTS ${tableName.menuWeek} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    dateWeek INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS ${tableName.menuDay} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menuWeekID INTEGER NOT NULL,
    day TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS ${tableName.menuDayPeriod} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menuDayID INTEGER NOT NULL,
    recipeName TEXT NOT NULL,
    period INTEGER NOT NULL
  );`,
];

export const version4: string[] = [
  `ALTER TABLE ${tableName.recipe} DROP COLUMN picture;`,
];

export const version3: string[] = [
  `ALTER TABLE ${tableName.recipe} ADD srcPicture TEXT NULL;`
];

export const version2: string[] = [
  `ALTER TABLE ${tableName.step} DROP COLUMN title;`
];

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

export const DB_UPGRADES = [
  { toVersion: 1, statements: version1 },
  { toVersion: 2, statements: version2 },
  { toVersion: 3, statements: version3 },
  { toVersion: 4, statements: version4 },
  { toVersion: 5, statements: version5 },
];