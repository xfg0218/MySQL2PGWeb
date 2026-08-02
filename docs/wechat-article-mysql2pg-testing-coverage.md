# 167张表+110个函数+42个视图：这个开源工具如何用CI流水线确保MySQL到PG的平滑迁移

> 每一个测试用例背后，都是一次真实迁移场景的缩影

## 凌晨3点的迁移告警，你经历过吗？

数据库迁移，是所有技术团队最紧张的时刻之一。

MySQL 要迁到 PostgreSQL，表面上只是换个数据库，实际上：

- 表结构语法不兼容，`AUTO_INCREMENT` 要改成 `SERIAL`
- 分区表语法差异，RANGE/LIST/HASH 分区策略完全不同
- 视图定义里的 `IFNULL`、`GROUP_CONCAT`、JSON 函数全部要转换
- 存储函数里的游标、变量、流程控制逻辑要逐一适配
- 外键约束、唯一键、全文索引、空间索引……一个都不能错

**只要有一个环节出错，数据就可能丢、查不出、或者写不进去。**

今天介绍的这个开源项目 **MySQL2PG**，用一套**全覆盖的测试体系 + CI 自动化流水线**，把"心跳迁移"变成了"安心迁移"。

---

## 一、167 张测试表：从基础类型到业务场景的全覆盖

`create_table.sql` 文件包含了 **167 个测试表案例**，按覆盖范围分为 5 大类：

### 第一类：基础类型与DDL语法（case_01 ~ case_40）

覆盖数值、字符集/排序规则、JSON、时间、默认值、自增、约束、生成列、保留字、命名风格等。

| 测试范围 | 表案例 | 覆盖内容 |
|---------|--------|---------|
| 整数类型 | case_01 | tinyint/smallint/mediumint/int/bigint/integer，含精度变体 |
| 布尔类型 | case_02 | TINYINT(1) → BOOLEAN，大小写不敏感 |
| 浮点数类型 | case_03 | float/double/decimal/numeric/real，含精度和标度 |
| 字符集类型 | case_04~07 | utf8/utf8mb4/latin1/utf16/ascii，含排序规则 |
| JSON类型 | case_08 | json字段，支持嵌套结构 |
| 日期时间类型 | case_09 | date/time/datetime/timestamp/year，含精度变体 |
| 默认值变体 | case_10 | 数值默认值、字符串默认值、CURRENT_TIMESTAMP |
| 自增类型 | case_11 | AUTO_INCREMENT，多自增字段处理 |
| 无符号类型 | case_12 | unsigned/zerofill，无符号整数转换 |
| 枚举和集合 | case_13 | enum/set → VARCHAR(255) |
| 二进制类型 | case_14 | binary/varbinary/blob/longblob/mediumblob/tinyblob → BYTEA |
| 表选项 | case_15 | ROW_FORMAT/COLLATE/CHARSET 等表级选项 |
| 分区表 | case_16 | RANGE 分区，按年份分区 |
| 临时表 | case_17 | TEMPORARY TABLE 处理 |
| 引号标识符 | case_18 | 反引号引用标识符 |
| 注释类型 | case_19 | 列注释和表注释 |
| 约束类型 | case_20 | PRIMARY KEY/UNIQUE KEY/INDEX 复合约束 |
| 虚拟列 | case_21 | GENERATED ALWAYS AS VIRTUAL |
| 空间类型 | case_22 | geometry/point/linestring/polygon 等 |
| 怪异语法 | case_23 | INTEGER(10)/DOUBLE PRECISION(10,2) 等非标准语法 |
| 边缘情况 | case_24 | 混合字符集、自增主键、longblob |
| MySQL 8.0保留字 | case_25 | rank/system/groups/window/function/role/admin |
| 不可见列 | case_26 | INVISIBLE COLUMN + 不可见索引 |
| 检查约束 | case_27 | CHECK (age > 18) 约束 |
| 函数索引 | case_28 | MySQL 8.0 表达式索引 |
| 默认值变体 | case_29 | char/json 默认值 |
| 字符集和排序规则 | case_30 | utf8mb4_general_ci/utf8mb4_bin |
| 系统表模拟 | case_31 | 模拟 mysql.db 表结构 |
| 复杂生成列 | case_32 | CASE WHEN 表达式的生成列 |
| 降序索引 | case_33 | DESC 索引，混合方向主键 |
| 表选项 | case_34 | ENGINE=InnoDB 显式指定 |
| 枚举字符集 | case_35 | enum/set 带字符集和排序规则 |
| 大写表名 | case_36 | UPPERCASE 表名和列名 |
| 驼峰命名 | case_37 | ProductId/ProductName/LastUpdate |
| 蛇形命名 | case_38 | product_id/product_name/last_update |
| 下划线命名 | case_39 | 带下划线的命名风格 |
| 默认值 | case_40 | 各种默认值变体 |

### 第二类：索引/约束与表特性（case_41 ~ case_80）

覆盖外键、全文、空间、复合主键、存储引擎、分区、复制建表、压缩、统计信息等。

