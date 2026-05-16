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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2026-05-14 16:43:23.870029','639C632BB533D6CACB30D2CAA391E1A2','2026-05-14 16:58:02.115954'),(2,'2026-05-14 17:00:25.701665','B925AB1E68E5C7CE0892BDA6C986EFD4',NULL),(3,'2026-05-14 17:00:25.741406','9035E8D1BDDC4E962EBDECC9ED133474',NULL),(4,'2026-05-14 17:00:25.761112','19ABF54DD24D8A6603844E6AEDD606A1',NULL),(5,'2026-05-14 17:19:52.259255','DE125AB6B506E8649B90C201247F8FCD',NULL),(6,'2026-05-14 17:19:52.294062','5BADF9AAC17BD76F8A546CBF7CCFEFD2',NULL),(7,'2026-05-14 17:19:52.319315','D8EA53B387F8688CC8793F438C91ED91',NULL),(8,'2026-05-14 17:26:06.696459','334B91EFB1EEE7FBD4E1A9DC25D3660F',NULL),(9,'2026-05-14 17:26:06.720705','2A9DA59BD799F2DCCC1F00C7C57C776E',NULL),(10,'2026-05-14 17:26:06.746608','B71FD9C56AF29A1A21BAA3EC42D44ACD','2026-05-14 17:38:05.900129'),(11,'2026-05-14 18:14:24.773228','EB85E0ABE9A4DE5E425CDDEC1FAB1894','2026-05-14 18:59:15.008141'),(12,'2026-05-14 18:36:27.996677','54D7E81A1751E0878CF58F0279F102C7','2026-05-14 18:36:40.808349'),(13,'2026-05-14 19:24:32.296697','08FCA76E554D31DD61AB433122745E10',NULL),(14,'2026-05-14 19:24:32.321973','F17D59FF23A7AC750480133BD50DE63F','2026-05-14 19:25:19.218376'),(15,'2026-05-14 19:31:36.442087','917C9C3E37370B1D468B750F5BC14C1D',NULL),(16,'2026-05-14 19:31:36.580517','3AF79A3EBAE7BF53C58A5527A0E78AA5',NULL),(17,'2026-05-14 19:31:42.174682','CD612F5465D03161287538B1A202FBF0','2026-05-14 19:38:56.765539'),(18,'2026-05-14 20:14:50.727217','C59A2AD4049E3A969C33F26220F2FC47','2026-05-14 22:20:40.187146'),(19,'2026-05-15 09:41:21.779801','8E18AB86ABE4A0419985BC7EC40E9730',NULL),(20,'2026-05-15 09:41:21.908154','16D39DAD4FE05A4B62D90DE53D57D509','2026-05-15 09:52:58.264669'),(21,'2026-05-15 09:53:29.397646','F1781D5F99DCB53950793A06F0AA162E',NULL),(22,'2026-05-15 09:53:29.460765','D00873D04F7139412335BC76269D6010','2026-05-15 09:54:35.574324'),(23,'2026-05-15 12:57:57.586564','1B918D01FC3BCE3DDE35F4032CC82E27',NULL),(24,'2026-05-15 12:57:57.677637','C72FDA09F8EDE67E521B47D13ADF8336','2026-05-15 13:15:51.078491'),(25,'2026-05-15 13:21:24.658991','6F67A65B7DC07B7DCE72255EB5697876',NULL),(26,'2026-05-15 13:21:24.739977','094075D9B557CDD22D473EF90DE4E536','2026-05-15 13:40:14.886748'),(27,'2026-05-15 14:04:38.305435','7A9AFAA54E6884FBDADC7551D506C907','2026-05-15 14:08:27.394725'),(28,'2026-05-15 17:24:19.362071','EC625DA36890A551B3B681A0B5C38DCD',NULL);
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
  UNIQUE KEY `UKlcc7e9jtb6looxokrlb7i8kb` (`cart_id`,`sku_id`),
  KEY `FKj2hskhk5pw7fcpx84ojy8ig6t` (`sku_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `FKj2hskhk5pw7fcpx84ojy8ig6t` FOREIGN KEY (`sku_id`) REFERENCES `sku` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (1,2,1,2),(2,1,1,1),(3,1,10,2),(4,1,11,2),(5,1,12,1),(6,1,14,1),(11,1,18,1),(12,6,20,18),(14,30,24,4),(15,8,24,3),(18,1,26,1),(19,1,26,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_reservation`
--

LOCK TABLES `inventory_reservation` WRITE;
/*!40000 ALTER TABLE `inventory_reservation` DISABLE KEYS */;
INSERT INTO `inventory_reservation` VALUES (1,'2026-05-14 20:37:29.835964','2026-05-14 20:38:29.835964',1,'C59A2AD4049E3A969C33F26220F2FC47',11,'EXPIRED'),(2,'2026-05-14 22:19:43.789623','2026-05-14 22:20:43.789623',1,'C59A2AD4049E3A969C33F26220F2FC47',3,'EXPIRED'),(3,'2026-05-14 22:19:48.897521','2026-05-14 22:20:48.897521',1,'C59A2AD4049E3A969C33F26220F2FC47',3,'EXPIRED'),(4,'2026-05-14 22:20:02.486421','2026-05-14 22:21:02.486421',1,'C59A2AD4049E3A969C33F26220F2FC47',3,'EXPIRED'),(5,'2026-05-14 22:20:45.089195','2026-05-14 22:21:45.089195',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(6,'2026-05-14 22:23:29.108352','2026-05-14 22:24:29.108352',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(7,'2026-05-14 22:23:44.408150','2026-05-14 22:24:44.408150',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(8,'2026-05-14 22:23:59.244343','2026-05-14 22:24:59.244343',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(9,'2026-05-14 22:24:31.182041','2026-05-14 22:25:31.182041',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(10,'2026-05-14 22:24:44.390541','2026-05-14 22:25:44.390541',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(11,'2026-05-14 22:24:58.271046','2026-05-14 22:25:58.271046',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(12,'2026-05-14 22:24:58.551409','2026-05-14 22:25:58.551428',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(13,'2026-05-14 22:25:26.622995','2026-05-14 22:26:26.622995',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(14,'2026-05-14 22:25:35.386513','2026-05-14 22:26:35.386513',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(15,'2026-05-14 22:25:48.374536','2026-05-14 22:26:48.374536',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(16,'2026-05-14 22:26:48.988526','2026-05-14 22:27:48.988526',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(17,'2026-05-14 22:27:16.179696','2026-05-14 22:28:16.179696',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(18,'2026-05-14 22:32:18.599606','2026-05-14 22:33:18.599606',1,'C59A2AD4049E3A969C33F26220F2FC47',1,'EXPIRED'),(19,'2026-05-15 09:53:11.154455','2026-05-15 09:54:11.154455',6,'16D39DAD4FE05A4B62D90DE53D57D509',18,'EXPIRED'),(20,'2026-05-15 09:54:38.043791','2026-05-15 09:55:38.043791',11,'D00873D04F7139412335BC76269D6010',18,'CONFIRMED'),(21,'2026-05-15 09:55:46.428660','2026-05-15 09:56:46.428660',6,'16D39DAD4FE05A4B62D90DE53D57D509',18,'EXPIRED'),(22,'2026-05-15 10:05:50.132363','2026-05-15 10:06:50.132363',6,'16D39DAD4FE05A4B62D90DE53D57D509',18,'EXPIRED'),(23,'2026-05-15 13:11:38.053567','2026-05-15 13:12:38.053567',30,'C72FDA09F8EDE67E521B47D13ADF8336',4,'EXPIRED'),(24,'2026-05-15 13:11:38.069252','2026-05-15 13:12:38.069252',1,'C72FDA09F8EDE67E521B47D13ADF8336',3,'EXPIRED'),(25,'2026-05-15 13:15:51.961296','2026-05-15 13:16:51.961296',30,'C72FDA09F8EDE67E521B47D13ADF8336',4,'EXPIRED'),(26,'2026-05-15 13:15:51.973810','2026-05-15 13:16:51.973810',8,'C72FDA09F8EDE67E521B47D13ADF8336',3,'EXPIRED'),(27,'2026-05-15 13:22:28.391835','2026-05-15 13:23:28.391835',5,'094075D9B557CDD22D473EF90DE4E536',6,'EXPIRED'),(28,'2026-05-15 13:22:28.406118','2026-05-15 13:23:28.406118',3,'094075D9B557CDD22D473EF90DE4E536',8,'EXPIRED'),(29,'2026-05-15 13:40:17.351625','2026-05-15 13:41:17.351639',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(30,'2026-05-15 13:40:17.367657','2026-05-15 13:41:17.367657',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(31,'2026-05-15 13:55:35.163630','2026-05-15 13:56:35.163630',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(32,'2026-05-15 13:55:35.184339','2026-05-15 13:56:35.184339',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(33,'2026-05-15 13:55:46.642404','2026-05-15 13:56:46.642404',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(34,'2026-05-15 13:55:46.657436','2026-05-15 13:56:46.657489',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(35,'2026-05-15 14:00:14.376468','2026-05-15 14:01:14.376468',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(36,'2026-05-15 14:00:14.395833','2026-05-15 14:01:14.395833',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(37,'2026-05-15 14:04:03.165096','2026-05-15 14:05:03.165096',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(38,'2026-05-15 14:04:03.179525','2026-05-15 14:05:03.179525',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(39,'2026-05-15 14:04:06.532440','2026-05-15 14:05:06.532440',1,'094075D9B557CDD22D473EF90DE4E536',1,'EXPIRED'),(40,'2026-05-15 14:04:06.551708','2026-05-15 14:05:06.551708',1,'094075D9B557CDD22D473EF90DE4E536',4,'EXPIRED'),(41,'2026-05-15 14:05:20.462860','2026-05-15 14:06:20.462860',2,'7A9AFAA54E6884FBDADC7551D506C907',14,'EXPIRED'),(42,'2026-05-15 14:08:38.298636','2026-05-15 14:09:38.298636',1,'7A9AFAA54E6884FBDADC7551D506C907',14,'EXPIRED');
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
  `payment_reference` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,'2026-05-14 20:56:57.670615','transontungpl03@gmail.com','Trần Sơn Tùng','0941925795','COD','PENDING','hà nam','PENDING',2800000,NULL,NULL),(2,'2026-05-15 09:55:12.064770','transontungpl03@gmail.com','tran son tung','0941925795','COD','PENDING','hanoi','PENDING',38500000,NULL,NULL),(3,'2026-05-15 14:05:34.454230','transontungpl03@gmail.com','Trần Sơn Tùng','0941925795','BANK_TRANSFER','PENDING','hanoi','PENDING',5800000,NULL,'7A9AFAA54E6884FBDADC7551D506C907'),(4,'2026-05-15 14:08:46.078791','transontungpl03@gmail.com','Trần Sơn Tùng','0523534623','BANK_TRANSFER','PENDING','đá','PENDING',2900000,NULL,'7A9AFAA54E6884FBDADC7551D506C907');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,2800000,1,1,11),(2,3500000,11,2,18),(3,2900000,2,3,14),(4,2900000,1,4,14);
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
INSERT INTO `product` VALUES (1,'Nike Air Max 270',4200000,'Đệm khí 270 độ cực êm',_binary '',8,'https://images.unsplash.com/photo-1542291026-7eec264c27ff','2026-05-13 07:34:40.646076'),(2,'Nike Pegasus 40',3500000,'Giày chạy bộ quốc dân',_binary '',9,'https://images.unsplash.com/photo-1514989940723-e8e51635b782','2026-05-13 07:34:40.646076'),(3,'Air Jordan 1 Low',3200000,'Huyền thoại đường phố',_binary '',11,'https://images.unsplash.com/photo-1597043424260-dc1d23f8f13d','2026-05-13 07:34:40.646076'),(4,'LeBron XXI',5800000,'Giày bóng rổ chuyên nghiệp',_binary '',10,'https://picsum.photos/400/400?random=4','2026-05-13 07:34:40.646076'),(5,'Nike Sportswear Tee',800000,'Áo thun cotton thoáng mát',_binary '',12,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab','2026-05-13 07:34:40.646076'),(6,'Nike Dri-FIT Shorts',950000,'Quần short tập luyện',_binary '',13,'https://picsum.photos/400/400?random=6','2026-05-13 07:34:40.646076'),(7,'Tech Fleece Hoodie',2800000,'Áo nỉ cao cấp giữ nhiệt',_binary '',14,'https://images.unsplash.com/photo-1556821840-3a63f95609a7','2026-05-13 07:34:40.646076'),(8,'Nike Invincible 3',4900000,'Siêu đệm cho chạy bền',_binary '',17,'https://picsum.photos/400/400?random=8','2026-05-13 07:34:40.646076'),(9,'Nike Metcon 9',3800000,'Chuyên dụng cho Gym/Crossfit',_binary '',18,'https://picsum.photos/400/400?random=9','2026-05-13 07:34:40.646076'),(10,'Jordan Stay Loyal',3100000,'Phong cách bóng rổ cổ điển',_binary '',11,'https://picsum.photos/400/400?random=10','2026-05-13 07:34:40.646076'),(11,'Nike Air Force 1 07',2900000,'Biểu tượng văn hóa Sneaker',_binary '',8,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e','2026-05-13 07:34:40.646076'),(12,'Nike Zoom Fly 5',4100000,'Tăng tốc đường chạy',_binary '',9,'https://picsum.photos/400/400?random=12','2026-05-13 07:34:40.646076'),(13,'Nike Vaporfly 3',6500000,'Giày đua marathon đỉnh cao',_binary '',9,'https://picsum.photos/400/400?random=13','2026-05-13 07:34:40.646076'),(14,'Nike Pro Tights',1200000,'Quần legging hỗ trợ cơ',_binary '',16,'https://picsum.photos/400/400?random=14','2026-05-13 07:34:40.646076'),(15,'Yoga Dri-FIT Top',1100000,'Áo tập yoga mềm mại',_binary '',16,'https://picsum.photos/400/400?random=15','2026-05-13 07:34:40.646076'),(16,'Air Jordan 4 Retro',6000000,'Phiên bản giới hạn',_binary '',11,'https://picsum.photos/400/400?random=16','2026-05-13 07:34:40.646076'),(17,'Nike React Miller',3300000,'Ổn định từng bước chạy',_binary '',17,'https://picsum.photos/400/400?random=17','2026-05-13 07:34:40.646076'),(18,'Nike Challenger Shorts',850000,'Quần chạy bộ 2 lớp',_binary '',13,'https://picsum.photos/400/400?random=18','2026-05-13 07:34:40.646076'),(19,'Nike SB Dunk Low',3500000,'Giày trượt ván thời trang',_binary '',8,'https://picsum.photos/400/400?random=19','2026-05-13 07:34:40.646076'),(20,'Elite Basketball Socks',450000,'Vớ bóng rổ chuyên dụng',_binary '',7,'https://picsum.photos/400/400?random=20','2026-05-13 07:34:40.646076');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `product_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `FKkud35ls1d40wpjb5htpp14q4e` (`category_id`),
  CONSTRAINT `FK2k3smhbruedlcrvu6clued06x` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKkud35ls1d40wpjb5htpp14q4e` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (20,7),(1,8),(11,8),(19,8),(2,9),(12,9),(13,9),(4,10),(3,11),(10,11),(16,11),(5,12),(6,13),(18,13),(7,14),(14,16),(15,16),(8,17),(17,17),(9,18);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'https://images.unsplash.com/photo-1542291026-7eec264c27ff',1),(2,'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',1),(3,'https://images.unsplash.com/photo-1608231387042-66d1773070a5',1),(4,'https://images.unsplash.com/photo-1514989940723-e8e51635b782',2),(5,'https://images.unsplash.com/photo-1539185441755-769473a23570',2),(6,'https://images.unsplash.com/photo-1597043424260-dc1d23f8f13d',3),(7,'https://images.unsplash.com/photo-1584000302558-ce492000af5b',3),(8,'https://images.unsplash.com/photo-1605348532760-6753d2c43329',3),(9,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',5),(10,'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',5),(11,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',11),(12,'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',11),(13,'https://images.unsplash.com/photo-1541597473841-a9d123cc7742',4),(14,'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',8),(15,'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',12),(16,'https://images.unsplash.com/photo-1511551203524-9a24350a5771',13),(17,'https://images.unsplash.com/photo-1595341888016-a392ef81b7de',16),(18,'https://images.unsplash.com/photo-1571609834247-477eb503c170',19);
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
INSERT INTO `sku` VALUES (1,1,'Trắng/Đen','42',4200000,20,20,NULL),(2,1,'Trắng/Đen','43',4200000,15,15,NULL),(3,2,'Xanh Dương','41',3500000,25,25,NULL),(4,2,'Xanh Dương','42',3500000,30,30,NULL),(5,3,'Đỏ/Đen','42',3200000,10,10,NULL),(6,3,'Panda','42',3200000,12,12,NULL),(7,4,'Tím','44',5800000,8,8,NULL),(8,5,'Đen','L',800000,100,100,NULL),(9,5,'Trắng','M',800000,80,80,NULL),(10,6,'Xám','XL',950000,50,50,NULL),(11,7,'Xám Đậm','L',2800000,20,20,NULL),(12,8,'Hồng','38',4900000,15,15,NULL),(13,9,'Đen/Ghi','39',3800000,22,22,NULL),(14,11,'Trắng All-White','40',2900000,150,150,NULL),(15,11,'Trắng All-White','41',2900000,150,150,NULL),(16,16,'Military Blue','42',6000000,5,5,NULL),(17,16,'Military Blue','43',6000000,3,3,NULL),(18,19,'Xám/Trắng','42',3500000,1,12,NULL),(19,20,'Trắng','Free Size',450000,500,500,NULL),(20,13,'Cam Neon','42',6500000,10,10,NULL);
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

-- Dump completed on 2026-05-16 18:15:59
