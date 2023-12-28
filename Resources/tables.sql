

create table users (
    id int primary key auto_increment,
    email varchar(100) unique not null,
    password_hash varchar(1000),
    name varchar(100),
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

-- (habit) previously (task)
create table habit (
    id int primary key auto_increment,
    habitName varchar(250) not null,
    userId int,
    completed boolean default false,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
    foreign key (userId) references users(id)
)


create table accomplished (
    id int,
    date timestamp,
    habitid int,
    note varchar(250)
    foreign key (habitid) references habit(id)
);