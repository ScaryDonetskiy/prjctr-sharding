const {Client} = require('pg');
const ProgressBar = require('progress');
const faker = require('@faker-js/faker');

const pgClient = new Client({
    host: 'localhost', port: 5432, user: 'postgres', password: 'default', database: 'postgres'
});

const bar = new ProgressBar('[:current/:total]', {total: 1000000});

faker.faker.setLocale('en');

pgClient.connect().then(() => {
    insert();
});

function insert() {
    let promises = [];
    for (let i = 1; i <= 100; i++) {
        let obj = {
            categoryId: faker.faker.helpers.arrayElement([1, 2, 3]),
            author: faker.faker.name.firstName(),
            title: faker.faker.animal.cat(),
            year: faker.faker.datatype.number(1700, 2023)
        };

        promises.push(pgClient.query(
            'INSERT INTO books (category_id, author, title, year) VALUES ($1, $2, $3, $4)',
            [obj.categoryId, obj.author, obj.title, obj.year]
        ).then(() => {
            bar.tick();

            if (bar.complete) {
                pgClient.end();
                process.exit();
            }
        }));
    }

    Promise.all(promises).then(() => {
        insert();
    });
}