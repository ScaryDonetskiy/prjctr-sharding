CREATE TABLE "public"."books"
(
    "id"          int8    NOT NULL,
    "category_id" int8    NOT NULL,
    CONSTRAINT "category_id_check" CHECK (category_id = 3),
    "author"      varchar NOT NULL,
    "title"       varchar NOT NULL,
    "year"        int8    NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX books_category_id_idx ON books USING btree (category_id);