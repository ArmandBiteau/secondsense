-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Dim 14 Février 2016 à 15:39
-- Version du serveur :  5.5.47-0+deb8u1
-- Version de PHP :  5.6.17-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `secondsense`
--

-- --------------------------------------------------------

--
-- Structure de la table `has_reward`
--

CREATE TABLE IF NOT EXISTS `has_reward` (
  `facebook_user_id` varchar(25) NOT NULL,
  `reward_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `has_reward`
--

INSERT INTO `has_reward` (`facebook_user_id`, `reward_id`) VALUES
('10207942504911437', 1),
('10208165568158846', 1),
('1259753977383932', 1);

-- --------------------------------------------------------

--
-- Structure de la table `secondsense_friends`
--

CREATE TABLE IF NOT EXISTS `secondsense_friends` (
  `facebook_user_id` varchar(25) NOT NULL,
  `facebook_user_id_friend` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `secondsense_friends`
--

INSERT INTO `secondsense_friends` (`facebook_user_id`, `facebook_user_id_friend`) VALUES
('10208165568158846', '10207942504911437'),
('1259753977383932', '10207942504911437'),
('10207942504911437', '10208165568158846'),
('1259753977383932', '10208165568158846'),
('10207942504911437', '1259753977383932'),
('10208165568158846', '1259753977383932');

-- --------------------------------------------------------

--
-- Structure de la table `secondsense_rewards`
--

CREATE TABLE IF NOT EXISTS `secondsense_rewards` (
`reward_id` int(11) NOT NULL,
  `reward_name` varchar(25) NOT NULL,
  `score_condition` int(11) DEFAULT NULL,
  `game_count_condition` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `secondsense_rewards`
--

INSERT INTO `secondsense_rewards` (`reward_id`, `reward_name`, `score_condition`, `game_count_condition`) VALUES
(1, 'Creators', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `secondsense_scores`
--

CREATE TABLE IF NOT EXISTS `secondsense_scores` (
`score_id` int(11) NOT NULL,
  `high_score` int(11) DEFAULT NULL,
  `game_count` int(11) DEFAULT '0',
  `sum_score` int(11) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `secondsense_scores`
--

INSERT INTO `secondsense_scores` (`score_id`, `high_score`, `game_count`, `sum_score`) VALUES
(1, 1520, 10, 8596),
(2, 1236, 8, 5961),
(3, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `secondsense_users`
--

CREATE TABLE IF NOT EXISTS `secondsense_users` (
  `facebook_user_id` varchar(25) NOT NULL,
  `facebook_user_name` varchar(25) NOT NULL,
  `facebook_user_profile_picture` varchar(250) NOT NULL,
  `score_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `secondsense_users`
--

INSERT INTO `secondsense_users` (`facebook_user_id`, `facebook_user_name`, `facebook_user_profile_picture`, `score_id`) VALUES
('10207942504911437', 'Jordi'' Naire', 'https://scontent.xx.fbcdn.net/hprofile-xpf1/v/t1.0-1/p50x50/12308756_10207999537937227_5054568030571087939_n.jpg?oh=51bad14a26bec42f33e67f5a3d6988bf&o', 1),
('10208165568158846', 'Denis Tribouillois', '', 2),
('1259753977383932', 'Armand Bto', '', 3);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `has_reward`
--
ALTER TABLE `has_reward`
 ADD PRIMARY KEY (`facebook_user_id`,`reward_id`), ADD KEY `FK_has_reward_reward_id` (`reward_id`);

--
-- Index pour la table `secondsense_friends`
--
ALTER TABLE `secondsense_friends`
 ADD PRIMARY KEY (`facebook_user_id`,`facebook_user_id_friend`), ADD KEY `FK_secondsense_friends_facebook_user_id_friend` (`facebook_user_id_friend`);

--
-- Index pour la table `secondsense_rewards`
--
ALTER TABLE `secondsense_rewards`
 ADD PRIMARY KEY (`reward_id`);

--
-- Index pour la table `secondsense_scores`
--
ALTER TABLE `secondsense_scores`
 ADD PRIMARY KEY (`score_id`);

--
-- Index pour la table `secondsense_users`
--
ALTER TABLE `secondsense_users`
 ADD PRIMARY KEY (`facebook_user_id`), ADD KEY `FK_secondsense_users_score_id` (`score_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `secondsense_rewards`
--
ALTER TABLE `secondsense_rewards`
MODIFY `reward_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `secondsense_scores`
--
ALTER TABLE `secondsense_scores`
MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `has_reward`
--
ALTER TABLE `has_reward`
ADD CONSTRAINT `FK_has_reward_facebook_user_id` FOREIGN KEY (`facebook_user_id`) REFERENCES `secondsense_users` (`facebook_user_id`),
ADD CONSTRAINT `FK_has_reward_reward_id` FOREIGN KEY (`reward_id`) REFERENCES `secondsense_rewards` (`reward_id`);

--
-- Contraintes pour la table `secondsense_friends`
--
ALTER TABLE `secondsense_friends`
ADD CONSTRAINT `FK_secondsense_friends_facebook_user_id` FOREIGN KEY (`facebook_user_id`) REFERENCES `secondsense_users` (`facebook_user_id`),
ADD CONSTRAINT `FK_secondsense_friends_facebook_user_id_friend` FOREIGN KEY (`facebook_user_id_friend`) REFERENCES `secondsense_users` (`facebook_user_id`);

--
-- Contraintes pour la table `secondsense_users`
--
ALTER TABLE `secondsense_users`
ADD CONSTRAINT `FK_secondsense_users_score_id` FOREIGN KEY (`score_id`) REFERENCES `secondsense_scores` (`score_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
