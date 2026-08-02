# PostgreSQL 密码加密方式配置说明

## 概述

MySQL2PG 现在支持配置 PostgreSQL 密码加密方式，以提高与不同 PostgreSQL 服务器配置的兼容性。

## 背景

PostgreSQL 支持两种密码加密方式：

1. **md5**: 传统的密码加密方式，兼容性最好
   - 适用于所有 PostgreSQL 版本
   - 安全性相对较低
   - 旧版本 PostgreSQL 的默认方式

2. **scram-sha-256**: 更安全的密码加密方式（PostgreSQL 10+ 默认）
   - 提供更强的安全性
   - PostgreSQL 10 及更高版本的默认方式
   - 符合现代安全标准

3. **auto**: 自动选择（默认）
   - 由 PostgreSQL 服务器决定使用哪种加密方式
   - 推荐大多数用户使用此默认设置

## 配置方法

在 `config.yml` 配置文件中添加 `password_encryption` 字段：

```yaml
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  password_encryption: auto  # md5, scram-sha-256, 或 auto（默认）
```

## 使用场景

### 使用 MD5 加密

如果您的 PostgreSQL 服务器配置为使用 MD5 加密，或者您需要与旧版本客户端兼容：

```yaml
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  password_encryption: md5
```

### 使用 SCRAM-SHA-256 加密

如果您的 PostgreSQL 服务器使用更安全的 SCRAM-SHA-256 加密（PostgreSQL 10+ 推荐）：

```yaml
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  password_encryption: scram-sha-256
```

### 使用自动选择（默认）

如果您不确定应该使用哪种方式，或者希望 PostgreSQL 服务器自动决定：

```yaml
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  # 不设置 password_encryption，默认为 auto
```

## PostgreSQL 服务器端配置

在 PostgreSQL 服务器端，可以通过 `password_encryption` 参数设置默认加密方式：

```sql
-- 在 postgresql.conf 中设置
password_encryption = scram-sha-256  -- 或 md5

-- 或者在运行时修改
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
SELECT pg_reload_conf();
```

## 兼容性说明

- **MySQL2PG v3.4.1+**: 支持 `password_encryption` 配置
- **PostgreSQL 9.x**: 仅支持 MD5
- **PostgreSQL 10+**: 支持 MD5 和 SCRAM-SHA-256
- **pgx 驱动**: 自动处理两种加密方式

## 故障排查

### 连接失败：authentication failed

如果看到类似错误，可能是密码加密方式不匹配：

```
PostgreSQL 连接测试失败：failed to connect to `user=postgres database=test_db`: 
server sent password (md5) but client requested scram-sha-256
```

**解决方案**：
1. 检查 PostgreSQL 服务器的 `password_encryption` 设置
2. 在 MySQL2PG 配置中指定相同的加密方式
3. 或者使用 `auto` 让服务器决定

### 查看当前加密方式

```sql
-- 查看 PostgreSQL 服务器的密码加密设置
SHOW password_encryption;

-- 查看特定用户的密码加密方式
SELECT usename, passwd FROM pg_shadow WHERE usename = 'your_username';
-- MD5 加密以 'md5' 开头（35 字符）
-- SCRAM-SHA-256 以 'SCRAM-SHA-256' 开头
```

## 技术实现

### 代码变更

1. **internal/config/config.go**
   - 添加 `PasswordEncryption` 字段到 `PostgreSQLConfig` 结构体

2. **internal/postgres/connection.go**
   - 修改 `NewConnection` 函数，根据配置添加 `password_encryption` 连接参数

3. **config.example.yml**
   - 添加配置示例和注释

### 连接字符串格式

根据配置，生成的连接字符串如下：

```
# MD5 模式
host=localhost port=5432 user=postgres password=xxx dbname=test_db sslmode=disable password_encryption=md5

# SCRAM-SHA-256 模式
host=localhost port=5432 user=postgres password=xxx dbname=test_db sslmode=disable password_encryption=scram-sha-256

# Auto 模式（默认，不添加额外参数）
host=localhost port=5432 user=postgres password=xxx dbname=test_db sslmode=disable
```

## 参考资料

- [PostgreSQL 认证文档](https://www.postgresql.org/docs/current/auth-password.html)
- [SCRAM-SHA-256 说明](https://www.postgresql.org/docs/current/sasl-authentication.html)
- [GitHub Issue #110](https://github.com/xfg0218/MySQL2PG/issues/110)