| 测试范围 | 表案例 | 覆盖内容 |
|---------|--------|---------|
| 外键约束 | case_41 | 父子表关联，ON DELETE CASCADE/ON UPDATE SET NULL |
| 全文索引 | case_42 | FULLTEXT KEY，支持自然语言搜索 |
| 空间索引 | case_43 | SPATIAL INDEX，地理空间数据 |
| 复合主键 | case_44 | 多列组合主键 |
| 存储生成列 | case_45 | STORED/VIRTUAL 生成列 |
| MyISAM引擎 | case_46 | MyISAM 存储引擎转换 |
| MEMORY引擎 | case_47 | MEMORY 存储引擎转换 |
| 索引类型 | case_48 | BTREE/HASH 索引 |
| LIST分区 | case_49 | PARTITION BY LIST |
| HASH分区 | case_50 | PARTITION BY HASH，4个分区 |
| 表复制LIKE | case_51 | CREATE TABLE ... LIKE |
| 表复制AS | case_52 | CREATE TABLE ... AS SELECT |
| 延迟约束 | case_53 | 延迟约束验证 |
| 表空间 | case_54 | TABLESPACE 指定 |
| 压缩表 | case_55 | ROW_FORMAT=COMPRESSED |
| 加密表 | case_56 | 透明数据加密 |
| 列级权限 | case_57 | 敏感数据列权限 |
| 子分区 | case_58 | RANGE + HASH 复合分区，12个子分区 |
| 复杂生成列 | case_59 | 多函数表达式生成列 |
| 统计信息 | case_60 | STATS_PERSISTENT/STATS_AUTO_RECALC |
| 大量列 | case_61 | 60+列宽表，覆盖所有MySQL类型 |
| 各种默认值 | case_62 | ON UPDATE CURRENT_TIMESTAMP |
| 字符集排序规则 | case_63 | 多字符集混合 |
| BIT类型 | case_64 | bit(1)/bit(8)/bit(16)/bit(32)/bit(64) |
| YEAR类型 | case_65 | year(4)/year 默认值 |
| 空间子类型 | case_66 | geometry/point 带注释 |
| 触发器模拟 | case_67 | created_at/updated_at 自动更新 |
| 视图模拟 | case_68 | 模拟视图结构的表 |
| 深层嵌套JSON | case_69 | config/tags/metadata JSON字段 |
| utf8mb4_900排序 | case_70 | MySQL 8.0 新排序规则 |
| 函数索引 | case_71 | concat 表达式索引 |
| 检查约束正则 | case_72 | CHECK (email LIKE '%@%') |
| 混合生成列 | case_73 | STORED + VIRTUAL 混合 |
| 混合可见性列 | case_74 | 可见/不可见列混合 |
| 降序主键 | case_75 | ASC/DESC 混合方向主键 |
| BLOB前缀索引 | case_76 | BLOB 前10字节索引 |
| TEXT前缀索引 | case_77 | TEXT 前20字符索引 |
| 多列唯一NULL | case_78 | 唯一约束允许NULL |
| SERIAL默认值 | case_79 | SERIAL 别名 |
| ON UPDATE时间戳 | case_80 | datetime ON UPDATE CURRENT_TIMESTAMP |

### 第三类：边界语法与MySQL 5.7/8.0特性（case_81 ~ case_120）

覆盖SRID、长标识符、高精度数值、多值索引、窗口函数、JSON_TABLE、锁相关语法等。

| 测试范围 | 表案例 | 覆盖内容 |
|---------|--------|---------|
| 空间SRID | case_81 | geometry 带 SRID |
| 宽表 | case_82 | 10列相似列 |
| 长标识符 | case_83 | 64字符最大长度列名 |
| 保留字引用 | case_84 | select/update/delete/insert 保留字 |
| 高精度数值 | case_85 | decimal(65,30) 最大精度 |
| 时间类型混合 | case_86 | 多种时间类型混合 |
| 文本二进制混合 | case_87 | text/blob 混合 |
| 数值边界 | case_88 | 最大/最小数值 |
| 建表方式 | case_89 | LIKE/AS/ENGINE 多种建表方式 |
| 多值索引 | case_90 | MySQL 8.0 多值索引 |
| 窗口函数 | case_91 | ROW_NUMBER/RANK 窗口函数 |
| JSON_TABLE | case_92 | MySQL 8.0 JSON_TABLE |
| 锁语法 | case_93 | SELECT ... FOR UPDATE |
| CTE | case_94 | WITH 子句 |
| 递归CTE | case_95 | 递归查询 |
| LIST COLUMNS分区 | case_96 | PARTITION BY LIST COLUMNS |
| RANGE COLUMNS分区 | case_97 | PARTITION BY RANGE COLUMNS |
| KEY分区 | case_98 | PARTITION BY KEY |
| LINEAR HASH分区 | case_99 | PARTITION BY LINEAR HASH |
| 优化器提示 | case_100 | FORCE INDEX/USE INDEX |

### 第四类：业务化建模样例（case_121 ~ case_155）

覆盖电商、CMS、财务、社交、日志、医疗、酒店、餐厅等真实业务场景。

| 业务场景 | 表案例 | 说明 |
|---------|--------|------|
| 电商系统 | case_121~130 | 订单、商品、用户、购物车、支付 |
| CMS系统 | case_131~135 | 文章、分类、标签、评论 |
| 财务系统 | case_136~140 | 账户、交易、报表 |
| 社交网络 | case_141~145 | 用户、好友、动态、点赞 |
| 日志系统 | case_146~148 | 访问日志、错误日志 |
| 医疗系统 | case_149~150 | 患者、病历、处方 |
| 酒店管理 | case_151~152 | 客房、预订、入住 |
| 餐厅系统 | case_153~155 | 菜品、订单、评价 |

