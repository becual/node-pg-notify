CREATE TABLE films (
    code        char(5),
    title       varchar(40),
    did         integer,
    date_prod   date,
    kind        varchar(10),
    len         interval hour to minute,
    CONSTRAINT production UNIQUE(date_prod)
);

CREATE TABLE distributors (
    did     integer,
    name    varchar(40),
    UNIQUE(name)
);

CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);

CREATE TABLE cinemas (
        id serial,
        name text,
        location text
);

CREATE TYPE employee_type AS (name text, salary numeric);

CREATE TABLE employees OF employee_type (
    PRIMARY KEY (name),
    salary WITH OPTIONS DEFAULT 1000
);