CREATE SEQUENCE IF NOT EXISTS id_seq;

CREATE TABLE "public"."books"
(
    "id"          int8    NOT NULL DEFAULT nextval('id_seq'::regclass),
    "category_id" int8    NOT NULL,
    CONSTRAINT "category_id_check" CHECK (category_id = 1),
    "author"      varchar NOT NULL,
    "title"       varchar NOT NULL,
    "year"        int8    NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX books_category_id_idx ON books USING btree (category_id);

CREATE EXTENSION postgres_fdw;
CREATE SERVER postgres_1 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'postgres_shard_1', port '5432', dbname 'postgres');
CREATE USER MAPPING FOR postgres SERVER postgres_1 OPTIONS (user 'postgres', password 'default');

CREATE FOREIGN TABLE books_1 (
    "id" int8 NOT NULL,
    "category_id" int8 NOT NULL,
    "author" varchar NOT NULL,
    "title" varchar NOT NULL,
    "year" int8 NOT NULL
    ) SERVER postgres_1 OPTIONS (SCHEMA_NAME 'public', TABLE_NAME 'books');

CREATE SERVER postgres_2 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'postgres_shard_2', port '5432', dbname 'postgres');
CREATE USER MAPPING FOR postgres SERVER postgres_2 OPTIONS (user 'postgres', password 'default');

CREATE FOREIGN TABLE books_2 (
    "id" int8 NOT NULL,
    "category_id" int8 NOT NULL,
    "author" varchar NOT NULL,
    "title" varchar NOT NULL,
    "year" int8 NOT NULL
    ) SERVER postgres_2 OPTIONS (SCHEMA_NAME 'public', TABLE_NAME 'books');

CREATE SERVER postgres_3 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'postgres_shard_3', port '5432', dbname 'postgres');
CREATE USER MAPPING FOR postgres SERVER postgres_3 OPTIONS (user 'postgres', password 'default');

CREATE FOREIGN TABLE books_3 (
    "id" int8 NOT NULL,
    "category_id" int8 NOT NULL,
    "author" varchar NOT NULL,
    "title" varchar NOT NULL,
    "year" int8 NOT NULL
    ) SERVER postgres_3 OPTIONS (SCHEMA_NAME 'public', TABLE_NAME 'books');

CREATE VIEW v_books AS
SELECT *
FROM books_1
UNION ALL
SELECT *
FROM books_2
UNION ALL
SELECT *
FROM books_3;

CREATE RULE books_insert AS ON INSERT TO books DO INSTEAD NOTHING;
CREATE RULE books_update AS ON UPDATE TO books DO INSTEAD NOTHING;
CREATE RULE books_delete AS ON DELETE TO books DO INSTEAD NOTHING;

CREATE RULE books_insert_to_1 AS ON INSERT TO books WHERE (category_id = 1) DO INSTEAD INSERT INTO books_1
                                                                                       VALUES (NEW.*);
CREATE RULE books_insert_to_2 AS ON INSERT TO books WHERE (category_id = 2) DO INSTEAD INSERT INTO books_2
                                                                                       VALUES (NEW.*);
CREATE RULE books_insert_to_3 AS ON INSERT TO books WHERE (category_id = 3) DO INSTEAD INSERT INTO books_3
                                                                                       VALUES (NEW.*);

-- INSERT INTO books (id, category_id, author, title, year)
-- VALUES (1, 1, 'Lina Kostenko', 'Marusya Churay', 1979);
-- INSERT INTO books (id, category_id, author, title, year)
-- VALUES (2, 2, 'Vasyl Stus', 'Zimovi Dereva', 1970);
-- INSERT INTO books (id, category_id, author, title, year)
-- VALUES (3, 3, 'Lina Kostenko', 'Vitryla', 1958);