### 第五类：新增综合增强场景（case_156 ~ case_167）

覆盖复合外键、JSON生成列、时间类型组合、文本二进制混合、数值边界、建表方式专项。

| 测试范围 | 表案例 | 覆盖内容 |
|---------|--------|---------|
| 复合外键 | case_156 | 多列复合外键约束 |
| JSON生成列 | case_157 | JSON 字段生成列 |
| 时间类型组合 | case_158 | datetime(6)/timestamp(6) 组合 |
| 文本二进制混合 | case_159 | text/blob/varbinary 混合 |
| 数值边界 | case_160 | decimal/numeric 边界值 |
| 建表方式专项 | case_161~167 | LIKE/AS/ENGINE/CHARSET 组合测试 |

---

## 二、分区表专项测试：4种分区策略全覆盖

`create_comments_partition_table.sql` 文件专门测试分区表的迁移兼容性：

### 1. case_169_merge：RANGE分区（单分区）

```sql
-- 特点：
-- 1. 基础 RANGE 分区示例，仅包含一个分区
-- 2. 主键必须包含分区键 issue_id
-- 3. 使用 ENGINE = InnoDB 指定存储引擎
-- 4. 适用于按整数范围进行简单数据划分的场景
-- 5. row_format=dynamic 支持动态行格式
```

### 2. test_partition_170_range_int：RANGE分区（多分区）

```sql
-- 特点：
-- 1. 经典 RANGE 分区模式，包含 5 个分区
-- 2. 分区范围递增：1000, 2000, 3000, 10000, MAXVALUE
-- 3. 使用 MAXVALUE 作为最后一个分区的边界
-- 4. 主键包含分区键，满足 MySQL 分区约束
-- 5. 适用于按连续整数范围均匀分布数据的场景
-- 6. 常用于时间序列数据、ID 范围分片等场景
```

### 3. test_partition_172_list_int：LIST分区

```sql
-- 特点：
-- 1. LIST 分区模式，按离散值列表进行分区
-- 2. 分区键为状态字段，支持业务状态分类
-- 3. 分区值为离散集合：p0(0), p1(1), p2(2,3)
-- 4. 一个分区可包含多个离散值（如 p2 包含 2 和 3）
-- 5. 主键必须包含分区键 status
-- 6. 适用于按枚举值、状态码等离散值进行数据划分
-- 7. 注意：LIST 分区不支持 DEFAULT 分区，插入不在列表中的值会报错
```

### 4. test_partition_173_range_multi：RANGE分区（非均匀分布）

```sql
-- 特点：
-- 1. RANGE 分区模式，包含 5 个分区
-- 2. 分区范围呈指数增长：1000, 5000, 10000, 50000, MAXVALUE
-- 3. 非均匀分区策略，适合数据分布不均匀的场景
-- 4. 早期分区范围小，后期分区范围大
-- 5. 包含 TEXT 类型字段，测试大字段在分区表中的兼容性
-- 6. 主键包含分区键 issue_id
-- 7. 适用于数据量随时间增长的业务场景
```

---

## 三、唯一键测试：6种唯一约束场景

`create_unique_key_table.sql` 文件专门验证唯一键约束在迁移时的兼容性：

### 唯一键类型分类

| 类型 | 说明 | 测试表 |
|------|------|--------|
| 普通表 | 不带唯一索引 | mpp_case_normal |
| 单列唯一索引 | 约束单个字段唯一性 | mpp_case_unique_single |
| 多列唯一索引 | 约束多字段组合唯一性 | mpp_case_unique_multi |
| 普通索引 | 不应触发分布式约束 | mpp_case_non_unique_idx |
| 主键+唯一索引混合 | 验证唯一索引列是否进入分布键 | mpp_case_pk_plus_unique |
| 多个唯一索引 | 验证分布键在多唯一约束场景下的调整 | mpp_case_multi_unique_paths |
| 宽表复合索引 | 验证普通复合索引不会触发分布键 | mpp_case_non_unique_composite |

### PostgreSQL/Greenplum迁移注意事项

- UNIQUE INDEX → CREATE UNIQUE INDEX
- 分区表唯一键必须包含分区键
- 分布式表需注意数据分布策略
- NULL 值处理：MySQL允许多个NULL，PostgreSQL也允许

---

## 四、索引全覆盖：5大类索引测试

`create_index.sql` 文件包含以下索引类型：

### 1. 基础索引类型

- **单列索引**：最基本的索引类型，加速单列查询
- **复合索引**：多列组合索引，支持索引覆盖和最左前缀匹配
- **前缀索引**：对字符串前缀创建索引，减少索引大小

### 2. 特殊类型索引

- **全文索引 (FULLTEXT)**：支持自然语言搜索和布尔搜索
- **空间索引 (SPATIAL)**：支持地理空间数据查询
- **函数索引**：基于函数或表达式创建的索引

### 3. 分区表索引

- **RANGE分区索引**：按范围分区的表索引
- **LIST分区索引**：按离散值列表分区的表索引
- **HASH分区索引**：按哈希值分区的表索引
- **子分区索引**：复合分区策略的索引

