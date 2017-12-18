## 表结构

* 用户表[user] - 后续需要补充用户的其他信息

key     | type    | describe
--------|---------|----------
id      | int     | userid, increment
openid  | string  | weixin openid
name    | string  | real name
classes | string  | classes

```
drop table user;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `openid` varchar(32) NOT NULL DEFAULT '' COMMENT '微信openid',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '学员姓名',
  `classes` varchar(64) NOT NULL DEFAULT '归了班' COMMENT '班级名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

```

* 打卡记录表[record]

key   | type  | describe
------| ----- | --------
userid| int   | user key
kind  | string| kind of record
create| string| timestemp of data create date
date  | string| timestemp of record for date


```
DROP table record;
CREATE TABLE `record` (
  `id` int(11) NOT NULL,
  `openid` varchar(32) NOT NULL DEFAULT '' COMMENT '微信openid',
  `kind` int(1) NOT NULL DEFAULT '' COMMENT '打卡类型',
  `date` varchar(16) NOT NULL DEFAULT '' COMMENT '要打卡的时间'
  `create` varchar(16) NOT NULL DEFAULT '' COMMENT '记录创建时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

```