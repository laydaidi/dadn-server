drop table if exists `User`;
drop table if exists `Device`;
drop table if exists `ConnectionHistory`;
drop table if exists `Tutorial`;

create table `User` (
    `id` int(11) primary key not null,
    `phone` varchar(10) unique not null,
    `password` varchar(64) not null,
    `name` varchar(128) not null,
    `gender` int(1) null,
    `birthday` date null,
    `address` text null,
    `create_date` datetime null
);

create table `Device` (
    `id` int(11) primary key not null, 
    `name` varchar(128) not null,
    `description` text null
);

create table `ConnectionHistory` (
    `id` int(11) primary key not null, 
    `user_id` int(11) not null,
    `device_id` int(11) not null,
    `connection_time` datetime not null,
    foreign key (`user_id`) references `User`(`id`),
    foreign key (`device_id`) references `Device`(`id`)
);

create table `Tutorial` (
    `id` int(11) primary key not null, 
    `name` varchar(128) unique not null,
    `type` int(1) not null,
    `description` text null,
    `url` varchar(256) unique not null
);