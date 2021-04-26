CREATE DATABASE twitterDB;
USE twitterDB;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
	id int auto_increment primary key, 
	username varchar(20) NOT NULL, 
    password varchar(20) NOT NULL
);

DROP TABLE IF EXISTS tweet;
CREATE TABLE tweet (
	id int auto_increment primary key,
    body varchar(280) NOT NULL,
    likes int NOT NULL,
    retweets int NOT NULL,
    userID int  NOT NULL, 
    date datetime NOT NULL, 
    foreign key (userID) references user(id)
);

DROP TABLE IF EXISTS user_tweets;
CREATE TABLE user_tweets (
	userID int NOT NULL,
    tweetID int NOT NULL,
    foreign key (userID) references user(id),
    foreign key (tweetID) references tweet(id)
);

DROP TABLE IF EXISTS tweet_replies;
CREATE TABLE tweet_replies (
	tweetID int,
    replyID int,
    foreign key (tweetID) references tweet(id),
    foreign key (replyID) references tweet(id)
);

DROP TABLE IF EXISTS user_likes;
CREATE TABLE user_likes (
	userID int,
    tweetID int,
    foreign key (userID) references user(id),
    foreign key (tweetID) references tweet(id)
);

DROP TABLE IF EXISTS conversation;
CREATE TABLE conversation (
	id int auto_increment primary key,
    userA_ID int NOT NULL,
    userB_ID int NOT NULL,
    foreign key (userA_ID) references user(id),
    foreign key (userB_ID) references user(id)
);

DROP TABLE IF EXISTS message;
CREATE TABLE message (
	id int auto_increment primary key,
    body varchar(280) NOT NULL,
    date datetime NOT NULL,
    userID int NOT NULL,
    convoID int NOT NULL,
    foreign key (userID) references user(id),
    foreign key (convoID) references conversation(id)
);