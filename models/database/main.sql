drop table if exists `ConnectionHistory`;
drop table if exists `UserRefreshToken`;
drop table if exists `Tutorial`;
drop table if exists `User`;
drop table if exists `Device`;


create table `User` (
    `id` int(11) primary key not null auto_increment,
    `phone` varchar(10) unique not null,
    `email` varchar(128) unique not null,
    `password` varchar(64) not null,
    `name` varchar(128) unique not null,
    `gender` int(1) null,
    `birthday` date null,
    `address` text null,
    `create_date` datetime default current_timestamp()
);

create table `UserRefreshToken` (
    `id` int(11) primary key not null auto_increment,
    `username` varchar(128) not null,
    `token` text not null,
    foreign key (`username`) references `User`(`name`)
);

create table `Device` (
    `id` int(11) primary key not null auto_increment, 
    `name` varchar(128) not null,
    `description` text null
);

create table `ConnectionHistory` (
    `id` int(11) primary key not null auto_increment, 
    `user_id` int(11) not null,
    `device_id` int(11) not null,
    `connection_time` datetime default current_timestamp(),
    foreign key (`user_id`) references `User`(`id`),
    foreign key (`device_id`) references `Device`(`id`)
);

create table `Tutorial` (
    `id` int(11) primary key not null auto_increment, 
    `name` varchar(128) unique not null,
    `type` int(1) not null,
    `description` text null,
    `url` varchar(256) unique not null,
    `user_name` varchar(128) not null,
    foreign key (`user_name`) references `User`(`name`)
);