### 4. 存储引擎相关索引

- **InnoDB索引**：聚簇索引，支持事务
- **MyISAM索引**：非聚簇索引，不支持事务
- **MEMORY索引**：内存表索引，数据易失

### 5. 特殊场景索引

- **压缩表索引**：ROW_FORMAT=COMPRESSED的表索引
- **字符集索引**：不同字符集字段的索引
- **排序规则索引**：不同collation的索引
- **生成列索引**：虚拟列或存储生成列的索引

---

## 五、42 个测试视图：5个复杂度等级

`create_view.sql` 定义了 **42 个测试视图**，按复杂度分为 5 个等级：

### 视图列表

| 序号 | 视图名 | 复杂度 | 说明 |
|------|--------|--------|------|
| 1 | view_case01_simple_integers | 简单 | 基于整数类型表的简单查询 |
| 2 | view_case02_simple_boolean | 简单 | 基于布尔类型表的简单查询 |
| 3 | view_case03_simple_floats | 简单 | 基于浮点数类型表的简单查询 |
| 4 | view_case04_simple_chars | 简单 | 基于字符类型表的简单查询 |
| 5 | view_case09_simple_datetime | 简单 | 基于日期时间类型表的简单查询 |
| 6~8 | view_case10~12 | 中等 | 多表连接查询（2~3表） |
| 9 | view_case13_complex_subquery | 复杂 | 包含子查询的复杂视图 |
| 10 | view_case14_complex_aggregate | 复杂 | 包含聚合函数的复杂视图 |
| 11 | view_case15_complex_conditional | 复杂 | 包含条件函数的复杂视图 |
| 12 | view_case16_advanced_window | 高级 | 包含窗口函数的高级视图 |
| 13 | view_case17_advanced_json | 高级 | 包含JSON操作的高级视图 |
| 14 | view_case18_advanced_datetime | 高级 | 包含日期时间函数的高级视图 |
| 15 | view_case19_advanced_string | 高级 | 包含字符串函数的高级视图 |
| 16 | view_case20_advanced_math | 高级 | 包含数学函数的高级视图 |
| 17 | view_case21_extreme_comprehensive | 高级 | 综合应用所有特性的极端复杂视图 |
| 18 | view_case22_mysql8_json_table | MySQL 8.0 | 使用JSON_TABLE函数 |
| 19 | view_case23_mysql8_cte | MySQL 8.0 | 使用WITH子句（CTE） |
| 20 | view_case24_mysql8_window_advance | MySQL 8.0 | 窗口函数高级用法 |
| 21 | view_case25_mysql8_regexp | MySQL 8.0 | 正则表达式函数 |
| 22 | view_case26_mysql8_gis | MySQL 8.0 | GIS空间函数 |
| 23 | view_case27_mysql8_json_agg | MySQL 8.0 | JSON聚合函数 |
| 24 | view_case28_mysql8_time_window | MySQL 8.0 | 时间窗口函数 |
| 25 | view_case29_mysql8_complex_case | MySQL 8.0 | 复杂CASE表达式 |
| 26 | view_case30_mysql8_multi_join | MySQL 8.0 | 多表连接和子查询 |
| 27 | view_case31_mysql8_window_group | MySQL 8.0 | 窗口函数和分组 |
| 28 | view_case32_mysql8_json_path | MySQL 8.0 | JSON路径表达式 |
| 29 | view_case33_mysql8_string_agg | MySQL 8.0 | 字符串聚合函数 |
| 30 | view_case34_mysql8_math_advance | MySQL 8.0 | 数学高级函数 |
| 31 | view_case35_mysql8_datetime_advance | MySQL 8.0 | 日期时间高级函数 |
| 32 | view_case36_mysql8_conditional_agg | MySQL 8.0 | 条件聚合函数 |
| 33 | view_case37_mysql8_multi_cte | MySQL 8.0 | 多CTE嵌套 |
| 34 | view_case38_mysql8_window_filter | MySQL 8.0 | 窗口函数和过滤 |
| 35 | view_case39_mysql8_json_modify | MySQL 8.0 | JSON修改函数 |
| 36 | view_case40_mysql8_complex_join | MySQL 8.0 | 复杂连接和子查询 |
| 37 | view_case41_mysql8_ultimate | MySQL 8.0 | 综合高级特性 |

### 视图复杂度分类

1. **简单视图**（单表查询）：5个
2. **中等复杂度视图**（多表连接）：3个
3. **复杂视图**（子查询、聚合函数）：3个
4. **高级视图**（窗口函数、JSON操作）：6个
5. **MySQL 8.0特高级视图**：20个

---

## 六、110 个存储函数：最多涉及10表关联

`create_function.sql` 定义了 **110 个复杂的存储函数**，每个函数都有明确的测试目标：

### 复杂分析函数（func_001 ~ func_100）

