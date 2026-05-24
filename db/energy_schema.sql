-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: energy_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `affiliation_db`
--

DROP TABLE IF EXISTS `affiliation_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affiliation_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `location_node_db`
--

DROP TABLE IF EXISTS `location_node_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location_node_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `parent_seq` bigint DEFAULT NULL,
  `affiliation_seq` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `node_kind` enum('GROUP','LEAF') NOT NULL,
  `depth` int NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `location_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`),
  KEY `FK_location_node_parent` (`parent_seq`),
  KEY `FK_location_node_affiliation` (`affiliation_seq`),
  CONSTRAINT `FK_location_node_affiliation` FOREIGN KEY (`affiliation_seq`) REFERENCES `affiliation_db` (`seq`),
  CONSTRAINT `FK_location_node_parent` FOREIGN KEY (`parent_seq`) REFERENCES `location_node_db` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member_db`
--

DROP TABLE IF EXISTS `member_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `user_type` enum('ADMIN','USER') NOT NULL,
  `affiliation_seq` bigint DEFAULT NULL,
  `location_node_seq` bigint DEFAULT NULL,
  PRIMARY KEY (`seq`),
  KEY `FKn41q08vad7yp54w73pbsje9jf` (`affiliation_seq`),
  KEY `FK_member_location_node` (`location_node_seq`),
  CONSTRAINT `FK_member_location_node` FOREIGN KEY (`location_node_seq`) REFERENCES `location_node_db` (`seq`),
  CONSTRAINT `FKn41q08vad7yp54w73pbsje9jf` FOREIGN KEY (`affiliation_seq`) REFERENCES `affiliation_db` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member_point_db`
--

DROP TABLE IF EXISTS `member_point_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_point_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `point` int NOT NULL,
  `member_seq` bigint DEFAULT NULL,
  PRIMARY KEY (`seq`),
  UNIQUE KEY `UKg61gqqhwrlw8xo1ekatjb1iip` (`member_seq`),
  CONSTRAINT `FK2yfmc9i7marhhm20bmby0yb2e` FOREIGN KEY (`member_seq`) REFERENCES `member_db` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_db`
--

DROP TABLE IF EXISTS `report_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location_detail` varchar(255) NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `is_ac_wasting` bit(1) DEFAULT NULL,
  `is_heater_wasting` bit(1) DEFAULT NULL,
  `is_light_wasting` bit(1) DEFAULT NULL,
  `is_other_wasting` bit(1) DEFAULT NULL,
  `location_seq` bigint DEFAULT NULL,
  `member_seq` bigint DEFAULT NULL,
  PRIMARY KEY (`seq`),
  KEY `FK_report_location` (`location_seq`),
  KEY `FK87qftf4iy7s14kwivgjoi0hym` (`member_seq`),
  CONSTRAINT `FK87qftf4iy7s14kwivgjoi0hym` FOREIGN KEY (`member_seq`) REFERENCES `member_db` (`seq`),
  CONSTRAINT `FK_report_location` FOREIGN KEY (`location_seq`) REFERENCES `location_node_db` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
