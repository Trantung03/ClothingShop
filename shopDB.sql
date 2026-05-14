-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK2kkquqx3hjqiys102tpfrm7jm` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `sku_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  KEY `FKj2hskhk5pw7fcpx84ojy8ig6t` (`sku_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `FKj2hskhk5pw7fcpx84ojy8ig6t` FOREIGN KEY (`sku_id`) REFERENCES `sku` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_parent` (`parent_id`),
  CONSTRAINT `FK_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Men',NULL),(2,'Women',NULL),(3,'Kids',NULL),(4,'Sale',NULL),(5,'Shoes',1),(6,'Clothing',1),(7,'Accessories',1),(8,'Lifestyle',5),(9,'Running',5),(10,'Basketball',5),(11,'Jordan',5),(12,'T-Shirts',6),(13,'Shorts',6),(14,'Hoodies',6),(15,'Shoes',2),(16,'Clothing',2),(17,'Running',15),(18,'Gym & Training',15);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_reservation`
--

DROP TABLE IF EXISTS `inventory_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_reservation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `quantity` int NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `sku_id` bigint NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','EXPIRED','RESERVED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reservation_sku` (`sku_id`),
  KEY `idx_reservation_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_reservation`
--

LOCK TABLES `inventory_reservation` WRITE;
/*!40000 ALTER TABLE `inventory_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `payment_method` enum('BANK_TRANSFER','COD') DEFAULT NULL,
  `payment_status` enum('FAILED','PAID','PENDING','REFUNDED') DEFAULT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','PENDING','PROCESSING','SHIPPED') DEFAULT NULL,
  `total_amount` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` bigint NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  `sku_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs234mi6jususbx4b37k44cipy` (`order_id`),
  KEY `FKiu6yknruli66pm1e23ujb7kch` (`sku_id`),
  CONSTRAINT `FKiu6yknruli66pm1e23ujb7kch` FOREIGN KEY (`sku_id`) REFERENCES `sku` (`id`),
  CONSTRAINT `FKs234mi6jususbx4b37k44cipy` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `base_price` bigint DEFAULT NULL,
  `description` text,
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  `category_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_product_category` (`category_id`),
  CONSTRAINT `FK_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Nike Air Max 270',4200000,NULL,_binary '',8,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(2,'Nike Pegasus 40',3500000,NULL,_binary '',9,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(3,'Air Jordan 1 Low',3200000,NULL,_binary '',11,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(4,'LeBron XXI',5800000,NULL,_binary '',10,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(5,'Nike Sportswear Tee',800000,NULL,_binary '',12,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(6,'Nike Dri-FIT Shorts',950000,NULL,_binary '',13,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(7,'Tech Fleece Hoodie',2800000,NULL,_binary '',14,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(8,'Nike Invincible 3',4900000,NULL,_binary '',17,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(9,'Nike Metcon 9',3800000,NULL,_binary '',18,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(10,'Jordan Stay Loyal',3100000,NULL,_binary '',11,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(11,'Nike Air Force 1',2900000,NULL,_binary '',8,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(12,'Nike Zoom Fly 5',4100000,NULL,_binary '',9,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(13,'KD16 Basketball',4400000,NULL,_binary '',10,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(14,'Nike Pro Tights',1200000,NULL,_binary '',16,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(15,'Yoga Dri-FIT Top',1100000,NULL,_binary '',16,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(16,'Air Jordan 4 Retro',6000000,NULL,_binary '',11,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(17,'Nike React Miller',3300000,NULL,_binary '',17,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(18,'Nike Challenger Shorts',850000,NULL,_binary '',13,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(19,'Nike SB Dunk Low',3500000,NULL,_binary '',8,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315'),(20,'Elite Basketball Socks',450000,NULL,_binary '',7,'https://picsum.photos/400/400','2026-05-13 07:28:56.634315');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi8jnqq05sk5nkma3pfp3ylqrt` (`product_id`),
  CONSTRAINT `FKi8jnqq05sk5nkma3pfp3ylqrt` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sku`
--

DROP TABLE IF EXISTS `sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sku` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `price` bigint NOT NULL,
  `stock_available` int NOT NULL,
  `stock_total` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_sku_product` (`product_id`),
  CONSTRAINT `FK_sku_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sku`
--

LOCK TABLES `sku` WRITE;
/*!40000 ALTER TABLE `sku` DISABLE KEYS */;
INSERT INTO `sku` VALUES (1,1,'White/Black','42',4200000,10,10,NULL),(2,1,'White/Black','43',4200000,15,15,NULL),(3,2,'Blue/Grey','40',3500000,20,20,NULL),(4,2,'Blue/Grey','41',3500000,25,25,NULL),(5,3,'Red/White','42',3200000,5,5,NULL),(6,3,'Red/White','44',3200000,8,8,NULL),(7,4,'Purple','42',5800000,12,12,NULL),(8,5,'Black','L',800000,50,50,NULL),(9,5,'White','M',800000,45,45,NULL),(10,6,'Grey','XL',950000,30,30,NULL),(11,7,'Dark Grey','L',2800000,10,10,NULL),(12,8,'Pink','38',4900000,15,15,NULL),(13,9,'Black/Gum','39',3800000,20,20,NULL),(14,11,'White','40',2900000,100,100,NULL),(15,11,'White','41',2900000,100,100,NULL),(16,16,'Military Blue','42',6000000,3,3,NULL),(17,16,'Military Blue','43',6000000,2,2,NULL),(18,19,'Panda','42',3500000,10,10,NULL),(19,20,'White','Free Size',450000,200,200,NULL),(20,13,'Ocean Bliss','44',4400000,7,7,NULL);
/*!40000 ALTER TABLE `sku` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-13 14:30:29