| 函数名 | 涉及表类型 | 特性 |
|-------|-----------|------|
| func_001 | 分区表+枚举类型 | 右连接+左连接混合查询 |
| func_002 | 零填充+排序规则 | 多表全连接分析 |
| func_003 | 位类型+外键约束 | DESC索引+枚举字符集 |
| func_004 | JSON数组+UTF8MB4 | 几何类型+视图模拟 |
| func_005 | 行格式+驼峰命名 | 分区线性哈希 |
| func_006 | 默认值变体+隐式索引 | 分区范围列 |
| func_007 | 分区键+函数索引 | 父子表关联 |
| func_008 | 复制表+全文检索 | 宽表+JSON字段 |
| func_009 | 无符号整数+时区 | 生成列+唯一约束 |
| func_010 | 索引类型+空间索引 | 子分区处理 |
| ... | ... | ... |
| func_050 | 虚拟列+默认值 | MySQL8特性适配 |
| func_051 | 函数索引+JSON | 函数索引迁移 |
| func_052 | 行格式+压缩 | 存储格式转换 |
| func_053 | 延迟约束+外键 | 约束验证策略 |
| func_054 | 序列默认+自增 | 序列生成适配 |
| func_055 | 更新时间戳+触发器 | 时间戳自动更新 |
| func_056 | 不可见列+表达式 | MySQL8新特性 |
| func_057 | 几何类型+SRID | 空间参考系统转换 |
| func_058 | 子分区+哈希 | 复合分区策略 |
| func_059 | 高精度数值+decimal | 精度计算 |
| func_060 | JSON生成列+索引 | JSON索引转换 |
| func_061~100 | 各种组合场景 | 覆盖所有MySQL函数语法 |

### 业务场景函数（func_101 ~ func_110）

| 函数名 | 涉及表 | 特性 |
|-------|--------|------|
| func_101_case_156_order_amount | 2个表 | 复合主外键聚合+空值处理 |
| func_102_case_157_extract_bizid | JSON字段 | json_extract+json_unquote |
| func_103_case_158_period_key | 时间类型 | datetime(6)+date_format |
| func_104_case_159_attachment_size | BLOB字段 | length+单行查询 |
| func_105_case_160_numeric_score | 高精度数值 | decimal/numeric聚合 |
| func_106_case_daily_order_item_count | 复合外键子表 | 按单统计明细数 |
| func_107_case_daily_order_avg_price | 订单明细金额 | 平均单价计算 |
| func_108_case_daily_payload_event_time | JSON数据 | 事件时间提取 |
| func_109_case_daily_deleted_title | 文本与标记字段 | 逻辑删除标题拼接 |
| func_110_case_daily_numeric_risk_tag | 高精度数值 | 风险等级打标 |

**每个函数 30~200 行代码，覆盖了 MySQL 存储过程的核心语法。**

---

## 七、CI流水线：10种数据库版本组合的自动化测试

有了测试用例还不够，**怎么确保每次代码提交都不会破坏迁移功能？**

MySQL2PG 的 GitHub Actions CI 流水线给出了答案：

### 测试执行顺序

CI 流水线按顺序执行 **10 种数据库版本组合**，避免资源竞争：

```
MySQL 5.7 → PostgreSQL 12  ↓
MySQL 5.7 → PostgreSQL 14  ↓
MySQL 5.7 → PostgreSQL 16  ↓
MySQL 5.7 → PostgreSQL 17  ↓
MySQL 5.7 → PostgreSQL 18  ↓
MySQL 8.0 → PostgreSQL 12  ↓
MySQL 8.0 → PostgreSQL 14  ↓
MySQL 8.0 → PostgreSQL 16  ↓
MySQL 8.0 → PostgreSQL 17  ↓
MySQL 8.0 → PostgreSQL 18
```

### 每个测试 Job 的执行流程

每个 Job 都包含以下步骤：

```yaml
1. 启动 MySQL 容器（5.7 或 8.0）
2. 启动 PostgreSQL 容器（12/14/16/17/18）
3. 等待两个数据库就绪（health check）
4. 执行 SQL 脚本初始化测试数据：
   ├── create_table.sql          # 167 张表
   ├── insert_data.sql           # 每张表 10 条测试数据
   ├── create_index.sql          # 数百个索引
   ├── create_view.sql           # 42 个视图
   ├── create_function.sql       # 110 个函数
   ├── create_user.sql           # 用户和权限
   └── create_comments_partition_table.sql  # 分区表注释
5. 生成 config.yml 配置文件
6. 编译并运行 mysql2pg 工具
7. 上传转换日志（失败时）
```

### 测试覆盖率

CI 流水线确保：

- ✅ **167 张表**的结构转换
- ✅ **1670 行数据**的同步验证（每张表 10 行）
- ✅ **数百个索引**的转换（主键、唯一键、普通索引、全文索引）
- ✅ **42 个视图**的语法转换
- ✅ **110 个函数**的语法映射
- ✅ **用户和权限**的转换
- ✅ **分区表**的处理（RANGE/LIST/HASH/子分区）
- ✅ **唯一键**的兼容性验证
- ✅ **10 种** MySQL × PostgreSQL 版本组合

---

## 八、转换能力全景图

MySQL2PG 的转换能力可以总结为以下几个维度：

### 1. 表结构转换（DDL）

