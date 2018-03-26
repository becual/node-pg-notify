CREATE TABLE IF NOT EXISTS films (
    code        char(5),
    title       varchar(40),
    did         integer,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute,
    CONSTRAINT production UNIQUE(date_prod)
);

CREATE TABLE IF NOT EXISTS distributors (
    did     integer,
    name    varchar(40),
    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);

CREATE TABLE IF NOT EXISTS cinemas (
        id serial,
        name text,
        location text
);

CREATE TABLE IF NOT EXISTS some_table (
        id serial,
        name text,
        location text
);
