const {Client} = require('pg');

const pgClient = new Client({
    host: 'localhost', port: 5432, user: 'postgres', password: 'default', database: 'postgres'
});

async function selectOneBookById() {
    await pgClient.query('SELECT * FROM books WHERE id = 13668');
}

async function selectOneBookByCategory(categoryId) {
    await pgClient.query(`SELECT *
                          FROM books
                          WHERE category_id = ${categoryId}
                          LIMIT 1`);
}

async function select30BooksByYear(year) {
    await pgClient.query(`SELECT *
                          FROM books
                          WHERE year = ${year}
                          LIMIT 30`);
}

async function insertOneBook(object) {
    await pgClient.query(
        'INSERT INTO books (category_id, author, title, year) VALUES ($1, $2, $3, $4)',
        [object.categoryId, object.author, object.title, object.year]
    );
}

async function insert10BooksToRandomCategories(objects) {
    await pgClient.query(
        `INSERT INTO books (category_id, author, title, year)
         VALUES ($1, $2, $3, $4),
                ($5, $6, $7, $8),
                ($9, $10, $11, $12),
                ($13, $14, $15, $16),
                ($17, $18, $19, $20),
                ($21, $22, $23, $24),
                ($25, $26, $27, $28),
                ($29, $30, $31, $32),
                ($33, $34, $35, $36),
                ($37, $38, $39, $40)`, [
                    objects[0].categoryId, objects[0].author, objects[0].title, objects[0].year,
            objects[1].categoryId, objects[1].author, objects[1].title, objects[1].year,
            objects[2].categoryId, objects[2].author, objects[2].title, objects[2].year,
            objects[3].categoryId, objects[3].author, objects[3].title, objects[3].year,
            objects[4].categoryId, objects[4].author, objects[4].title, objects[4].year,
            objects[5].categoryId, objects[5].author, objects[5].title, objects[5].year,
            objects[6].categoryId, objects[6].author, objects[6].title, objects[6].year,
            objects[7].categoryId, objects[7].author, objects[7].title, objects[7].year,
            objects[8].categoryId, objects[8].author, objects[8].title, objects[8].year,
            objects[9].categoryId, objects[9].author, objects[9].title, objects[9].year
        ]
    );
}

async function updateOneBookById() {
    await pgClient.query('UPDATE books SET title = \'updated\' WHERE id = 14668');
}

async function updateBooksByYear() {
    await pgClient.query('UPDATE books SET title = \'updated\' WHERE year = 2000');
}

async function deleteBookById() {
    await pgClient.query('DELETE FROM books WHERE id = 112788');
}

async function deleteBooksByYear() {
    await pgClient.query('DELETE FROM books WHERE year = 1988');
}

async function run() {
    let benchmarkResults = {
        'Select 1 book by id': 0,
        'Select 1 book from random category': 0,
        'Select 30 books by selected year': 0,
        'Insert 1 book': 0,
        'Insert 10 books in random categories': 0,
        'Update 1 book by id': 0,
        'Update books by selected year': 0,
        'Delete 1 book': 0,
        'Delete books by selected year': 0
    };

    await pgClient.connect();

    let start = performance.now();
    await selectOneBookById();
    let finish = performance.now();
    benchmarkResults["Select 1 book by id"] = finish - start;

    start = performance.now();
    await selectOneBookByCategory(3);
    finish = performance.now();
    benchmarkResults["Select 1 book from random category"] = finish - start;

    start = performance.now();
    await select30BooksByYear(1780);
    finish = performance.now();
    benchmarkResults["Select 30 books by selected year"] = finish - start;

    start = performance.now();
    await insertOneBook({
        categoryId: 2,
        author: 'Load Tester',
        title: 'Try to shard it',
        year: 2023
    });
    finish = performance.now();
    benchmarkResults["Insert 1 book"] = finish - start;

    start = performance.now();
    await insert10BooksToRandomCategories([
        {
            categoryId: 1,
            author: 'Tester fiasdrst',
            title: 'Great Sasdhard',
            year: 1990
        },
        {
            categoryId: 2,
            author: 'Testeasr first',
            title: 'Great aShard',
            year: 1990
        },
        {
            categoryId: 3,
            author: 'Testesssr first',
            title: 'Greast Shard',
            year: 1990
        },
        {
            categoryId: 3,
            author: 'Tesdter first',
            title: 'Great ssShard',
            year: 1990
        },
        {
            categoryId: 1,
            author: 'Tester fiasdrstrst',
            title: 'Great Shssard',
            year: 1990
        },
        {
            categoryId: 3,
            author: 'Testder fidrst',
            title: 'Greadt Shdard',
            year: 1990
        },
        {
            categoryId: 2,
            author: 'Testser fsirst',
            title: 'Greata Sshard',
            year: 1990
        },
        {
            categoryId: 2,
            author: 'Tesster fisrst',
            title: 'Great Sshard',
            year: 1990
        },
        {
            categoryId: 3,
            author: 'Tester fisrst',
            title: 'Gresat Shard',
            year: 1990
        },
        {
            categoryId: 1,
            author: 'Testser fisrst',
            title: 'Grseat Shasrd',
            year: 1990
        }
    ]);
    finish = performance.now();
    benchmarkResults["Insert 10 books in random categories"] = finish - start;

    start = performance.now();
    await updateOneBookById();
    finish = performance.now();
    benchmarkResults["Update 1 book by id"] = finish - start;

    start = performance.now();
    await updateBooksByYear();
    finish = performance.now();
    benchmarkResults["Update books by selected year"] = finish - start;

    start = performance.now();
    await deleteBookById();
    finish = performance.now();
    benchmarkResults["Delete 1 book"] = finish - start;

    start = performance.now();
    await deleteBooksByYear();
    finish = performance.now();
    benchmarkResults["Delete books by selected year"] = finish - start;

    return benchmarkResults;
}

run().then((benchmarkResults) => {
    console.log(benchmarkResults);
    process.exit();
})