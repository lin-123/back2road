# sqls

- clear odd data `delete from record where userid not in (select id as userid from user)`
