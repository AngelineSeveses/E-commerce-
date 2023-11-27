-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2023 at 03:26 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `act_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL COMMENT 'User id',
  `fullname` varchar(255) NOT NULL COMMENT 'Full name',
  `email` varchar(30) NOT NULL COMMENT 'email address',
  `password_hash` varchar(255) NOT NULL COMMENT 'password hash',
  `is_verified` tinyint(4) NOT NULL COMMENT '0-unverified, 1-verified, 2-pass reset',
  `verification_key` varchar(255) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `fullname`, `email`, `password_hash`, `is_verified`, `verification_key`, `date_created`) VALUES
(1, 'Rhenel Bernisca', 'rhenel@gmail.com', '$2y$10$g9T57csCdu/w.izdg6EVKes0NxpvQeLc.d4aqZdCXd6UuW.T3iBaK', 1, '20220607JaI2qxrWjgb3', '2023-01-13'),
(13, 'Nisperos kevin', 'kcnisperos25@gmail.com', '$2b$10$tX1acnfTTNTsXAAkUL2fv.CTdUQtAxyNBGo2q2iguASit9luT9BX6', 1, 'P5Pkadqi2kW8Zoxj8UBd', '2023-01-14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User id', AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