| MySQL 语法 | PostgreSQL 转换 |
|-----------|----------------|
| `AUTO_INCREMENT` | `SERIAL` / `BIGSERIAL` |
| `TINYINT(1)` | `BOOLEAN` |
| `INT` / `INTEGER` | `INTEGER` |
| `BIGINT` | `BIGINT` |
| `FLOAT` | `REAL` |
| `DOUBLE` | `DOUBLE PRECISION` |
| `DATETIME` | `TIMESTAMP` |
| `VARCHAR(n)` | `VARCHAR(n)` |
| `TEXT` / `LONGTEXT` | `TEXT` |
| `BLOB` / `LONGBLOB` | `BYTEA` |
| `JSON` | `JSON` |
| `ENUM` | `VARCHAR(255)` |
| `SET` | `VARCHAR(255)` |
| `DECIMAL(p,s)` | `DECIMAL(p,s)` |
| `BIT(n)` | `BIT(n)` |
| `YEAR` | `INTEGER` |
| `UNSIGNED` | 移除，使用有符号类型 |

### 2. 视图函数转换（50+ 函数映射）

| MySQL 函数 | PostgreSQL 转换 |
|-----------|----------------|
| `IFNULL(a, b)` | `COALESCE(a, b)` |
| `IF(cond, t, f)` | `CASE WHEN cond THEN t ELSE f END` |
| `GROUP_CONCAT()` | `string_agg()` |
| `CONCAT(a, b)` | `a \|\| b` |
| `NOW()` | `CURRENT_TIMESTAMP` |
| `DATE_FORMAT()` | `to_char()` |
| `STR_TO_DATE()` | `to_date()` |
| `UNIX_TIMESTAMP()` | `extract(epoch from ...)` |
| `FROM_UNIXTIME()` | `to_timestamp()` |
| `JSON_EXTRACT()` | `jsonb_path_query()` |
| `JSON_OBJECT()` | `json_build_object()` |
| `JSON_ARRAY()` | `json_build_array()` |
| `JSON_INSERT()` | `jsonb_set()` |
| `JSON_REPLACE()` | `jsonb_set()` |
| `JSON_SET()` | `jsonb_set()` |
| `JSON_REMOVE()` | `-` 操作符 |
| `JSON_MERGE_PATCH()` | `\|\|` 连接操作符 |
| `JSON_KEYS()` | `jsonb_object_keys()` |
| `JSON_LENGTH()` | `jsonb_array_length()` |
| `ROUND(col, n)` | `ROUND(col::NUMERIC, n)` |
| `MOD(col, n)` | `MOD(col::NUMERIC, n)` |
| `REGEXP_LIKE()` | `~` 操作符 |
| `REGEXP_REPLACE()` | `regexp_replace()` |
| `REGEXP_SUBSTR()` | `substring()` |
| `REGEXP_INSTR()` | `position()` |
| `LOCATE()` | `strpos()` |
| `INSTR()` | `strpos()` |
| `JSON_ARRAYAGG()` | `json_agg()` |
| `JSON_OBJECTAGG()` | `json_object_agg()` |

### 3. 索引转换

| MySQL 索引 | PostgreSQL 转换 |
|-----------|----------------|
| 主键 | PRIMARY KEY |
| 唯一索引 | UNIQUE INDEX |
| 普通索引 | INDEX |
| 全文索引 | tsvector + GIN 索引 |
| 空间索引 | PostGIS 扩展 |
| 复合索引 | 多列索引 |
| 前缀索引 | 表达式索引 |
| BTREE 索引 | BTREE 索引 |
| HASH 索引 | HASH 索引 |
| DESC 索引 | DESC 索引 |
| 函数索引 | 表达式索引 |

### 4. 分区表处理

| MySQL 分区 | PostgreSQL 处理 |
|-----------|----------------|
| RANGE 分区 | 声明式分区（RANGE） |
| LIST 分区 | 声明式分区（LIST） |
| HASH 分区 | 声明式分区（HASH） |
| KEY 分区 | 转换为 HASH 分区 |
| LINEAR HASH | 转换为普通 HASH |
| 子分区 | 复合分区 |
| LIST COLUMNS | 转换为 LIST |
| RANGE COLUMNS | 转换为 RANGE |

---

## 九、数据验证：确保一行都不丢

迁移完成后，MySQL2PG 会自动执行**数据验证**：

```
✅ 转换表结构：167 张表
✅ 同步表数据：1670 行（167 表 × 10 行）
✅ 转换索引：数百个
✅ 转换视图：42 个
✅ 转换函数：110 个
✅ 数据验证：MySQL 行数 = PostgreSQL 行数
```

**如果任何一张表的行数不一致，CI 流水线会立即失败，阻止有问题的代码合并。**

---

## 十、代码测试体系：确保每一次迁移都能成功

有了全面的测试用例还不够，**代码本身的稳定性和可靠性如何保障？**

MySQL2PG 建立了**三层测试体系**，确保每一行代码都经过严格验证：

### 第一层：单元测试（Unit Tests）

单元测试是代码质量的第一道防线，覆盖核心转换逻辑的每个细节：

#### 测试覆盖范围

