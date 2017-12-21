DROP table `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(32) NOT NULL DEFAULT '' COMMENT '微信openid',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '学员姓名',
  `classes` varchar(64) NOT NULL DEFAULT '归了班' COMMENT '班级名称',
  `createTime` varchar(13) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


DROP table record;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(32) NOT NULL DEFAULT '' COMMENT 'userid',
  `type` int(1) DEFAULT NULL COMMENT '打卡类型',
  `date` varchar(13) NOT NULL DEFAULT '' COMMENT '要打卡的时间',
  `createTime` varchar(13) NOT NULL DEFAULT '' COMMENT '记录创建时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;