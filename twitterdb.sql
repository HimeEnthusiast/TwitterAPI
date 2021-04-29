CREATE DATABASE  IF NOT EXISTS `twitterdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `twitterdb`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: twitterdb
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userA_ID` int NOT NULL,
  `userB_ID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_ibfk_1` (`userA_ID`),
  KEY `conversation_ibfk_2` (`userB_ID`),
  CONSTRAINT `conversation_ibfk_1` FOREIGN KEY (`userA_ID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `conversation_ibfk_2` FOREIGN KEY (`userB_ID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
INSERT INTO `conversation` VALUES (1,1,2),(21,1,2),(22,1,1),(23,1,3),(24,1,2);
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `body` varchar(280) NOT NULL,
  `date` datetime NOT NULL,
  `userID` int NOT NULL,
  `convoID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `message_ibfk_1` (`userID`),
  KEY `message_ibfk_2` (`convoID`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`convoID`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'hello','2021-04-28 16:23:09',1,1),(60,'Message','2021-04-28 16:51:36',1,1),(63,'Message','2021-04-28 16:52:52',1,1),(66,'hey bestie <3','2021-04-28 16:52:52',1,22);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet`
--

DROP TABLE IF EXISTS `tweet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `body` varchar(280) NOT NULL,
  `likes` int NOT NULL,
  `retweets` int NOT NULL,
  `userID` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tweet_ibfk_1` (`userID`),
  CONSTRAINT `tweet_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet`
--

LOCK TABLES `tweet` WRITE;
/*!40000 ALTER TABLE `tweet` DISABLE KEYS */;
INSERT INTO `tweet` VALUES (1,'pDWucx4TAEY2jRRFdinObv2Yg201bxUgtP9E2IfAZ5VTzHfYyd',1,0,1,'2021-04-28 16:28:27'),(2,'i\'m tweet',0,0,2,'2021-04-28 16:28:36'),(3,'yeeeeee',0,0,1,'2021-04-28 16:28:40'),(4,'good golly',0,0,1,'2021-04-28 16:28:48'),(7,'LwEYaMGnw88tbDJngTqYqtMuWStTgN',0,16,1,'2021-04-28 16:29:17'),(8,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0,0,1,'2021-04-28 16:29:23'),(9,'This is a reply',0,0,1,'2021-04-28 16:30:58'),(10,'This is a reply',0,0,1,'2021-04-28 16:31:00'),(59,'qSRFSN7hSrBCMbwQ6TnaTa6l5qPmQqo1aFgtbrFZxnA7fCVBcl',0,0,1,'2021-04-28 16:51:36'),(63,'RfJyDY08ghicuN3kaQlvaReKoqoLXunnGYSHVRD4B4tdtJrLz8',0,0,1,'2021-04-28 16:52:52');
/*!40000 ALTER TABLE `tweet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet_replies`
--

DROP TABLE IF EXISTS `tweet_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweet_replies` (
  `tweetID` int DEFAULT NULL,
  `replyID` int DEFAULT NULL,
  KEY `tweet_replies_ibfk_1` (`tweetID`),
  KEY `tweet_replies_ibfk_2` (`replyID`),
  CONSTRAINT `tweet_replies_ibfk_1` FOREIGN KEY (`tweetID`) REFERENCES `tweet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tweet_replies_ibfk_2` FOREIGN KEY (`replyID`) REFERENCES `tweet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_replies`
--

LOCK TABLES `tweet_replies` WRITE;
/*!40000 ALTER TABLE `tweet_replies` DISABLE KEYS */;
INSERT INTO `tweet_replies` VALUES (1,9),(1,10),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8),(7,8);
/*!40000 ALTER TABLE `tweet_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'user','pass'),(2,'user1','pass'),(3,'testuser','pass'),(4,'user3','pass'),(50,'ftttjuxw4t','pass'),(52,'wi1dv2heyq','pass'),(53,'7rg6ldsdyk','pass'),(55,'fkjcmnrwmb','pass');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_likes`
--

DROP TABLE IF EXISTS `user_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_likes` (
  `userID` int DEFAULT NULL,
  `tweetID` int DEFAULT NULL,
  KEY `user_likes_ibfk_1` (`userID`),
  KEY `user_likes_ibfk_2` (`tweetID`),
  CONSTRAINT `user_likes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_likes_ibfk_2` FOREIGN KEY (`tweetID`) REFERENCES `tweet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_likes`
--

LOCK TABLES `user_likes` WRITE;
/*!40000 ALTER TABLE `user_likes` DISABLE KEYS */;
INSERT INTO `user_likes` VALUES (1,1);
/*!40000 ALTER TABLE `user_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tweets`
--

DROP TABLE IF EXISTS `user_tweets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tweets` (
  `userID` int NOT NULL,
  `tweetID` int NOT NULL,
  KEY `user_tweets_ibfk_1` (`userID`),
  KEY `user_tweets_ibfk_2` (`tweetID`),
  CONSTRAINT `user_tweets_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_tweets_ibfk_2` FOREIGN KEY (`tweetID`) REFERENCES `tweet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tweets`
--

LOCK TABLES `user_tweets` WRITE;
/*!40000 ALTER TABLE `user_tweets` DISABLE KEYS */;
INSERT INTO `user_tweets` VALUES (1,2),(1,3),(1,4),(1,8),(1,59),(1,63),(1,1);
/*!40000 ALTER TABLE `user_tweets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-28 16:54:25