| 测试模块 | 测试文件 | 覆盖内容 |
|---------|---------|---------|
| 配置解析 | internal/config/* | YAML 配置解析、参数验证、默认值处理 |
| 视图转换 | internal/converter/postgres/sync_viewddl_test.go | 50+ 函数转换、语法映射、边界情况 |
| 函数转换 | internal/converter/postgres/sync_functions_test.go | 113 个函数语法映射、参数转换 |
| 数据同步 | internal/converter/postgres/sync_data_test.go | 批量读取、类型转换、零值处理 |
| DDL 转换 | internal/converter/postgres/sync_tableddl_test.go | 40+ 类型映射、约束转换、索引处理 |
| 报告生成 | internal/report/* | 日志解析、HTML 生成、统计计算 |
| PostgreSQL 连接 | internal/postgres/* | 连接池、批量插入、事务管理 |

#### 关键测试场景

**1. 视图函数转换测试（88+ 测试用例）**

```go
// 示例：IFNULL 转换测试
tests := []struct{
    name     string
    input    string
    expected string
}{
    {"IFNULL 单参数", "IFNULL(a)", "COALESCE(a)"},
    {"IFNULL 双参数", "IFNULL(a, b)", "COALESCE(a, b)"},
    {"IFNULL 嵌套", "IFNULL(IFNULL(a, b), c)", "COALESCE(COALESCE(a, b), c)"},
    {"IFNULL 在视图中", "SELECT IFNULL(col, 0) FROM t", "SELECT COALESCE(col, 0) FROM t"},
}
```

**2. 数值函数转换测试**

```go
// ROUND/MOD 转换测试
tests := []struct{
    name     string
    input    string
    expected string
}{
    {"ROUND 单参数", "ROUND(col, 2)", "ROUND(col::NUMERIC, 2)"},
    {"MOD 单参数", "MOD(col, 10)", "MOD(col::NUMERIC, 10)"},
    {"ROUND 嵌套", "ROUND(ROUND(col, 3), 2)", "ROUND(ROUND(col::NUMERIC, 3)::NUMERIC, 2)"},
}
```

**3. 日期时间函数转换测试**

```go
// DATE_FORMAT 转换测试
tests := []struct{
    name     string
    input    string
    expected string
}{
    {"DATE_FORMAT 简单", "DATE_FORMAT(dt, '%Y-%m-%d')", "to_char(dt, 'YYYY-MM-DD')"},
    {"DATE_FORMAT 复杂", "DATE_FORMAT(dt, '%Y-%m-%d %H:%i:%s')", "to_char(dt, 'YYYY-MM-DD HH24:MI:SS')"},
}
```

**4. JSON 函数转换测试**

```go
// JSON 函数转换测试
tests := []struct{
    name     string
    input    string
    expected string
}{
    {"JSON_EXTRACT", "JSON_EXTRACT(doc, '$.name')", "doc->>'name'"},
    {"JSON_OBJECT", "JSON_OBJECT('key', val)", "json_build_object('key', val)"},
    {"JSON_ARRAY", "JSON_ARRAY(a, b)", "json_build_array(a, b)"},
}
```

#### 单元测试执行

```bash
# 运行所有单元测试
go test -v -race -coverprofile=coverage.out ./...

# 按包运行测试
go test ./internal/config/...
go test ./internal/converter/postgres/...
go test ./internal/postgres/...
go test ./internal/report/...

# 查看覆盖率
go tool cover -html=coverage.out -o coverage.html
```

**当前代码覆盖率：88%+**，确保核心转换逻辑的每一行代码都被测试覆盖。

### 第二层：集成测试（Integration Tests）

集成测试在真实的 MySQL 和 PostgreSQL 环境中验证端到端的迁移流程：

#### 测试矩阵（84 个测试用例）

| 测试类别 | 测试数量 | 覆盖内容 |
|---------|---------|---------|
| 连通性测试 | 4 | MySQL/PostgreSQL 连接、版本检测、test_only 模式 |
| DDL 转换 | 10 | 表结构、类型映射、约束、默认值、自增 |
| 数据同步 | 8 | 批量读取、类型转换、空表、大字段、零值处理 |
| 视图转换 | 6 | 简单视图、复杂视图、MySQL 8.0 特性视图 |
| 索引转换 | 8 | 主键、唯一键、普通索引、全文索引、复合索引 |
| 函数转换 | 6 | 存储函数语法、参数转换、返回值处理 |
| 用户权限 | 6 | 用户创建、角色转换、表级权限、列级权限 |
| 运行选项 | 12 | 并发控制、批量大小、黑白名单、跳过已存在表 |
| 边界场景 | 10 | 空数据库、大表、长事务、特殊字符、保留字 |
| 错误处理 | 14 | 连接失败、语法错误、权限不足、类型不兼容 |

#### 集成测试执行流程

```bash
#!/bin/bash
# 脚本：scripts/integrationtests/run_integration_tests.sh

# 1. 修改 config.yml 配置
cat > config.yml << EOF
mysql:
  host: 127.0.0.1
  port: 3306
  username: root
  password: rootpassword
  database: test_db
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: postgrespassword
  database: test_db
conversion:
  options:
    tableddl: true
    data: true
    view: true
    indexes: true
    functions: true
    users: true
    table_privileges: true
    validate_data: true
EOF

# 2. 运行 MySQL2PG 工具
./mysql2pg -c config.yml

# 3. 检查退出码
if [ $? -eq 0 ]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
fi

# 4. 验证 PostgreSQL 数据
psql -h localhost -U postgres -d test_db -c "SELECT COUNT(*) FROM case_01_integers;"
```

#### 集成测试结果验证

每个集成测试用例都会验证：

1. **退出码检查**：工具是否正常退出（exit code = 0）
2. **日志检查**：conversion.log 中是否有错误
3. **表结构验证**：PostgreSQL 中表结构是否正确转换
4. **数据行数验证**：MySQL 和 PostgreSQL 行数是否一致
5. **视图验证**：视图是否可以正常查询
6. **函数验证**：存储函数是否可以正常调用
7. **索引验证**：索引是否正确创建
8. **权限验证**：用户和权限是否正确转换

### 第三层：CI 流水线自动化测试

每一次代码提交都会触发 GitHub Actions CI 流水线，自动执行所有测试：

#### CI 流水线架构

```yaml
# .github/workflows/go.yml

unit-test:
  name: Unit Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
      with:
        go-version: '1.24'
    - run: go build -v ./...
    - run: go test -v -race -coverprofile=coverage.out ./internal/config/...
    - run: go test -v -race -coverprofile=coverage.out ./internal/converter/postgres/...
    - run: go test -v -race -coverprofile=coverage.out ./internal/postgres/...
    - run: go test -v -race -coverprofile=coverage.out ./internal/report/...

integration-test-mysql57-pg12:
  name: MySQL 5.7 → PostgreSQL 12
  needs: unit-test
  services:
    mysql:
      image: mysql:5.7
    postgres:
      image: postgres:12
  steps:
    - 初始化测试数据（167 张表 + 42 视图 + 110 函数）
    - 运行 MySQL2PG 工具
    - 验证迁移结果

integration-test-mysql57-pg14:
  name: MySQL 5.7 → PostgreSQL 14
  needs: integration-test-mysql57-pg12
  # ... 同样的测试流程

# ... 共 10 种版本组合
```

#### CI 流水线保障

**1. 代码质量保障**

- ✅ **Race Detector**：检测并发代码的数据竞争
- ✅ **覆盖率报告**：确保核心逻辑被测试覆盖（88%+）
- ✅ **编译检查**：确保代码无语法错误、类型错误
- ✅ **静态分析**：golint、go vet 等工具检查代码质量

**2. 功能验证保障**

- ✅ **10 种版本组合**：MySQL 5.7/8.0 × PostgreSQL 12/14/16/17/18
- ✅ **完整测试数据**：167 张表 + 1670 行数据 + 42 视图 + 110 函数
- ✅ **端到端验证**：从 MySQL 读取 → 转换 → PostgreSQL 写入 → 数据验证
- ✅ **错误日志上传**：失败时自动上传 conversion.log 和 errors.log

**3. 发布质量保障**

- ✅ **分支保护**：main 分支必须有 CI 通过才能合并
- ✅ **标签发布**：每次发布都经过完整测试流程
- ✅ **回归测试**：新版本不会破坏已有功能
- ✅ **兼容性验证**：确保新旧版本 MySQL/PostgreSQL 都兼容

### 测试体系的三层防护

```
┌─────────────────────────────────────────┐
│  第三层：CI 流水线（10 种版本组合）        │
│  • 每次提交自动执行                       │
│  • 端到端集成测试                         │
│  • 数据验证                              │
├─────────────────────────────────────────┤
│  第二层：集成测试（84 个测试用例）          │
│  • 真实数据库环境                         │
│  • 完整迁移流程                           │
│  • 功能验证                              │
├─────────────────────────────────────────┤
│  第一层：单元测试（88%+ 覆盖率）           │
│  • 核心转换逻辑                           │
│  • 函数映射验证                           │
│  • 边界情况处理                           │
└─────────────────────────────────────────┘
```

### 测试数据覆盖

| 数据类型 | 数量 | 说明 |
|---------|------|------|
| 测试表 | 167 张 | 覆盖所有 MySQL 类型和语法 |
| 测试数据 | 1670 行 | 每张表 10 行测试数据 |
| 测试索引 | 数百个 | 主键、唯一键、普通索引、全文索引 |
| 测试视图 | 42 个 | 从简单视图到 MySQL 8.0 高级特性 |
| 测试函数 | 110 个 | 最多涉及 10 表关联的复杂逻辑 |
| 测试用例 | 84 个 | 集成测试覆盖所有配置选项 |
| 单元测试 | 200+ | 覆盖核心转换逻辑的每个细节 |

**三层测试体系，200+ 单元测试用例，84 个集成测试用例，10 种数据库版本组合，确保每一次代码提交都能稳定迁移。**

---

## 总结

MySQL2PG 的测试体系可以总结为四句话：

1. **全覆盖的测试用例**：167 张表 + 42 个视图 + 110 个函数 + 4种分区策略 + 6种唯一键场景 + 5大类索引，覆盖从基础语法到业务场景的所有迁移需求
2. **三层测试防护**：200+ 单元测试（88%+ 覆盖率）+ 84 个集成测试 + 10 种 CI 版本组合，确保代码稳定可靠
3. **自动化的 CI 流水线**：每次提交自动验证，失败立即阻止合并
4. **严格的数据验证**：迁移前后行数对比，确保数据一致性

**数据库迁移不是赌运气，而是靠体系化的测试、自动化的流程和严格的代码质量保障来确保每一次都能成功。**

---

> 📦 **项目地址**：https://github.com/xfg0218/MySQL2PG
>
> 💡 **如果你觉得有帮助，欢迎转发给需要的朋友 👇**
>
> 🔧 **你遇到过数据库迁移的坑吗？评论区聊聊**
