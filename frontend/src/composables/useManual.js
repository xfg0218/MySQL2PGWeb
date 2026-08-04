import { computed } from 'vue'
import { useLang } from './useLang'

const zh = [
  {
    id: 'getting-started',
    title: '入门',
    sections: [
      {
        id: 'install',
        title: '安装与验证',
        body: `<h3>下载二进制文件</h3>
<p>从 <a href="https://github.com/xfg0218/MySQL2PG/releases" target="_blank" rel="noopener">GitHub Releases</a> 下载对应平台的预编译文件。</p>

<h3>验证安装</h3>
<p><strong>步骤 1</strong>：赋予执行权限</p>
<pre><code>chmod +x mysql2pg</code></pre>
<p><strong>步骤 2</strong>：查看帮助信息，确认安装成功</p>
<pre><code>./mysql2pg -h</code></pre>
<p>正常输出应显示版本号和使用说明。</p>

<h3>从源码构建（可选）</h3>
<pre><code>git clone https://github.com/xfg0218/MySQL2PG.git
cd MySQL2PG
make build</code></pre>
<p>构建产物为当前目录下的 <code>mysql2pg</code> 单文件，无运行时依赖。</p>
<p><strong>系统要求</strong>：最低 1GB 内存，无需安装 Go 运行时。支持 Linux / macOS / Windows。</p>`
      },
      {
        id: 'test-conn',
        title: '测试数据库连接',
        body: `<p>在正式迁移前，先验证 MySQL 和 PostgreSQL 的连接是否正常。</p>

<h3>步骤 1：在配置文件中启用测试模式</h3>
<pre><code># config.yml
mysql:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: mydb
  test_only: true          # 启用测试模式

postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: your_password
  database: mydb
  test_only: true          # 启用测试模式</code></pre>

<h3>步骤 2：运行连接测试</h3>
<pre><code>./mysql2pg -c config.yml</code></pre>

<h3>步骤 3：检查输出</h3>
<p>成功时输出 MySQL 和 PostgreSQL 的版本信息：</p>
<pre><code>MySQL version: 8.0.36
PostgreSQL version: 16.2</code></pre>
<p>如果连接失败，参见 <a href="#troubleshoot-conn">连接问题排查</a>。</p>

<blockquote><p>测试模式只读不写，对数据库无任何副作用。响应时间通常 &lt; 1 秒。</p></blockquote>`
      },
      {
        id: 'first-migration',
        title: '首次迁移（3 步完成）',
        body: `<h3>步骤 1：创建配置文件</h3>
<p>创建 <code>config.yml</code>，填写源库和目标库连接信息，开启所有转换选项：</p>
<pre><code># config.yml
mysql:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: mydb

postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: your_password
  database: mydb

conversion:
  options:
    tableddl: true
    data: true
    view: true
    indexes: true
    functions: true
    users: true
    table_privileges: true
    validate_data: true</code></pre>

<h3>步骤 2：执行迁移</h3>
<pre><code>./mysql2pg -c config.yml</code></pre>
<p>工具按 8 步流水线依次执行：读取表定义 → 转换表结构 → 转换视图 → 同步数据 → 转换索引 → 转换函数 → 转换用户 → 转换权限 + 校验。</p>
<p>每个阶段的进度实时输出到控制台，更新频率 1 次/秒。</p>

<h3>步骤 3：查看迁移报告</h3>
<pre><code>./mysql2pg report -l conversion.log</code></pre>
<p>生成单文件 HTML 报告，包含统计卡片、性能柱状图、表明细和数据不一致清单。</p>

<blockquote><p>建议在首次迁移前先运行 <a href="#assess">迁移前评估</a>，了解兼容性风险。</p></blockquote>`
      }
    ]
  },
  {
    id: 'operations',
    title: '迁移操作',
    sections: [
      {
        id: 'assess',
        title: '迁移前评估',
        body: `<p>在正式迁移前运行评估，分析所有对象的兼容性，提前发现风险。</p>

<h3>何时使用</h3>
<ul>
<li>首次迁移前，了解整体兼容性</li>
<li>源库结构变更后，重新评估影响范围</li>
<li>向团队汇报迁移风险时，生成评估报告</li>
</ul>

<h3>操作步骤</h3>
<p><strong>步骤 1</strong>：确保配置文件中的连接信息正确（无需开启 <code>test_only</code>）</p>
<p><strong>步骤 2</strong>：运行评估命令</p>
<pre><code>./mysql2pg assess config.yml</code></pre>
<p><strong>步骤 3</strong>：查看生成的 HTML 评估报告</p>

<h3>报告内容</h3>
<ul>
<li><strong>总体评分</strong>：0-100 兼容性评分</li>
<li><strong>风险等级</strong>：低 / 中 / 高</li>
<li><strong>详细清单</strong>：每个对象的不兼容问题和建议修复方案</li>
<li><strong>统计概览</strong>：表、视图、函数、索引、用户、权限的数量和 DDL 行数</li>
</ul>

<blockquote><p>评估模式只读不写，对源库和目标库均无副作用。可安全在生产环境运行。</p></blockquote>`
      },
      {
        id: 'full-migration',
        title: '执行全量迁移',
        body: `<p>全量迁移将所有表结构、数据、视图、索引、函数、用户和权限从 MySQL 迁移到 PostgreSQL。</p>

<h3>操作步骤</h3>
<p><strong>步骤 1</strong>：确认配置文件连接信息正确，所有转换开关已开启</p>
<p><strong>步骤 2</strong>：（推荐）先运行 <a href="#assess">迁移前评估</a></p>
<p><strong>步骤 3</strong>：执行迁移</p>
<pre><code># 指定配置文件
./mysql2pg -c config.yml

# 或使用默认 config.yml
./mysql2pg</code></pre>
<p><strong>步骤 4</strong>：观察控制台输出，确认 8 个阶段均正常完成</p>
<p><strong>步骤 5</strong>：运行 <a href="#report">报告生成</a> 查看迁移结果</p>

<h3>迁移流水线</h3>
<pre><code>Step 1  读取 MySQL 表定义（支持白名单/黑名单过滤）
Step 2  转换表结构（字段类型智能映射）
Step 3  转换视图（反引号替换、LIMIT 语法转换）
Step 4  同步数据（并发批量插入）
Step 5  转换索引（主键/唯一/普通/全文索引重建）
Step 6  转换函数
Step 7  转换用户（MySQL 用户 → PG Role）
Step 8  转换权限 + 数据校验</code></pre>

<h3>清空目标表后迁移</h3>
<p>如需确保数据完全一致，开启 <code>truncate_before_sync</code>：</p>
<pre><code>conversion:
  options:
    truncate_before_sync: true
    validate_data: true</code></pre>
<p>校验失败时工具会中断执行并返回错误。</p>

<h3>追加同步（保留已有数据）</h3>
<p>不清空目标表，新数据追加写入：</p>
<pre><code>conversion:
  options:
    truncate_before_sync: false
    validate_data: true</code></pre>
<p>校验失败时不中断执行，最终输出不一致表清单。</p>`
      },
      {
        id: 'op-tableddl',
        title: '表结构转换',
        body: `<p>将 MySQL 表定义（DDL）自动转换为 PostgreSQL 兼容语法。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    tableddl: true</code></pre>

<h3>转换过程</h3>
<p><strong>步骤 1</strong>：工具读取 MySQL 源库的所有表定义</p>
<p><strong>步骤 2</strong>：逐表进行字段类型映射（如 <code>INT AUTO_INCREMENT</code> → <code>SERIAL</code>）</p>
<p><strong>步骤 3</strong>：在 PostgreSQL 目标库执行 <code>CREATE TABLE</code></p>

<h3>关键转换规则</h3>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>INT AUTO_INCREMENT</code></td><td><code>SERIAL</code></td><td>自增整数</td></tr>
<tr><td><code>BIGINT AUTO_INCREMENT</code></td><td><code>BIGSERIAL</code></td><td>自增大整数</td></tr>
<tr><td><code>TINYINT(1)</code></td><td><code>BOOLEAN</code></td><td>布尔值</td></tr>
<tr><td><code>DATETIME(n)</code></td><td><code>TIMESTAMP(n)</code></td><td>保留精度</td></tr>
<tr><td><code>JSON</code></td><td><code>JSONB</code></td><td>二进制 JSON</td></tr>
<tr><td><code>ENUM('a','b')</code></td><td><code>VARCHAR(20) CHECK (...)</code></td><td>值域约束</td></tr>
<tr><td><code>UNSIGNED</code> 类型</td><td>自动升级位宽</td><td>PG 无无符号类型</td></tr>
</tbody>
</table>

<h3>跳过已存在的表</h3>
<pre><code>conversion:
  options:
    skip_existing_tables: true   # 默认 true</code></pre>

<h3>字段名转小写</h3>
<pre><code>conversion:
  options:
    lowercase_columns: true      # 默认 true</code></pre>

<p>完整类型映射见 <a href="#ref-types">类型映射参考</a>。</p>`
      },
      {
        id: 'op-data',
        title: '数据同步',
        body: `<p>将 MySQL 表数据并发批量同步到 PostgreSQL。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    data: true</code></pre>

<h3>同步过程</h3>
<p><strong>步骤 1</strong>：工具按表逐一读取 MySQL 数据</p>
<p><strong>步骤 2</strong>：分批读取（默认每批 50000 行）</p>
<p><strong>步骤 3</strong>：并发批量插入 PostgreSQL（默认 10 线程）</p>
<p><strong>步骤 4</strong>：插入期间自动禁用外键和索引以提升性能</p>

<h3>调整同步速度</h3>
<pre><code>conversion:
  limits:
    concurrency: 20              # 并发线程数（建议 CPU 核数 × 2）
    max_rows_per_batch: 10000    # 每批读取行数
    batch_insert_size: 10000     # 每批插入行数
    bandwidth_mbps: 200          # 带宽限制（Mbps）</code></pre>

<h3>大表优化建议</h3>
<ul>
<li>先同步数据，后创建索引：将 <code>indexes</code> 设为 <code>false</code>，数据同步完成后单独开启索引转换</li>
<li>提高 <code>concurrency</code> 到 CPU 核数的 2 倍</li>
<li>检查网络带宽是否成为瓶颈</li>
</ul>`
      },
      {
        id: 'op-view',
        title: '视图转换',
        body: `<p>将 MySQL 视图定义自动转换为 PostgreSQL 兼容语法。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    view: true</code></pre>

<h3>转换过程</h3>
<p><strong>步骤 1</strong>：读取 MySQL 所有视图定义</p>
<p><strong>步骤 2</strong>：自动执行语法转换（反引号 → 双引号、LIMIT 语法、函数替换）</p>
<p><strong>步骤 3</strong>：批量创建 PostgreSQL 视图（每批 10 个）</p>

<h3>转换规则</h3>
<table>
<thead><tr><th>规则</th><th>MySQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>标识符</td><td><code>\`col\`</code></td><td><code>"col"</code></td></tr>
<tr><td>分页</td><td><code>LIMIT 10, 20</code></td><td><code>LIMIT 20 OFFSET 10</code></td></tr>
<tr><td>标准分页</td><td><code>LIMIT 100</code></td><td><code>FETCH FIRST 100 ROWS ONLY</code></td></tr>
<tr><td>函数</td><td>视图内函数自动转换</td><td>同函数转换表</td></tr>
</tbody>
</table>

<h3>跳过转换失败的视图</h3>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_complex_report, v_temp_stats]</code></pre>
<p>视图名不区分大小写。</p>`
      },
      {
        id: 'op-index',
        title: '索引转换',
        body: `<p>将 MySQL 索引自动重建为 PostgreSQL 索引。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    indexes: true</code></pre>

<h3>转换过程</h3>
<p><strong>步骤 1</strong>：读取 MySQL 所有表的索引定义</p>
<p><strong>步骤 2</strong>：按类型转换（主键 / 唯一 / 普通 / 全文索引）</p>
<p><strong>步骤 3</strong>：批量在 PostgreSQL 创建索引（每批 20 个）</p>

<h3>支持的索引类型</h3>
<ul>
<li><strong>主键索引</strong>：自动转换</li>
<li><strong>唯一索引</strong>：自动转换</li>
<li><strong>普通索引</strong>：自动转换</li>
<li><strong>全文索引</strong>：转换为 <code>GIN</code> 索引 + <code>to_tsvector</code></li>
</ul>

<h3>MPP 分布键</h3>
<p>启用 MPP 模式后，自动使用主键列作为 <code>DISTRIBUTED BY</code> 分布键，Greenplum 上跳过冗余 UNIQUE INDEX。</p>`
      },
      {
        id: 'op-function',
        title: '函数转换',
        body: `<p>将 MySQL 内置函数和存储过程自动映射为 PostgreSQL 等效语法。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    functions: true</code></pre>

<h3>转换过程</h3>
<p><strong>步骤 1</strong>：读取 MySQL 所有函数和存储过程定义</p>
<p><strong>步骤 2</strong>：逐函数进行语法映射</p>
<p><strong>步骤 3</strong>：批量创建 PostgreSQL 函数（每批 5 个）</p>

<h3>常用函数映射</h3>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>类别</th></tr></thead>
<tbody>
<tr><td><code>IFNULL(x, y)</code></td><td><code>COALESCE(x, y)</code></td><td>空值处理</td></tr>
<tr><td><code>IF(cond, a, b)</code></td><td><code>CASE WHEN ... END</code></td><td>条件判断</td></tr>
<tr><td><code>GROUP_CONCAT(x)</code></td><td><code>STRING_AGG(...)</code></td><td>聚合</td></tr>
<tr><td><code>DATE_FORMAT(dt, fmt)</code></td><td><code>TO_CHAR(dt, fmt)</code></td><td>日期格式</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt; 'key'</code></td><td>JSON</td></tr>
<tr><td><code>REGEXP_LIKE(expr, pat)</code></td><td><code>expr ~ pat</code></td><td>正则</td></tr>
</tbody>
</table>

<h3>跳过转换失败的函数</h3>
<pre><code>conversion:
  options:
    exclude_use_function_list: true
    exclude_function_list: [func_deprecated, func_mysql_only]</code></pre>
<p>函数名不区分大小写。完整函数映射见 <a href="#ref-functions">函数转换参考</a>。</p>`
      },
      {
        id: 'op-user',
        title: '用户与权限迁移',
        body: `<p>将 MySQL 用户和表级权限自动转换为 PostgreSQL Role 和 GRANT。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    users: true
    table_privileges: true</code></pre>

<h3>用户转换步骤</h3>
<p><strong>步骤 1</strong>：读取 MySQL 所有用户定义</p>
<p><strong>步骤 2</strong>：将 <code>CREATE USER</code> 转换为 <code>CREATE ROLE ... WITH LOGIN</code></p>
<p><strong>步骤 3</strong>：保留密码哈希（支持 md5 和 scram-sha-256）</p>
<pre><code>-- MySQL
CREATE USER 'app_user'@'%' IDENTIFIED BY 'SecurePass123';

-- 自动转换为 PostgreSQL
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecurePass123';</code></pre>

<h3>权限转换步骤</h3>
<p><strong>步骤 1</strong>：读取 MySQL 所有表级 GRANT</p>
<p><strong>步骤 2</strong>：映射为 PostgreSQL GRANT 语法</p>
<pre><code>-- MySQL
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'%';

-- 自动转换为 PostgreSQL
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;</code></pre>

<h3>密码加密方式</h3>
<pre><code>postgresql:
  password_encryption: auto  # md5 / scram-sha-256 / auto</code></pre>
<p>PostgreSQL 14+ 默认使用 <code>scram-sha-256</code>。如需兼容旧客户端，设为 <code>md5</code>。</p>`
      },
      {
        id: 'op-validate',
        title: '数据校验',
        body: `<p>迁移完成后自动比对源库和目标库的行数，验证数据一致性。</p>

<h3>如何启用</h3>
<pre><code>conversion:
  options:
    validate_data: true</code></pre>

<h3>校验过程</h3>
<p><strong>步骤 1</strong>：逐表统计 MySQL 和 PostgreSQL 的行数</p>
<p><strong>步骤 2</strong>：比对行数是否一致</p>
<p><strong>步骤 3</strong>：输出校验结果</p>

<h3>校验结果处理</h3>
<p><strong>一致</strong>：该表标记为通过。</p>
<p><strong>不一致</strong>：输出不一致表清单：</p>
<pre><code>+------------------+----------------+------------------+
| 表名             | MySQL数据量    | PostgreSQL数据量 |
+------------------+----------------+------------------+
| user             | 327680         | 655360           |
+------------------+----------------+------------------+</code></pre>

<h3>不一致时的行为</h3>
<ul>
<li><code>truncate_before_sync: true</code> 时：校验失败会<strong>中断执行</strong>并返回错误</li>
<li><code>truncate_before_sync: false</code> 时：校验失败<strong>不中断</strong>，最终输出不一致清单</li>
</ul>

<h3>常见不一致原因</h3>
<ul>
<li>迁移期间源库有新写入</li>
<li>触发器导致额外行</li>
<li><code>truncate_before_sync</code> 未开启导致数据叠加</li>
</ul>`
      },
      {
        id: 'report',
        title: '生成迁移报告',
        body: `<p>从转换日志生成可视化 HTML 报告，无需重新执行迁移。</p>

<h3>操作步骤</h3>
<p><strong>步骤 1</strong>：确认转换日志文件存在（默认 <code>conversion.log</code>）</p>
<p><strong>步骤 2</strong>：运行报告生成命令</p>
<pre><code># 基本用法
./mysql2pg report -l conversion.log

# 包含错误日志
./mysql2pg report -l conversion.log -e errors.log

# 自定义输出路径
./mysql2pg report -l conversion.log -o my-report.html</code></pre>

<h3>参数说明</h3>
<table>
<thead><tr><th>参数</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>-l</code></td><td>转换日志文件路径（必需）</td></tr>
<tr><td><code>-e</code></td><td>错误日志文件路径（可选）</td></tr>
<tr><td><code>-o</code></td><td>输出 HTML 文件路径（可选，默认自动生成带时间戳的文件名）</td></tr>
</tbody>
</table>

<h3>报告内容</h3>
<p>单文件 HTML，深色终端风格，包含：</p>
<ul>
<li>统计卡片（表数、行数、耗时）</li>
<li>性能柱状图</li>
<li>表明细（每表的行数和转换状态）</li>
<li>数据不一致清单</li>
</ul>`
      }
    ]
  },
  {
    id: 'config-guide',
    title: '配置指南',
    sections: [
      {
        id: 'cfg-connection',
        title: '数据库连接配置',
        body: `<table>
<thead><tr><th>参数</th><th>默认值</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>mysql.host</code> / <code>postgresql.host</code></td><td><code>localhost</code></td><td>数据库地址</td></tr>
<tr><td><code>mysql.port</code> / <code>postgresql.port</code></td><td><code>3306</code> / <code>5432</code></td><td>端口号</td></tr>
<tr><td><code>mysql.username</code> / <code>postgresql.username</code></td><td>—</td><td>用户名</td></tr>
<tr><td><code>mysql.password</code> / <code>postgresql.password</code></td><td>—</td><td>密码，支持环境变量注入</td></tr>
<tr><td><code>mysql.database</code> / <code>postgresql.database</code></td><td>—</td><td>数据库名</td></tr>
<tr><td><code>mysql.test_only</code> / <code>postgresql.test_only</code></td><td><code>false</code></td><td>仅测试连接</td></tr>
<tr><td><code>mysql.max_open_conns</code></td><td><code>100</code></td><td>MySQL 连接池最大连接数</td></tr>
<tr><td><code>mysql.max_idle_conns</code></td><td><code>50</code></td><td>MySQL 连接池最大空闲连接数</td></tr>
<tr><td><code>postgresql.max_conns</code></td><td><code>50</code></td><td>PostgreSQL 连接池最大连接数</td></tr>
<tr><td><code>mysql.connection_params</code></td><td>—</td><td>MySQL 连接参数，格式 <code>key=value&amp;key=value</code></td></tr>
<tr><td><code>postgresql.pg_connection_params</code></td><td>—</td><td>PostgreSQL 连接参数</td></tr>
</tbody>
</table>`
      },
      {
        id: 'cfg-switches',
        title: '转换开关配置',
        body: `<p>每个转换步骤均可独立开关，按需组合：</p>
<table>
<thead><tr><th>参数</th><th>默认值</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>conversion.options.tableddl</code></td><td><code>true</code></td><td>转换表结构</td></tr>
<tr><td><code>conversion.options.data</code></td><td><code>true</code></td><td>同步数据</td></tr>
<tr><td><code>conversion.options.view</code></td><td><code>true</code></td><td>转换视图</td></tr>
<tr><td><code>conversion.options.indexes</code></td><td><code>true</code></td><td>转换索引</td></tr>
<tr><td><code>conversion.options.functions</code></td><td><code>true</code></td><td>转换函数</td></tr>
<tr><td><code>conversion.options.users</code></td><td><code>true</code></td><td>转换用户</td></tr>
<tr><td><code>conversion.options.table_privileges</code></td><td><code>true</code></td><td>转换表权限</td></tr>
<tr><td><code>conversion.options.validate_data</code></td><td><code>true</code></td><td>同步后校验数据一致性</td></tr>
<tr><td><code>conversion.options.truncate_before_sync</code></td><td><code>false</code></td><td>同步前清空目标表</td></tr>
<tr><td><code>conversion.options.skip_existing_tables</code></td><td><code>true</code></td><td>目标表已存在时跳过</td></tr>
<tr><td><code>conversion.options.lowercase_columns</code></td><td><code>true</code></td><td>字段名转小写</td></tr>
</tbody>
</table>`
      },
      {
        id: 'cfg-filter',
        title: '表过滤（白名单 / 黑名单）',
        body: `<h3>白名单模式 — 仅迁移指定表</h3>
<pre><code>conversion:
  options:
    use_table_list: true
    table_list: [users, orders, products]</code></pre>

<h3>黑名单模式 — 跳过指定表</h3>
<pre><code>conversion:
  options:
    exclude_use_table_list: true
    exclude_table_list: [tmp_log, cache_data]</code></pre>

<h3>跳过指定视图</h3>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_complex_report]</code></pre>

<h3>跳过指定函数</h3>
<pre><code>conversion:
  options:
    exclude_use_function_list: true
    exclude_function_list: [func_deprecated]</code></pre>

<blockquote><p>白名单和黑名单不能同时使用，同时设置时白名单优先。表名区分大小写，视图和函数名不区分大小写。</p></blockquote>`
      },
      {
        id: 'cfg-perf',
        title: '并发与性能调优',
        body: `<table>
<thead><tr><th>参数</th><th>默认值</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>conversion.limits.concurrency</code></td><td><code>10</code></td><td>并发线程数</td></tr>
<tr><td><code>conversion.limits.max_rows_per_batch</code></td><td><code>50000</code></td><td>每批读取行数</td></tr>
<tr><td><code>conversion.limits.batch_insert_size</code></td><td><code>50000</code></td><td>每批插入行数</td></tr>
<tr><td><code>conversion.limits.bandwidth_mbps</code></td><td><code>100</code></td><td>网络带宽限制（Mbps）</td></tr>
</tbody>
</table>

<h3>大表（亿级行）推荐配置</h3>
<pre><code>conversion:
  limits:
    concurrency: 20          # 根据 CPU 核数调整
    max_rows_per_batch: 10000
    batch_insert_size: 10000
    bandwidth_mbps: 200</code></pre>

<h3>优化建议</h3>
<ul>
<li><code>concurrency</code> 建议设为 CPU 核数的 2 倍</li>
<li>先同步数据后创建索引：将 <code>indexes</code> 设为 <code>false</code>，数据完成后单独开启</li>
<li>检查网络带宽是否成为瓶颈</li>
</ul>`
      },
      {
        id: 'cfg-mpp',
        title: 'MPP 分布式配置',
        body: `<p>迁移到 Greenplum 或 YugabyteDB 时，启用 MPP 模式自动添加分布键。</p>

<h3>启用 MPP</h3>
<pre><code>conversion:
  mpp:
    enabled: true
    database: auto  # 自动检测，或指定 greenplum / yugabyte</code></pre>

<h3>启用后的行为</h3>
<ul>
<li>自动使用主键列作为 <code>DISTRIBUTED BY</code> 分布键</li>
<li>Greenplum 上跳过冗余 UNIQUE INDEX</li>
<li>自动检测目标库类型（<code>auto</code> 模式）</li>
</ul>`
      },
      {
        id: 'cfg-full',
        title: '完整配置参考',
        body: `<p>以下为带注释的完整配置文件，可直接复制使用：</p>
<details>
<summary>点击展开完整配置</summary>
<pre><code># MySQL 连接配置
mysql:
  host: localhost
  port: 3306
  username: root
  password: password
  database: test_db
  test_only: false
  max_open_conns: 100
  max_idle_conns: 50
  conn_max_lifetime: 3600
  connection_params: charset=utf8mb4&amp;parseTime=false&amp;interpolateParams=true&amp;readTimeout=60s&amp;writeTimeout=60s&amp;timeout=30s

# PostgreSQL 连接配置
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  test_only: false
  max_conns: 50
  pg_connection_params: search_path=public connect_timeout=300 statement_timeout=0
  password_encryption: auto  # md5 / scram-sha-256 / auto

# 转换配置
conversion:
  options:
    tableddl: true
    data: true
    view: true
    indexes: true
    functions: true
    users: true
    table_privileges: true
    lowercase_columns: true
    skip_existing_tables: true
    validate_data: true
    truncate_before_sync: false
    use_table_list: false
    table_list: [table1]
    exclude_use_table_list: false
    exclude_table_list: [table1]
    exclude_use_view_list: false
    exclude_view_list: [view1]
    exclude_use_function_list: false
    exclude_function_list: [func1]

  mpp:
    enabled: false
    database: auto  # greenplum / yugabyte / auto

  limits:
    concurrency: 10
    bandwidth_mbps: 100
    max_ddl_per_batch: 10
    max_functions_per_batch: 5
    max_indexes_per_batch: 20
    max_users_per_batch: 10
    max_rows_per_batch: 1000
    batch_insert_size: 1000

# 运行配置
run:
  show_progress: true
  error_log_path: ./errors.log
  enable_file_logging: true
  log_file_path: ./conversion.log
  show_console_logs: true
  show_log_in_console: false</code></pre>
</details>`
      }
    ]
  },
  {
    id: 'reference',
    title: '参考',
    sections: [
      {
        id: 'ref-types',
        title: '类型映射参考',
        body: `<p>覆盖 MySQL 全部字段类型，映射准确率 100%。</p>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>INT AUTO_INCREMENT</code></td><td><code>SERIAL</code></td><td>自增整数</td></tr>
<tr><td><code>BIGINT AUTO_INCREMENT</code></td><td><code>BIGSERIAL</code></td><td>自增大整数</td></tr>
<tr><td><code>TINYINT(1)</code></td><td><code>BOOLEAN</code></td><td>布尔值</td></tr>
<tr><td><code>DATETIME</code> / <code>DATETIME(n)</code></td><td><code>TIMESTAMP</code> / <code>TIMESTAMP(n)</code></td><td>保留精度</td></tr>
<tr><td><code>JSON</code></td><td><code>JSONB</code></td><td>默认映射为二进制 JSON</td></tr>
<tr><td><code>BLOB</code> / <code>LONGBLOB</code> / <code>BINARY</code></td><td><code>BYTEA</code></td><td>二进制类型统一</td></tr>
<tr><td><code>ENUM('a','b')</code></td><td><code>VARCHAR(20) CHECK (col IN ('a','b'))</code></td><td>值域约束保留</td></tr>
<tr><td><code>SET</code></td><td><code>TEXT[]</code></td><td>集合转数组</td></tr>
<tr><td><code>GEOMETRY</code></td><td><code>GEOMETRY</code></td><td>需 PostGIS 扩展</td></tr>
<tr><td><code>DOUBLE</code></td><td><code>DOUBLE PRECISION</code></td><td>双精度浮点</td></tr>
<tr><td><code>UNSIGNED</code> 类型</td><td>自动升级位宽</td><td>PostgreSQL 无无符号类型</td></tr>
</tbody>
</table>`
      },
      {
        id: 'ref-functions',
        title: '函数转换参考',
        body: `<p>支持 50+ MySQL 内置函数自动映射，准确率 90%+。</p>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>类别</th></tr></thead>
<tbody>
<tr><td><code>IFNULL(x, y)</code></td><td><code>COALESCE(x, y)</code></td><td>空值处理</td></tr>
<tr><td><code>IF(cond, a, b)</code></td><td><code>CASE WHEN cond THEN a ELSE b END</code></td><td>条件判断</td></tr>
<tr><td><code>GROUP_CONCAT(x)</code></td><td><code>STRING_AGG(CAST(x AS text), ',')</code></td><td>聚合</td></tr>
<tr><td><code>DATE_FORMAT(dt, fmt)</code></td><td><code>TO_CHAR(dt, fmt)</code></td><td>日期格式</td></tr>
<tr><td><code>STR_TO_DATE(s, fmt)</code></td><td><code>TO_DATE(s, fmt)</code></td><td>日期解析</td></tr>
<tr><td><code>DATEDIFF(d1, d2)</code></td><td><code>date_part('day', d1 - d2)</code></td><td>日期差</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt; 'key'</code></td><td>JSON 提取</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt;&gt; 'key'</code></td><td>JSON 文本值</td></tr>
<tr><td><code>REGEXP_LIKE(expr, pat)</code></td><td><code>expr ~ pat</code></td><td>正则匹配</td></tr>
<tr><td><code>REGEXP_REPLACE(s, p, r)</code></td><td><code>regexp_replace(s, p, r)</code></td><td>正则替换</td></tr>
<tr><td><code>CONCAT(a, b)</code></td><td><code>a || b</code></td><td>字符串拼接</td></tr>
<tr><td><code>UNIX_TIMESTAMP()</code></td><td><code>extract(epoch from now())</code></td><td>时间戳</td></tr>
<tr><td><code>UUID()</code></td><td><code>uuid_generate_v4()</code></td><td>UUID 生成</td></tr>
</tbody>
</table>`
      },
      {
        id: 'ref-view',
        title: '视图转换规则',
        body: `<table>
<thead><tr><th>规则</th><th>MySQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>标识符</td><td>反引号 <code>\`col\`</code></td><td>双引号 <code>"col"</code></td></tr>
<tr><td>分页</td><td><code>LIMIT 10, 20</code></td><td><code>LIMIT 20 OFFSET 10</code></td></tr>
<tr><td>标准分页</td><td><code>LIMIT 100</code></td><td><code>FETCH FIRST 100 ROWS ONLY</code></td></tr>
<tr><td>函数替换</td><td>视图内函数自动转换</td><td>同函数转换表</td></tr>
</tbody>
</table>
<p>支持批量转换（每批 10 个）。</p>`
      },
      {
        id: 'ref-user',
        title: '用户与权限映射',
        body: `<h3>用户转换</h3>
<pre><code>-- MySQL
CREATE USER 'app_user'@'%' IDENTIFIED BY 'SecurePass123';

-- PostgreSQL
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecurePass123';</code></pre>

<h3>权限转换</h3>
<pre><code>-- MySQL
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'%';

-- PostgreSQL
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;</code></pre>
<p>密码哈希保留，表级 GRANT 完整映射，准确率 100%。</p>`
      },
      {
        id: 'ref-versions',
        title: '版本兼容',
        body: `<h3>MySQL（源库）</h3>
<p><code>5.7+</code> · <code>8.0</code> · <code>8.4</code> · <code>9.0+</code></p>

<h3>PostgreSQL（目标库）</h3>
<p><code>12</code> · <code>13</code> · <code>14</code> · <code>15</code> · <code>16</code> · <code>17</code> · <code>18</code></p>

<h3>MPP 分布式数据库</h3>
<p><code>Greenplum</code> · <code>YugabyteDB</code></p>

<p>工具启动时自动检测源库和目标库版本，根据版本选择最优转换策略（如 JSON 路径语法、REGEXP_* 参数支持等）。</p>

<h3>数据安全</h3>
<ul>
<li><strong>凭证安全</strong>：配置文件本地存储，支持环境变量注入密码，凭证不上传任何外部服务</li>
<li><strong>传输加密</strong>：支持 SSL/TLS 加密连接，数据传输全程加密</li>
<li><strong>源库零修改</strong>：评估模式只读不写，正式迁移采用"先转换后写入"策略，读取阶段使用一致性快照</li>
</ul>`
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: '故障排查',
    sections: [
      {
        id: 'troubleshoot-conn',
        title: '连接问题',
        body: `<h3>排查步骤</h3>
<p><strong>步骤 1</strong>：使用 test_only 模式验证连接</p>
<pre><code># 配置文件中设置
mysql:
  test_only: true
postgresql:
  test_only: true</code></pre>
<pre><code>./mysql2pg -c config.yml</code></pre>

<p><strong>步骤 2</strong>：逐项检查</p>
<ul>
<li>网络连通性：<code>ping &lt;host&gt;</code></li>
<li>端口是否开放：<code>telnet &lt;host&gt; &lt;port&gt;</code></li>
<li>用户名密码是否正确</li>
<li>数据库是否存在</li>
<li>防火墙 / 安全组规则</li>
</ul>

<h3>密码认证失败</h3>
<p>PostgreSQL 14+ 默认使用 <code>scram-sha-256</code>。如需兼容旧客户端：</p>
<pre><code>postgresql:
  password_encryption: md5  # 或 scram-sha-256 / auto</code></pre>`
      },
      {
        id: 'troubleshoot-validate',
        title: '数据校验不一致',
        body: `<h3>现象</h3>
<p>迁移完成后，校验报告显示某些表的 MySQL 和 PostgreSQL 行数不一致。</p>

<h3>排查步骤</h3>
<p><strong>步骤 1</strong>：检查是否开启了 <code>truncate_before_sync</code></p>
<ul>
<li>未开启 → 可能是数据叠加，建议开启后重新迁移</li>
<li>已开启 → 继续步骤 2</li>
</ul>
<p><strong>步骤 2</strong>：检查迁移期间源库是否有新写入</p>
<p><strong>步骤 3</strong>：检查目标库是否有触发器导致额外行</p>
<p><strong>步骤 4</strong>：查看 <code>errors.log</code> 获取详细错误信息</p>`
      },
      {
        id: 'troubleshoot-convert',
        title: '转换失败处理',
        body: `<h3>视图或函数转换失败</h3>
<p><strong>步骤 1</strong>：查看 <code>errors.log</code> 获取详细错误信息</p>
<p><strong>步骤 2</strong>：使用排除列表跳过失败对象</p>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_failed_view]
    exclude_use_function_list: true
    exclude_function_list: [func_failed]</code></pre>
<p><strong>步骤 3</strong>：重新运行迁移</p>
<p><strong>步骤 4</strong>：手动处理被跳过的对象</p>

<h3>GEOMETRY 类型报错</h3>
<p>目标库需安装 PostGIS 扩展：</p>
<pre><code>CREATE EXTENSION postgis;</code></pre>`
      },
      {
        id: 'troubleshoot-perf',
        title: '性能问题',
        body: `<h3>大表迁移速度慢</h3>
<p><strong>步骤 1</strong>：提高并发数</p>
<pre><code>conversion:
  limits:
    concurrency: 20</code></pre>
<p><strong>步骤 2</strong>：调整批量大小</p>
<pre><code>conversion:
  limits:
    max_rows_per_batch: 10000
    batch_insert_size: 10000</code></pre>
<p><strong>步骤 3</strong>：先同步数据后创建索引</p>
<pre><code># 第一次运行：只同步数据
conversion:
  options:
    indexes: false

# 第二次运行：只创建索引
conversion:
  options:
    tableddl: false
    data: false
    indexes: true</code></pre>
<p><strong>步骤 4</strong>：检查网络带宽是否成为瓶颈，适当提高 <code>bandwidth_mbps</code></p>`
      }
    ]
  },
  {
    id: 'best-practices',
    title: '最佳实践',
    sections: [
      {
        id: 'bp-strategy',
        title: '迁移策略选择',
        body: `<p>根据业务场景选择合适的迁移策略。</p>

<h3>场景 1：停机窗口迁移</h3>
<p>适用于可以短暂停机的场景，数据一致性要求最高。</p>
<pre><code>conversion:
  options:
    truncate_before_sync: true
    validate_data: true
    concurrency: 20</code></pre>
<p>校验失败时工具中断执行，确保数据完全一致后才继续。</p>

<h3>场景 2：在线追加迁移</h3>
<p>适用于不能停机的场景，保留目标库已有数据。</p>
<pre><code>conversion:
  options:
    truncate_before_sync: false
    validate_data: true</code></pre>
<p>校验不一致时不中断，最终输出差异清单供人工核对。</p>

<h3>场景 3：分批迁移</h3>
<p>适用于超大型数据库，按业务模块分批迁移。</p>
<pre><code># 第一批：核心业务表
conversion:
  options:
    use_table_list: true
    table_list: [users, orders, payments]

# 第二批：辅助表
conversion:
  options:
    use_table_list: true
    table_list: [logs, analytics, cache]</code></pre>

<h3>场景 4：仅结构迁移</h3>
<p>只迁移表结构和索引，不同步数据（数据通过其他工具导入）。</p>
<pre><code>conversion:
  options:
    tableddl: true
    indexes: true
    data: false
    view: false
    functions: false</code></pre>`
      },
      {
        id: 'bp-largetable',
        title: '大表迁移优化',
        body: `<p>亿级行大表的迁移需要特殊优化。</p>

<h3>步骤 1：分离数据和索引</h3>
<p>先同步数据，后创建索引，避免索引维护拖慢写入：</p>
<pre><code># 第一次运行：只同步数据
conversion:
  options:
    tableddl: true
    data: true
    indexes: false
    view: false
    functions: false

# 第二次运行：只创建索引和视图
conversion:
  options:
    tableddl: false
    data: false
    indexes: true
    view: true
    functions: true</code></pre>

<h3>步骤 2：调高并发和批量大小</h3>
<pre><code>conversion:
  limits:
    concurrency: 20              # CPU 核数 × 2
    max_rows_per_batch: 10000
    batch_insert_size: 10000
    bandwidth_mbps: 200</code></pre>

<h3>步骤 3：排除大表中的非必要索引</h3>
<p>如果某些索引在迁移期间不需要，可以先跳过，迁移完成后再手动创建。</p>

<h3>步骤 4：监控迁移进度</h3>
<p>开启文件日志，实时查看每张表的同步进度：</p>
<pre><code>run:
  enable_file_logging: true
  log_file_path: ./conversion.log
  show_progress: true</code></pre>`
      },
      {
        id: 'bp-safety',
        title: '数据安全实践',
        body: `<h3>凭证管理</h3>
<ul>
<li>使用环境变量注入密码，避免明文写入配置文件</li>
<li>配置文件权限设为 <code>600</code>，仅所有者可读写</li>
<li>不要将配置文件提交到版本控制系统</li>
</ul>
<pre><code># 使用环境变量
export MYSQL_PASSWORD=your_password
export PG_PASSWORD=your_password</code></pre>

<h3>迁移前备份</h3>
<ul>
<li>迁移前对目标 PostgreSQL 库做全量备份</li>
<li>使用 <code>pg_dump</code> 备份目标库当前状态</li>
<li>保留 MySQL 源库快照，以便回滚</li>
</ul>

<h3>迁移后验证</h3>
<ul>
<li>始终开启 <code>validate_data: true</code></li>
<li>检查 <code>errors.log</code> 是否有未处理的错误</li>
<li>对关键业务表做抽样数据比对</li>
<li>在测试环境先跑一遍完整迁移流程</li>
</ul>

<h3>SSL/TLS 加密连接</h3>
<p>生产环境建议启用加密连接：</p>
<pre><code>mysql:
  connection_params: tls=true&amp;tlsConfig=preferred

postgresql:
  pg_connection_params: sslmode=require</code></pre>`
      }
    ]
  },
  {
    id: 'cli-reference',
    title: 'CLI 参考',
    sections: [
      {
        id: 'cli-commands',
        title: '命令总览',
        body: `<table>
<thead><tr><th>命令</th><th>说明</th><th>示例</th></tr></thead>
<tbody>
<tr><td><code>./mysql2pg</code></td><td>执行迁移（使用默认 config.yml）</td><td><code>./mysql2pg</code></td></tr>
<tr><td><code>./mysql2pg -c &lt;file&gt;</code></td><td>指定配置文件执行迁移</td><td><code>./mysql2pg -c prod.yml</code></td></tr>
<tr><td><code>./mysql2pg &lt;file&gt;</code></td><td>指定配置文件执行迁移（简写）</td><td><code>./mysql2pg prod.yml</code></td></tr>
<tr><td><code>./mysql2pg -h</code></td><td>显示帮助信息</td><td><code>./mysql2pg -h</code></td></tr>
<tr><td><code>./mysql2pg assess &lt;file&gt;</code></td><td>运行迁移前评估</td><td><code>./mysql2pg assess config.yml</code></td></tr>
<tr><td><code>./mysql2pg report -l &lt;log&gt;</code></td><td>从日志生成 HTML 报告</td><td><code>./mysql2pg report -l conversion.log</code></td></tr>
</tbody>
</table>`
      },
      {
        id: 'cli-flags',
        title: '参数说明',
        body: `<h3>迁移命令参数</h3>
<table>
<thead><tr><th>参数</th><th>说明</th><th>默认值</th></tr></thead>
<tbody>
<tr><td><code>-c &lt;file&gt;</code></td><td>配置文件路径</td><td><code>config.yml</code></td></tr>
<tr><td><code>-h</code></td><td>显示帮助信息</td><td>—</td></tr>
</tbody>
</table>

<h3>report 命令参数</h3>
<table>
<thead><tr><th>参数</th><th>说明</th><th>必需</th></tr></thead>
<tbody>
<tr><td><code>-l &lt;file&gt;</code></td><td>转换日志文件路径</td><td>是</td></tr>
<tr><td><code>-e &lt;file&gt;</code></td><td>错误日志文件路径</td><td>否</td></tr>
<tr><td><code>-o &lt;file&gt;</code></td><td>输出 HTML 文件路径</td><td>否（自动生成带时间戳的文件名）</td></tr>
</tbody>
</table>

<h3>assess 命令参数</h3>
<table>
<thead><tr><th>参数</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>&lt;file&gt;</code></td><td>配置文件路径（位置参数）</td></tr>
</tbody>
</table>

<h3>退出码</h3>
<table>
<thead><tr><th>退出码</th><th>含义</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>迁移成功完成</td></tr>
<tr><td><code>1</code></td><td>迁移失败（连接错误、转换错误、校验失败等）</td></tr>
</tbody>
</table>`
      }
    ]
  },
  {
    id: 'logging',
    title: '日志与监控',
    sections: [
      {
        id: 'log-config',
        title: '日志配置',
        body: `<p>MySQL2PG 支持控制台日志和文件日志两种输出方式。</p>

<h3>配置参数</h3>
<table>
<thead><tr><th>参数</th><th>默认值</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>run.enable_file_logging</code></td><td><code>true</code></td><td>启用文件日志</td></tr>
<tr><td><code>run.log_file_path</code></td><td><code>./conversion.log</code></td><td>转换日志文件路径</td></tr>
<tr><td><code>run.error_log_path</code></td><td><code>./errors.log</code></td><td>错误日志文件路径</td></tr>
<tr><td><code>run.show_console_logs</code></td><td><code>true</code></td><td>在控制台显示进度日志</td></tr>
<tr><td><code>run.show_log_in_console</code></td><td><code>false</code></td><td>在控制台显示详细日志</td></tr>
<tr><td><code>run.show_progress</code></td><td><code>true</code></td><td>显示进度条</td></tr>
</tbody>
</table>

<h3>推荐配置</h3>
<p>生产环境建议同时开启文件日志和控制台进度：</p>
<pre><code>run:
  enable_file_logging: true
  log_file_path: ./conversion.log
  error_log_path: ./errors.log
  show_console_logs: true
  show_log_in_console: false
  show_progress: true</code></pre>

<h3>日志文件用途</h3>
<ul>
<li><code>conversion.log</code>：记录每张表的转换详情，用于生成 HTML 报告</li>
<li><code>errors.log</code>：记录转换失败的详细错误信息，用于故障排查</li>
</ul>`
      },
      {
        id: 'log-progress',
        title: '进度监控',
        body: `<p>迁移过程中，控制台实时显示进度信息。</p>

<h3>进度输出示例</h3>
<pre><code>[Step 4/8] Syncing data...
  Table: users        [████████████████████] 100% (327680/327680 rows)
  Table: orders       [████████░░░░░░░░░░░░]  42% (524288/1250000 rows)
  Table: products     [░░░░░░░░░░░░░░░░░░░░]   0% (0/85000 rows)
  Speed: 45230 rows/s | Elapsed: 00:02:35 | ETA: 00:05:12</code></pre>

<h3>监控要点</h3>
<ul>
<li><strong>Speed</strong>：当前同步速度（行/秒），用于判断是否需要调优</li>
<li><strong>Elapsed</strong>：已用时间</li>
<li><strong>ETA</strong>：预计剩余时间</li>
<li><strong>进度条</strong>：每张表的完成百分比</li>
</ul>

<h3>后台运行与日志跟踪</h3>
<p>长时间迁移建议在后台运行，通过 <code>tail</code> 跟踪日志：</p>
<pre><code># 后台运行
nohup ./mysql2pg -c config.yml > output.log 2>&1 &

# 跟踪进度
tail -f conversion.log

# 查看错误
tail -f errors.log</code></pre>`
      }
    ]
  },
  {
    id: 'faq',
    title: '常见问题',
    sections: [
      {
        id: 'faq-general',
        title: '基础问题',
        body: `<details>
<summary>支持哪些 MySQL 存储引擎？</summary>
<p>MySQL2PG 支持所有主流存储引擎，包括 InnoDB、MyISAM、MEMORY 等。InnoDB 表会自动处理外键约束的迁移。</p>
</details>

<details>
<summary>支持哪些 MySQL 和 PostgreSQL 版本？</summary>
<p>MySQL 源库支持 5.7、8.0、8.4、9.0+；PostgreSQL 目标库支持 12 至 18 全版本，同时兼容 Greenplum 和 YugabyteDB。</p>
</details>

<details>
<summary>MySQL2PG 的系统要求是什么？</summary>
<p>MySQL2PG 是纯 Go 编译的单二进制文件，无外部依赖。支持 Linux、macOS、Windows，最低 1GB 内存即可运行，无需安装运行时环境。</p>
</details>

<details>
<summary>MySQL2PG 的许可证是什么？可以商用吗？</summary>
<p>开源版采用 Apache-2.0 许可证，可免费用于商业项目。商业版在开源版基础上提供函数转换、MPP 支持、数据校验等增值功能及专属技术支持。</p>
</details>`
      },
      {
        id: 'faq-types',
        title: '类型转换',
        body: `<details>
<summary>MySQL 的 ENUM 类型如何转换？</summary>
<p>ENUM 类型会自动转换为 VARCHAR + CHECK 约束，保留原有的值域限制。例如 <code>ENUM('a','b','c')</code> 会转换为 <code>VARCHAR(20) CHECK (col IN ('a','b','c'))</code>。</p>
</details>

<details>
<summary>JSON 和 JSONB 有什么区别？如何选择？</summary>
<p>MySQL 的 JSON 类型默认映射为 PostgreSQL 的 JSONB（二进制 JSON），因为 JSONB 支持索引和更丰富的查询操作。如需保留原始 JSON 格式，可在配置中指定映射为 JSON 类型。</p>
</details>

<details>
<summary>支持哪些特殊数据类型的转换？</summary>
<p>覆盖 MySQL 全部字段类型：<code>BLOB → BYTEA</code>、<code>GEOMETRY → GEOMETRY</code>（PostGIS）、<code>DATETIME → TIMESTAMP</code>、<code>TINYINT(1) → BOOLEAN</code>、UNSIGNED 类型自动升级位宽、<code>SET → TEXT[]</code> 等，准确率 100%。</p>
</details>`
      },
      {
        id: 'faq-performance',
        title: '性能相关',
        body: `<details>
<summary>大表（亿级以上）如何处理？</summary>
<p>MySQL2PG 内置并发引擎，支持多表并行同步和单表分片同步。亿级数据表建议启用 5-20 个并发线程，先同步数据再创建索引以提升写入性能。详见 <a href="#bp-largetable">大表迁移优化</a>。</p>
</details>

<details>
<summary>迁移 100 张表大概需要多长时间？</summary>
<p>取决于数据量和网络带宽。典型场景：100 张表、千万级行数据，在局域网环境下约 5-15 分钟完成全量迁移（含结构转换 + 数据同步 + 索引重建）。</p>
</details>

<details>
<summary>支持增量迁移吗？</summary>
<p>当前版本主要面向全量迁移场景。对于增量同步需求，建议先使用 MySQL2PG 完成全量迁移，再配合 PostgreSQL 的 Logical Replication 或第三方 CDC 工具实现增量同步。</p>
</details>`
      },
      {
        id: 'faq-security',
        title: '安全运维',
        body: `<details>
<summary>数据迁移过程中源库可以继续写入吗？</summary>
<p>可以。MySQL2PG 在读取阶段使用一致性快照，不会影响源库的正常读写。但建议在业务低峰期执行迁移，以确保数据一致性校验的准确性。</p>
</details>

<details>
<summary>迁移失败如何回滚？</summary>
<p>MySQL2PG 采用"先转换后写入"策略，转换过程不影响源库。目标库写入前可先运行评估模式评估风险，且每个转换步骤可独立开关，支持分步执行和回退。</p>
</details>

<details>
<summary>迁移报告包含哪些内容？</summary>
<p>HTML 迁移报告包含：迁移总览（表数量、数据量、耗时）、每张表的转换状态、索引变更清单、函数映射详情、数据校验结果、风险告警和建议。详见 <a href="#report">生成迁移报告</a>。</p>
</details>`
      },
      {
        id: 'faq-advanced',
        title: '高级功能',
        body: `<details>
<summary>是否支持 Greenplum / YugabyteDB 等分布式数据库？</summary>
<p>支持。MySQL2PG 自动检测目标库是否为 MPP 分布式数据库（Greenplum / YugabyteDB），并自动添加 <code>DISTRIBUTED BY</code> 分布键，对冗余唯一索引进行自动处理。详见 <a href="#cfg-mpp">MPP 分布式配置</a>。</p>
</details>

<details>
<summary>如何获取技术支持？</summary>
<p>开源版用户可通过 <a href="https://github.com/xfg0218/MySQL2PG/issues" target="_blank" rel="noopener">GitHub Issues</a> 获取社区支持，通常 24 小时内响应。商业版用户享有优先技术支持通道，可通过邮件或微信社群直接联系技术团队。</p>
</details>`
      }
    ]
  },
  {
    id: 'appendix',
    title: '附录',
    sections: [
      {
        id: 'competitors',
        title: '竞品对比',
        body: `<table>
<thead><tr><th>功能特性</th><th>MySQL2PG</th><th>pgloader</th><th>AWS DMS</th><th>EDB MTK</th></tr></thead>
<tbody>
<tr><td>DDL 表结构自动转换</td><td>✓</td><td>✓</td><td>~</td><td>✓</td></tr>
<tr><td>索引自动转换</td><td>✓</td><td>✓</td><td>~</td><td>✓</td></tr>
<tr><td>视图自动转换</td><td>✓</td><td>~</td><td>~</td><td>—</td></tr>
<tr><td>函数/存储过程转换</td><td>✓</td><td>—</td><td>~</td><td>—</td></tr>
<tr><td>用户与权限迁移</td><td>✓</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>数据一致性校验</td><td>✓</td><td>—</td><td>✓</td><td>—</td></tr>
<tr><td>HTML 迁移报告</td><td>✓</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>迁移前风险评估</td><td>✓</td><td>—</td><td>✓</td><td>—</td></tr>
<tr><td>MPP 分布式支持</td><td>✓</td><td>~</td><td>✓</td><td>—</td></tr>
</tbody>
</table>
<blockquote><p>✓ 完全支持 · ~ 部分支持（需手工补充） · — 不支持</p></blockquote>`
      },
      {
        id: 'editions',
        title: '开源版与商业版',
        body: `<table>
<thead><tr><th>功能</th><th>开源版</th><th>商业版</th></tr></thead>
<tbody>
<tr><td>DDL 转换（表结构/索引）</td><td>✓</td><td>✓</td></tr>
<tr><td>全量数据迁移</td><td>✓</td><td>✓</td></tr>
<tr><td>数据类型自动映射</td><td>✓</td><td>✓</td></tr>
<tr><td>用户与权限迁移</td><td>✓</td><td>✓</td></tr>
<tr><td>本地运行 / 源库零修改</td><td>✓</td><td>✓</td></tr>
<tr><td>传输加密 / 凭证安全</td><td>✓</td><td>✓</td></tr>
<tr><td>视图转换</td><td>—</td><td>✓</td></tr>
<tr><td>函数转换</td><td>—</td><td>✓</td></tr>
<tr><td>MPP 数据库支持</td><td>—</td><td>✓</td></tr>
<tr><td>数据校验</td><td>—</td><td>✓</td></tr>
<tr><td>迁移前风险评估</td><td>—</td><td>✓</td></tr>
<tr><td>技术支持</td><td>社区</td><td>优先支持</td></tr>
</tbody>
</table>
<p>开源版采用 Apache-2.0 许可证。</p>`
      }
    ]
  }
]

const en = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    sections: [
      {
        id: 'install',
        title: 'Installation & Verification',
        body: `<h3>Download Binary</h3>
<p>Download the pre-compiled binary for your platform from <a href="https://github.com/xfg0218/MySQL2PG/releases" target="_blank" rel="noopener">GitHub Releases</a>.</p>

<h3>Verify Installation</h3>
<p><strong>Step 1</strong>: Make it executable</p>
<pre><code>chmod +x mysql2pg</code></pre>
<p><strong>Step 2</strong>: Check help output to confirm installation</p>
<pre><code>./mysql2pg -h</code></pre>
<p>Should display version number and usage information.</p>

<h3>Build from Source (Optional)</h3>
<pre><code>git clone https://github.com/xfg0218/MySQL2PG.git
cd MySQL2PG
make build</code></pre>
<p>Produces a single <code>mysql2pg</code> binary with no runtime dependencies.</p>
<p><strong>System requirements</strong>: 256MB RAM minimum, no Go runtime needed. Supports Linux / macOS / Windows.</p>`
      },
      {
        id: 'test-conn',
        title: 'Test Database Connection',
        body: `<p>Before running a migration, verify that MySQL and PostgreSQL connections work correctly.</p>

<h3>Step 1: Enable test mode in config</h3>
<pre><code># config.yml
mysql:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: mydb
  test_only: true          # Enable test mode

postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: your_password
  database: mydb
  test_only: true          # Enable test mode</code></pre>

<h3>Step 2: Run connection test</h3>
<pre><code>./mysql2pg -c config.yml</code></pre>

<h3>Step 3: Check output</h3>
<p>On success, MySQL and PostgreSQL version info is displayed:</p>
<pre><code>MySQL version: 8.0.36
PostgreSQL version: 16.2</code></pre>
<p>If connection fails, see <a href="#troubleshoot-conn">Connection Troubleshooting</a>.</p>

<blockquote><p>Test mode is read-only with no side effects. Response time is typically &lt; 1 second.</p></blockquote>`
      },
      {
        id: 'first-migration',
        title: 'First Migration (3 Steps)',
        body: `<h3>Step 1: Create config file</h3>
<p>Create <code>config.yml</code> with source and target connection info, enable all conversion options:</p>
<pre><code># config.yml
mysql:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: mydb

postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: your_password
  database: mydb

conversion:
  options:
    tableddl: true
    data: true
    view: true
    indexes: true
    functions: true
    users: true
    table_privileges: true
    validate_data: true</code></pre>

<h3>Step 2: Run migration</h3>
<pre><code>./mysql2pg -c config.yml</code></pre>
<p>The tool executes an 8-step pipeline: read tables → convert schemas → convert views → sync data → convert indexes → convert functions → convert users → convert privileges + validate.</p>
<p>Progress is output to console in real-time, updated once per second.</p>

<h3>Step 3: View migration report</h3>
<pre><code>./mysql2pg report -l conversion.log</code></pre>
<p>Generates a single-file HTML report with statistics cards, performance charts, table details, and inconsistency lists.</p>

<blockquote><p>Recommended: run <a href="#assess">pre-migration assessment</a> before your first migration to understand compatibility risks.</p></blockquote>`
      }
    ]
  },
  {
    id: 'operations',
    title: 'Migration Operations',
    sections: [
      {
        id: 'assess',
        title: 'Pre-Migration Assessment',
        body: `<p>Run an assessment before migration to analyze compatibility and identify risks early.</p>

<h3>When to Use</h3>
<ul>
<li>Before first migration, to understand overall compatibility</li>
<li>After source schema changes, to re-evaluate impact</li>
<li>When reporting migration risks to your team</li>
</ul>

<h3>Steps</h3>
<p><strong>Step 1</strong>: Ensure config file has correct connection info (no need for <code>test_only</code>)</p>
<p><strong>Step 2</strong>: Run assessment</p>
<pre><code>./mysql2pg assess config.yml</code></pre>
<p><strong>Step 3</strong>: Review the generated HTML assessment report</p>

<h3>Report Contents</h3>
<ul>
<li><strong>Overall score</strong>: 0-100 compatibility rating</li>
<li><strong>Risk level</strong>: Low / Medium / High</li>
<li><strong>Detailed list</strong>: Incompatibility issues and fix recommendations per object</li>
<li><strong>Statistics</strong>: Counts and DDL line counts for tables, views, functions, indexes, users, privileges</li>
</ul>

<blockquote><p>Assessment mode is read-only with no side effects. Safe to run on production databases.</p></blockquote>`
      },
      {
        id: 'full-migration',
        title: 'Run Full Migration',
        body: `<p>Full migration transfers all schemas, data, views, indexes, functions, users, and privileges from MySQL to PostgreSQL.</p>

<h3>Steps</h3>
<p><strong>Step 1</strong>: Verify config connection info and enable all conversion switches</p>
<p><strong>Step 2</strong>: (Recommended) Run <a href="#assess">pre-migration assessment</a> first</p>
<p><strong>Step 3</strong>: Execute migration</p>
<pre><code># Specify config file
./mysql2pg -c config.yml

# Or use default config.yml
./mysql2pg</code></pre>
<p><strong>Step 4</strong>: Monitor console output, confirm all 8 stages complete</p>
<p><strong>Step 5</strong>: Run <a href="#report">report generation</a> to review results</p>

<h3>Migration Pipeline</h3>
<pre><code>Step 1  Read MySQL table definitions (whitelist/blacklist filtering)
Step 2  Convert table schemas (smart type mapping)
Step 3  Convert views (backtick replacement, LIMIT syntax)
Step 4  Sync data (concurrent batch insert)
Step 5  Convert indexes (PK/unique/normal/fulltext rebuild)
Step 6  Convert functions (50+ function auto-mapping)
Step 7  Convert users (MySQL users → PG Roles)
Step 8  Convert privileges + data validation</code></pre>

<h3>Truncate Before Sync</h3>
<p>For complete data consistency, enable <code>truncate_before_sync</code>:</p>
<pre><code>conversion:
  options:
    truncate_before_sync: true
    validate_data: true</code></pre>
<p>Tool halts and returns error on validation failure.</p>

<h3>Append Sync (Preserve Existing Data)</h3>
<p>Do not truncate; new data is appended:</p>
<pre><code>conversion:
  options:
    truncate_before_sync: false
    validate_data: true</code></pre>
<p>Validation failures do not halt execution; inconsistency list is output at the end.</p>`
      },
      {
        id: 'op-tableddl',
        title: 'Schema Conversion',
        body: `<p>Automatically converts MySQL table definitions (DDL) to PostgreSQL-compatible syntax.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    tableddl: true</code></pre>

<h3>Conversion Process</h3>
<p><strong>Step 1</strong>: Tool reads all table definitions from MySQL source</p>
<p><strong>Step 2</strong>: Maps column types per table (e.g., <code>INT AUTO_INCREMENT</code> → <code>SERIAL</code>)</p>
<p><strong>Step 3</strong>: Executes <code>CREATE TABLE</code> on PostgreSQL target</p>

<h3>Key Conversion Rules</h3>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>INT AUTO_INCREMENT</code></td><td><code>SERIAL</code></td><td>Auto-increment integer</td></tr>
<tr><td><code>BIGINT AUTO_INCREMENT</code></td><td><code>BIGSERIAL</code></td><td>Auto-increment big integer</td></tr>
<tr><td><code>TINYINT(1)</code></td><td><code>BOOLEAN</code></td><td>Boolean value</td></tr>
<tr><td><code>DATETIME(n)</code></td><td><code>TIMESTAMP(n)</code></td><td>Preserves precision</td></tr>
<tr><td><code>JSON</code></td><td><code>JSONB</code></td><td>Binary JSON</td></tr>
<tr><td><code>ENUM('a','b')</code></td><td><code>VARCHAR(20) CHECK (...)</code></td><td>Value constraint</td></tr>
<tr><td><code>UNSIGNED</code> types</td><td>Auto width upgrade</td><td>No unsigned in PG</td></tr>
</tbody>
</table>

<h3>Skip Existing Tables</h3>
<pre><code>conversion:
  options:
    skip_existing_tables: true   # Default true</code></pre>

<h3>Lowercase Column Names</h3>
<pre><code>conversion:
  options:
    lowercase_columns: true      # Default true</code></pre>

<p>Full type mapping see <a href="#ref-types">Type Mapping Reference</a>.</p>`
      },
      {
        id: 'op-data',
        title: 'Data Sync',
        body: `<p>Concurrently batch-syncs MySQL table data to PostgreSQL.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    data: true</code></pre>

<h3>Sync Process</h3>
<p><strong>Step 1</strong>: Tool reads MySQL data table by table</p>
<p><strong>Step 2</strong>: Reads in batches (default 50,000 rows per batch)</p>
<p><strong>Step 3</strong>: Concurrent batch insert into PostgreSQL (default 10 threads)</p>
<p><strong>Step 4</strong>: Auto-disables foreign keys and indexes during insert for performance</p>

<h3>Tune Sync Speed</h3>
<pre><code>conversion:
  limits:
    concurrency: 20              # Threads (recommend CPU cores × 2)
    max_rows_per_batch: 10000    # Rows per read batch
    batch_insert_size: 10000     # Rows per insert batch
    bandwidth_mbps: 200          # Bandwidth limit (Mbps)</code></pre>

<h3>Large Table Optimization</h3>
<ul>
<li>Sync data first, create indexes after: set <code>indexes</code> to <code>false</code>, enable separately after data sync</li>
<li>Increase <code>concurrency</code> to 2× CPU cores</li>
<li>Check if network bandwidth is the bottleneck</li>
</ul>`
      },
      {
        id: 'op-view',
        title: 'View Conversion',
        body: `<p>Automatically converts MySQL view definitions to PostgreSQL-compatible syntax.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    view: true</code></pre>

<h3>Conversion Process</h3>
<p><strong>Step 1</strong>: Read all MySQL view definitions</p>
<p><strong>Step 2</strong>: Auto-convert syntax (backticks → double quotes, LIMIT syntax, function replacement)</p>
<p><strong>Step 3</strong>: Batch-create PostgreSQL views (10 per batch)</p>

<h3>Conversion Rules</h3>
<table>
<thead><tr><th>Rule</th><th>MySQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Identifiers</td><td><code>\`col\`</code></td><td><code>"col"</code></td></tr>
<tr><td>Pagination</td><td><code>LIMIT 10, 20</code></td><td><code>LIMIT 20 OFFSET 10</code></td></tr>
<tr><td>Standard paging</td><td><code>LIMIT 100</code></td><td><code>FETCH FIRST 100 ROWS ONLY</code></td></tr>
<tr><td>Functions</td><td>Auto-converted in views</td><td>Same as function table</td></tr>
</tbody>
</table>

<h3>Skip Failed Views</h3>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_complex_report, v_temp_stats]</code></pre>
<p>View names are case-insensitive. Conversion accuracy: 90%.</p>`
      },
      {
        id: 'op-index',
        title: 'Index Conversion',
        body: `<p>Automatically rebuilds MySQL indexes as PostgreSQL indexes.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    indexes: true</code></pre>

<h3>Conversion Process</h3>
<p><strong>Step 1</strong>: Read all index definitions from MySQL tables</p>
<p><strong>Step 2</strong>: Convert by type (primary key / unique / normal / fulltext)</p>
<p><strong>Step 3</strong>: Batch-create PostgreSQL indexes (20 per batch)</p>

<h3>Supported Index Types</h3>
<ul>
<li><strong>Primary key</strong>: Auto-converted</li>
<li><strong>Unique index</strong>: Auto-converted</li>
<li><strong>Normal index</strong>: Auto-converted</li>
<li><strong>Fulltext index</strong>: Converted to <code>GIN</code> index + <code>to_tsvector</code></li>
</ul>

<h3>MPP Distribution Keys</h3>
<p>With MPP mode enabled, primary key columns are automatically used as <code>DISTRIBUTED BY</code> distribution keys. Redundant UNIQUE INDEX is skipped on Greenplum.</p>`
      },
      {
        id: 'op-function',
        title: 'Function Conversion',
        body: `<p>Automatically maps MySQL built-in functions and stored procedures to PostgreSQL equivalents.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    functions: true</code></pre>

<h3>Conversion Process</h3>
<p><strong>Step 1</strong>: Read all MySQL function and stored procedure definitions</p>
<p><strong>Step 2</strong>: Map syntax per function (50+ built-in functions auto-converted)</p>
<p><strong>Step 3</strong>: Batch-create PostgreSQL functions (5 per batch)</p>

<h3>Common Function Mappings</h3>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>Category</th></tr></thead>
<tbody>
<tr><td><code>IFNULL(x, y)</code></td><td><code>COALESCE(x, y)</code></td><td>Null handling</td></tr>
<tr><td><code>IF(cond, a, b)</code></td><td><code>CASE WHEN ... END</code></td><td>Conditional</td></tr>
<tr><td><code>GROUP_CONCAT(x)</code></td><td><code>STRING_AGG(...)</code></td><td>Aggregation</td></tr>
<tr><td><code>DATE_FORMAT(dt, fmt)</code></td><td><code>TO_CHAR(dt, fmt)</code></td><td>Date format</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt; 'key'</code></td><td>JSON</td></tr>
<tr><td><code>REGEXP_LIKE(expr, pat)</code></td><td><code>expr ~ pat</code></td><td>Regex</td></tr>
</tbody>
</table>

<h3>Skip Failed Functions</h3>
<pre><code>conversion:
  options:
    exclude_use_function_list: true
    exclude_function_list: [func_deprecated, func_mysql_only]</code></pre>
<p>Function names are case-insensitive. Conversion accuracy: 90%+. Full mapping see <a href="#ref-functions">Function Conversion Reference</a>.</p>`
      },
      {
        id: 'op-user',
        title: 'User & Privilege Migration',
        body: `<p>Automatically converts MySQL users and table-level privileges to PostgreSQL Roles and GRANTs.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    users: true
    table_privileges: true</code></pre>

<h3>User Conversion Steps</h3>
<p><strong>Step 1</strong>: Read all MySQL user definitions</p>
<p><strong>Step 2</strong>: Convert <code>CREATE USER</code> to <code>CREATE ROLE ... WITH LOGIN</code></p>
<p><strong>Step 3</strong>: Preserve password hashes (supports md5 and scram-sha-256)</p>
<pre><code>-- MySQL
CREATE USER 'app_user'@'%' IDENTIFIED BY 'SecurePass123';

-- Auto-converted to PostgreSQL
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecurePass123';</code></pre>

<h3>Privilege Conversion Steps</h3>
<p><strong>Step 1</strong>: Read all MySQL table-level GRANTs</p>
<p><strong>Step 2</strong>: Map to PostgreSQL GRANT syntax</p>
<pre><code>-- MySQL
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'%';

-- Auto-converted to PostgreSQL
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;</code></pre>

<h3>Password Encryption</h3>
<pre><code>postgresql:
  password_encryption: auto  # md5 / scram-sha-256 / auto</code></pre>
<p>PostgreSQL 14+ defaults to <code>scram-sha-256</code>. Set to <code>md5</code> for older client compatibility.</p>`
      },
      {
        id: 'op-validate',
        title: 'Data Validation',
        body: `<p>After migration, automatically compares row counts between source and target to verify data consistency.</p>

<h3>How to Enable</h3>
<pre><code>conversion:
  options:
    validate_data: true</code></pre>

<h3>Validation Process</h3>
<p><strong>Step 1</strong>: Count rows per table in both MySQL and PostgreSQL</p>
<p><strong>Step 2</strong>: Compare row counts</p>
<p><strong>Step 3</strong>: Output validation results</p>

<h3>Handling Results</h3>
<p><strong>Consistent</strong>: Table marked as passed.</p>
<p><strong>Inconsistent</strong>: Inconsistency list is output:</p>
<pre><code>+------------------+----------------+------------------+
| Table            | MySQL Count    | PostgreSQL Count |
+------------------+----------------+------------------+
| user             | 327680         | 655360           |
+------------------+----------------+------------------+</code></pre>

<h3>Behavior on Mismatch</h3>
<ul>
<li><code>truncate_before_sync: true</code>: Validation failure <strong>halts execution</strong> with error</li>
<li><code>truncate_before_sync: false</code>: Validation failure <strong>does not halt</strong>, inconsistency list output at end</li>
</ul>

<h3>Common Causes</h3>
<ul>
<li>New writes to source during migration</li>
<li>Triggers causing extra rows</li>
<li><code>truncate_before_sync</code> not enabled, causing data duplication</li>
</ul>`
      },
      {
        id: 'report',
        title: 'Generate Migration Report',
        body: `<p>Generate a visual HTML report from conversion logs without re-running the migration.</p>

<h3>Steps</h3>
<p><strong>Step 1</strong>: Confirm conversion log file exists (default <code>conversion.log</code>)</p>
<p><strong>Step 2</strong>: Run report generation</p>
<pre><code># Basic usage
./mysql2pg report -l conversion.log

# Include error log
./mysql2pg report -l conversion.log -e errors.log

# Custom output path
./mysql2pg report -l conversion.log -o my-report.html</code></pre>

<h3>Parameters</h3>
<table>
<thead><tr><th>Flag</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>-l</code></td><td>Conversion log file path (required)</td></tr>
<tr><td><code>-e</code></td><td>Error log file path (optional)</td></tr>
<tr><td><code>-o</code></td><td>Output HTML file path (optional, auto-generated with timestamp by default)</td></tr>
</tbody>
</table>

<h3>Report Contents</h3>
<p>Single-file HTML with dark terminal theme, including:</p>
<ul>
<li>Statistics cards (table count, row count, duration)</li>
<li>Performance bar charts</li>
<li>Table details (row counts and conversion status per table)</li>
<li>Data inconsistency list</li>
</ul>`
      }
    ]
  },
  {
    id: 'config-guide',
    title: 'Configuration Guide',
    sections: [
      {
        id: 'cfg-connection',
        title: 'Database Connection',
        body: `<table>
<thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>mysql.host</code> / <code>postgresql.host</code></td><td><code>localhost</code></td><td>Database host</td></tr>
<tr><td><code>mysql.port</code> / <code>postgresql.port</code></td><td><code>3306</code> / <code>5432</code></td><td>Port number</td></tr>
<tr><td><code>mysql.username</code> / <code>postgresql.username</code></td><td>—</td><td>Username</td></tr>
<tr><td><code>mysql.password</code> / <code>postgresql.password</code></td><td>—</td><td>Password, supports env var injection</td></tr>
<tr><td><code>mysql.database</code> / <code>postgresql.database</code></td><td>—</td><td>Database name</td></tr>
<tr><td><code>mysql.test_only</code> / <code>postgresql.test_only</code></td><td><code>false</code></td><td>Connection test only</td></tr>
<tr><td><code>mysql.max_open_conns</code></td><td><code>100</code></td><td>MySQL max open connections</td></tr>
<tr><td><code>mysql.max_idle_conns</code></td><td><code>50</code></td><td>MySQL max idle connections</td></tr>
<tr><td><code>postgresql.max_conns</code></td><td><code>50</code></td><td>PostgreSQL max connections</td></tr>
<tr><td><code>mysql.connection_params</code></td><td>—</td><td>MySQL connection params, format <code>key=value&amp;key=value</code></td></tr>
<tr><td><code>postgresql.pg_connection_params</code></td><td>—</td><td>PostgreSQL connection params</td></tr>
</tbody>
</table>`
      },
      {
        id: 'cfg-switches',
        title: 'Conversion Switches',
        body: `<p>Each conversion step can be independently toggled:</p>
<table>
<thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>conversion.options.tableddl</code></td><td><code>true</code></td><td>Convert table schemas</td></tr>
<tr><td><code>conversion.options.data</code></td><td><code>true</code></td><td>Sync data</td></tr>
<tr><td><code>conversion.options.view</code></td><td><code>true</code></td><td>Convert views</td></tr>
<tr><td><code>conversion.options.indexes</code></td><td><code>true</code></td><td>Convert indexes</td></tr>
<tr><td><code>conversion.options.functions</code></td><td><code>true</code></td><td>Convert functions</td></tr>
<tr><td><code>conversion.options.users</code></td><td><code>true</code></td><td>Convert users</td></tr>
<tr><td><code>conversion.options.table_privileges</code></td><td><code>true</code></td><td>Convert table privileges</td></tr>
<tr><td><code>conversion.options.validate_data</code></td><td><code>true</code></td><td>Validate data consistency after sync</td></tr>
<tr><td><code>conversion.options.truncate_before_sync</code></td><td><code>false</code></td><td>Truncate target table before sync</td></tr>
<tr><td><code>conversion.options.skip_existing_tables</code></td><td><code>true</code></td><td>Skip if target table exists</td></tr>
<tr><td><code>conversion.options.lowercase_columns</code></td><td><code>true</code></td><td>Lowercase column names</td></tr>
</tbody>
</table>`
      },
      {
        id: 'cfg-filter',
        title: 'Table Filtering (Whitelist / Blacklist)',
        body: `<h3>Whitelist Mode — Migrate Specific Tables Only</h3>
<pre><code>conversion:
  options:
    use_table_list: true
    table_list: [users, orders, products]</code></pre>

<h3>Blacklist Mode — Skip Specific Tables</h3>
<pre><code>conversion:
  options:
    exclude_use_table_list: true
    exclude_table_list: [tmp_log, cache_data]</code></pre>

<h3>Skip Specific Views</h3>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_complex_report]</code></pre>

<h3>Skip Specific Functions</h3>
<pre><code>conversion:
  options:
    exclude_use_function_list: true
    exclude_function_list: [func_deprecated]</code></pre>

<blockquote><p>Whitelist and blacklist cannot be used simultaneously; whitelist takes precedence. Table names are case-sensitive; view and function names are case-insensitive.</p></blockquote>`
      },
      {
        id: 'cfg-perf',
        title: 'Concurrency & Performance Tuning',
        body: `<table>
<thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>conversion.limits.concurrency</code></td><td><code>10</code></td><td>Concurrent threads</td></tr>
<tr><td><code>conversion.limits.max_rows_per_batch</code></td><td><code>50000</code></td><td>Rows per read batch</td></tr>
<tr><td><code>conversion.limits.batch_insert_size</code></td><td><code>50000</code></td><td>Rows per insert batch</td></tr>
<tr><td><code>conversion.limits.bandwidth_mbps</code></td><td><code>100</code></td><td>Network bandwidth limit (Mbps)</td></tr>
</tbody>
</table>

<h3>Recommended Config for Large Tables (100M+ rows)</h3>
<pre><code>conversion:
  limits:
    concurrency: 20          # Adjust based on CPU cores
    max_rows_per_batch: 10000
    batch_insert_size: 10000
    bandwidth_mbps: 200</code></pre>

<h3>Optimization Tips</h3>
<ul>
<li>Set <code>concurrency</code> to 2× CPU cores</li>
<li>Sync data first, create indexes after: set <code>indexes</code> to <code>false</code>, enable separately</li>
<li>Check if network bandwidth is the bottleneck</li>
</ul>`
      },
      {
        id: 'cfg-mpp',
        title: 'MPP Distributed Config',
        body: `<p>When migrating to Greenplum or YugabyteDB, enable MPP mode to auto-add distribution keys.</p>

<h3>Enable MPP</h3>
<pre><code>conversion:
  mpp:
    enabled: true
    database: auto  # Auto-detect, or specify greenplum / yugabyte</code></pre>

<h3>Behavior When Enabled</h3>
<ul>
<li>Auto-uses primary key columns as <code>DISTRIBUTED BY</code> distribution keys</li>
<li>Skips redundant UNIQUE INDEX on Greenplum</li>
<li>Auto-detects target database type (<code>auto</code> mode)</li>
</ul>`
      },
      {
        id: 'cfg-full',
        title: 'Full Configuration Reference',
        body: `<p>Complete annotated configuration file, ready to copy:</p>
<details>
<summary>Click to expand full config</summary>
<pre><code># MySQL connection
mysql:
  host: localhost
  port: 3306
  username: root
  password: password
  database: test_db
  test_only: false
  max_open_conns: 100
  max_idle_conns: 50
  conn_max_lifetime: 3600
  connection_params: charset=utf8mb4&amp;parseTime=false&amp;interpolateParams=true&amp;readTimeout=60s&amp;writeTimeout=60s&amp;timeout=30s

# PostgreSQL connection
postgresql:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: test_db
  test_only: false
  max_conns: 50
  pg_connection_params: search_path=public connect_timeout=300 statement_timeout=0
  password_encryption: auto  # md5 / scram-sha-256 / auto

# Conversion config
conversion:
  options:
    tableddl: true
    data: true
    view: true
    indexes: true
    functions: true
    users: true
    table_privileges: true
    lowercase_columns: true
    skip_existing_tables: true
    validate_data: true
    truncate_before_sync: false
    use_table_list: false
    table_list: [table1]
    exclude_use_table_list: false
    exclude_table_list: [table1]
    exclude_use_view_list: false
    exclude_view_list: [view1]
    exclude_use_function_list: false
    exclude_function_list: [func1]

  mpp:
    enabled: false
    database: auto  # greenplum / yugabyte / auto

  limits:
    concurrency: 10
    bandwidth_mbps: 100
    max_ddl_per_batch: 10
    max_functions_per_batch: 5
    max_indexes_per_batch: 20
    max_users_per_batch: 10
    max_rows_per_batch: 1000
    batch_insert_size: 1000

# Runtime config
run:
  show_progress: true
  error_log_path: ./errors.log
  enable_file_logging: true
  log_file_path: ./conversion.log
  show_console_logs: true
  show_log_in_console: false</code></pre>
</details>`
      }
    ]
  },
  {
    id: 'reference',
    title: 'Reference',
    sections: [
      {
        id: 'ref-types',
        title: 'Type Mapping Reference',
        body: `<p>Covers all MySQL column types with 100% mapping accuracy.</p>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>INT AUTO_INCREMENT</code></td><td><code>SERIAL</code></td><td>Auto-increment integer</td></tr>
<tr><td><code>BIGINT AUTO_INCREMENT</code></td><td><code>BIGSERIAL</code></td><td>Auto-increment big integer</td></tr>
<tr><td><code>TINYINT(1)</code></td><td><code>BOOLEAN</code></td><td>Boolean value</td></tr>
<tr><td><code>DATETIME</code> / <code>DATETIME(n)</code></td><td><code>TIMESTAMP</code> / <code>TIMESTAMP(n)</code></td><td>Preserves precision</td></tr>
<tr><td><code>JSON</code></td><td><code>JSONB</code></td><td>Maps to binary JSON by default</td></tr>
<tr><td><code>BLOB</code> / <code>LONGBLOB</code> / <code>BINARY</code></td><td><code>BYTEA</code></td><td>Unified binary type</td></tr>
<tr><td><code>ENUM('a','b')</code></td><td><code>VARCHAR(20) CHECK (col IN ('a','b'))</code></td><td>Value constraint preserved</td></tr>
<tr><td><code>SET</code></td><td><code>TEXT[]</code></td><td>Set to array</td></tr>
<tr><td><code>GEOMETRY</code></td><td><code>GEOMETRY</code></td><td>Requires PostGIS extension</td></tr>
<tr><td><code>DOUBLE</code></td><td><code>DOUBLE PRECISION</code></td><td>Double precision float</td></tr>
<tr><td><code>UNSIGNED</code> types</td><td>Auto width upgrade</td><td>No unsigned types in PostgreSQL</td></tr>
</tbody>
</table>`
      },
      {
        id: 'ref-functions',
        title: 'Function Conversion Reference',
        body: `<p>Supports 50+ MySQL built-in function auto-mappings with 90%+ accuracy.</p>
<table>
<thead><tr><th>MySQL</th><th>PostgreSQL</th><th>Category</th></tr></thead>
<tbody>
<tr><td><code>IFNULL(x, y)</code></td><td><code>COALESCE(x, y)</code></td><td>Null handling</td></tr>
<tr><td><code>IF(cond, a, b)</code></td><td><code>CASE WHEN cond THEN a ELSE b END</code></td><td>Conditional</td></tr>
<tr><td><code>GROUP_CONCAT(x)</code></td><td><code>STRING_AGG(CAST(x AS text), ',')</code></td><td>Aggregation</td></tr>
<tr><td><code>DATE_FORMAT(dt, fmt)</code></td><td><code>TO_CHAR(dt, fmt)</code></td><td>Date format</td></tr>
<tr><td><code>STR_TO_DATE(s, fmt)</code></td><td><code>TO_DATE(s, fmt)</code></td><td>Date parse</td></tr>
<tr><td><code>DATEDIFF(d1, d2)</code></td><td><code>date_part('day', d1 - d2)</code></td><td>Date diff</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt; 'key'</code></td><td>JSON extract</td></tr>
<tr><td><code>JSON_EXTRACT(doc, path)</code></td><td><code>doc -&gt;&gt; 'key'</code></td><td>JSON text value</td></tr>
<tr><td><code>REGEXP_LIKE(expr, pat)</code></td><td><code>expr ~ pat</code></td><td>Regex match</td></tr>
<tr><td><code>REGEXP_REPLACE(s, p, r)</code></td><td><code>regexp_replace(s, p, r)</code></td><td>Regex replace</td></tr>
<tr><td><code>CONCAT(a, b)</code></td><td><code>a || b</code></td><td>String concat</td></tr>
<tr><td><code>UNIX_TIMESTAMP()</code></td><td><code>extract(epoch from now())</code></td><td>Timestamp</td></tr>
<tr><td><code>UUID()</code></td><td><code>uuid_generate_v4()</code></td><td>UUID generation</td></tr>
</tbody>
</table>`
      },
      {
        id: 'ref-view',
        title: 'View Conversion Rules',
        body: `<table>
<thead><tr><th>Rule</th><th>MySQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Identifiers</td><td>Backticks <code>\`col\`</code></td><td>Double quotes <code>"col"</code></td></tr>
<tr><td>Pagination</td><td><code>LIMIT 10, 20</code></td><td><code>LIMIT 20 OFFSET 10</code></td></tr>
<tr><td>Standard paging</td><td><code>LIMIT 100</code></td><td><code>FETCH FIRST 100 ROWS ONLY</code></td></tr>
<tr><td>Function replacement</td><td>Auto-converted in views</td><td>Same as function table</td></tr>
</tbody>
</table>
<p>View conversion accuracy: 90%, supports batch conversion (10 per batch).</p>`
      },
      {
        id: 'ref-user',
        title: 'User & Privilege Mapping',
        body: `<h3>User Conversion</h3>
<pre><code>-- MySQL
CREATE USER 'app_user'@'%' IDENTIFIED BY 'SecurePass123';

-- PostgreSQL
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecurePass123';</code></pre>

<h3>Privilege Conversion</h3>
<pre><code>-- MySQL
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'%';

-- PostgreSQL
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;</code></pre>
<p>Password hashes preserved, table-level GRANT fully mapped, 100% accuracy.</p>`
      },
      {
        id: 'ref-versions',
        title: 'Version Compatibility',
        body: `<h3>MySQL (Source)</h3>
<p><code>5.7+</code> · <code>8.0</code> · <code>8.4</code> · <code>9.0+</code></p>

<h3>PostgreSQL (Target)</h3>
<p><code>12</code> · <code>13</code> · <code>14</code> · <code>15</code> · <code>16</code> · <code>17</code> · <code>18</code></p>

<h3>MPP Distributed Databases</h3>
<p><code>Greenplum</code> · <code>YugabyteDB</code></p>

<p>The tool auto-detects source and target database versions at startup and selects optimal conversion strategies (e.g., JSON path syntax, REGEXP_* parameter support).</p>

<h3>Data Security</h3>
<ul>
<li><strong>Credential security</strong>: Config files stored locally, passwords support env var injection, credentials never uploaded to external services</li>
<li><strong>Transport encryption</strong>: Supports SSL/TLS encrypted connections, data encrypted in transit</li>
<li><strong>Zero source modification</strong>: Assessment mode is read-only, production migration uses "convert then write" strategy with consistent snapshots</li>
</ul>`
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    sections: [
      {
        id: 'troubleshoot-conn',
        title: 'Connection Issues',
        body: `<h3>Troubleshooting Steps</h3>
<p><strong>Step 1</strong>: Use test_only mode to verify connections</p>
<pre><code># In config file, set
mysql:
  test_only: true
postgresql:
  test_only: true</code></pre>
<pre><code>./mysql2pg -c config.yml</code></pre>

<p><strong>Step 2</strong>: Check each item</p>
<ul>
<li>Network connectivity: <code>ping &lt;host&gt;</code></li>
<li>Port availability: <code>telnet &lt;host&gt; &lt;port&gt;</code></li>
<li>Username/password correctness</li>
<li>Database existence</li>
<li>Firewall / security group rules</li>
</ul>

<h3>Password Authentication Failure</h3>
<p>PostgreSQL 14+ defaults to <code>scram-sha-256</code>. For older client compatibility:</p>
<pre><code>postgresql:
  password_encryption: md5  # or scram-sha-256 / auto</code></pre>`
      },
      {
        id: 'troubleshoot-validate',
        title: 'Data Validation Mismatch',
        body: `<h3>Symptom</h3>
<p>After migration, the validation report shows row count mismatches for some tables.</p>

<h3>Troubleshooting Steps</h3>
<p><strong>Step 1</strong>: Check if <code>truncate_before_sync</code> is enabled</p>
<ul>
<li>Not enabled → Likely data duplication, recommend enabling and re-running</li>
<li>Enabled → Continue to step 2</li>
</ul>
<p><strong>Step 2</strong>: Check if source had new writes during migration</p>
<p><strong>Step 3</strong>: Check if target has triggers causing extra rows</p>
<p><strong>Step 4</strong>: Check <code>errors.log</code> for detailed error information</p>`
      },
      {
        id: 'troubleshoot-convert',
        title: 'Conversion Failures',
        body: `<h3>View or Function Conversion Failure</h3>
<p><strong>Step 1</strong>: Check <code>errors.log</code> for detailed error information</p>
<p><strong>Step 2</strong>: Use exclude lists to skip failed objects</p>
<pre><code>conversion:
  options:
    exclude_use_view_list: true
    exclude_view_list: [v_failed_view]
    exclude_use_function_list: true
    exclude_function_list: [func_failed]</code></pre>
<p><strong>Step 3</strong>: Re-run migration</p>
<p><strong>Step 4</strong>: Manually handle skipped objects</p>

<h3>GEOMETRY Type Error</h3>
<p>Target database requires PostGIS extension:</p>
<pre><code>CREATE EXTENSION postgis;</code></pre>`
      },
      {
        id: 'troubleshoot-perf',
        title: 'Performance Issues',
        body: `<h3>Slow Large Table Migration</h3>
<p><strong>Step 1</strong>: Increase concurrency</p>
<pre><code>conversion:
  limits:
    concurrency: 20</code></pre>
<p><strong>Step 2</strong>: Adjust batch sizes</p>
<pre><code>conversion:
  limits:
    max_rows_per_batch: 10000
    batch_insert_size: 10000</code></pre>
<p><strong>Step 3</strong>: Sync data first, create indexes after</p>
<pre><code># First run: data only
conversion:
  options:
    indexes: false

# Second run: indexes only
conversion:
  options:
    tableddl: false
    data: false
    indexes: true</code></pre>
<p><strong>Step 4</strong>: Check if network bandwidth is the bottleneck, increase <code>bandwidth_mbps</code> if needed</p>`
      }
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    sections: [
      {
        id: 'bp-strategy',
        title: 'Migration Strategy Selection',
        body: `<p>Choose the right migration strategy based on your business scenario.</p>

<h3>Scenario 1: Maintenance Window Migration</h3>
<p>For scenarios where brief downtime is acceptable, with highest data consistency requirements.</p>
<pre><code>conversion:
  options:
    truncate_before_sync: true
    validate_data: true
    concurrency: 20</code></pre>
<p>Tool halts on validation failure, ensuring complete data consistency before proceeding.</p>

<h3>Scenario 2: Online Append Migration</h3>
<p>For zero-downtime scenarios, preserving existing target data.</p>
<pre><code>conversion:
  options:
    truncate_before_sync: false
    validate_data: true</code></pre>
<p>Validation mismatches do not halt execution; a discrepancy list is output for manual review.</p>

<h3>Scenario 3: Phased Migration</h3>
<p>For very large databases, migrating in batches by business module.</p>
<pre><code># Phase 1: Core business tables
conversion:
  options:
    use_table_list: true
    table_list: [users, orders, payments]

# Phase 2: Auxiliary tables
conversion:
  options:
    use_table_list: true
    table_list: [logs, analytics, cache]</code></pre>

<h3>Scenario 4: Schema-Only Migration</h3>
<p>Migrate table schemas and indexes only, no data sync (data imported via other tools).</p>
<pre><code>conversion:
  options:
    tableddl: true
    indexes: true
    data: false
    view: false
    functions: false</code></pre>`
      },
      {
        id: 'bp-largetable',
        title: 'Large Table Optimization',
        body: `<p>Tables with 100M+ rows require special optimization.</p>

<h3>Step 1: Separate Data and Indexes</h3>
<p>Sync data first, create indexes after to avoid index maintenance slowing writes:</p>
<pre><code># First run: data only
conversion:
  options:
    tableddl: true
    data: true
    indexes: false
    view: false
    functions: false

# Second run: indexes and views only
conversion:
  options:
    tableddl: false
    data: false
    indexes: true
    view: true
    functions: true</code></pre>

<h3>Step 2: Increase Concurrency and Batch Size</h3>
<pre><code>conversion:
  limits:
    concurrency: 20              # CPU cores × 2
    max_rows_per_batch: 10000
    batch_insert_size: 10000
    bandwidth_mbps: 200</code></pre>

<h3>Step 3: Exclude Non-Essential Indexes</h3>
<p>If certain indexes are not needed during migration, skip them and create manually after migration completes.</p>

<h3>Step 4: Monitor Migration Progress</h3>
<p>Enable file logging to track per-table sync progress in real-time:</p>
<pre><code>run:
  enable_file_logging: true
  log_file_path: ./conversion.log
  show_progress: true</code></pre>`
      },
      {
        id: 'bp-safety',
        title: 'Data Safety Practices',
        body: `<h3>Credential Management</h3>
<ul>
<li>Use environment variables for passwords, avoid plaintext in config files</li>
<li>Set config file permissions to <code>600</code>, owner read/write only</li>
<li>Never commit config files to version control</li>
</ul>
<pre><code># Use environment variables
export MYSQL_PASSWORD=your_password
export PG_PASSWORD=your_password</code></pre>

<h3>Pre-Migration Backup</h3>
<ul>
<li>Full backup of target PostgreSQL database before migration</li>
<li>Use <code>pg_dump</code> to backup current target state</li>
<li>Keep MySQL source snapshot for rollback</li>
</ul>

<h3>Post-Migration Verification</h3>
<ul>
<li>Always enable <code>validate_data: true</code></li>
<li>Check <code>errors.log</code> for unhandled errors</li>
<li>Sample data comparison on critical business tables</li>
<li>Run a complete migration dry-run in test environment first</li>
</ul>

<h3>SSL/TLS Encrypted Connections</h3>
<p>Recommended for production environments:</p>
<pre><code>mysql:
  connection_params: tls=true&amp;tlsConfig=preferred

postgresql:
  pg_connection_params: sslmode=require</code></pre>`
      }
    ]
  },
  {
    id: 'cli-reference',
    title: 'CLI Reference',
    sections: [
      {
        id: 'cli-commands',
        title: 'Command Overview',
        body: `<table>
<thead><tr><th>Command</th><th>Description</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>./mysql2pg</code></td><td>Run migration (default config.yml)</td><td><code>./mysql2pg</code></td></tr>
<tr><td><code>./mysql2pg -c &lt;file&gt;</code></td><td>Run migration with specified config</td><td><code>./mysql2pg -c prod.yml</code></td></tr>
<tr><td><code>./mysql2pg &lt;file&gt;</code></td><td>Run migration with config (shorthand)</td><td><code>./mysql2pg prod.yml</code></td></tr>
<tr><td><code>./mysql2pg -h</code></td><td>Show help</td><td><code>./mysql2pg -h</code></td></tr>
<tr><td><code>./mysql2pg assess &lt;file&gt;</code></td><td>Run pre-migration assessment</td><td><code>./mysql2pg assess config.yml</code></td></tr>
<tr><td><code>./mysql2pg report -l &lt;log&gt;</code></td><td>Generate HTML report from log</td><td><code>./mysql2pg report -l conversion.log</code></td></tr>
</tbody>
</table>`
      },
      {
        id: 'cli-flags',
        title: 'Flag Reference',
        body: `<h3>Migration Command Flags</h3>
<table>
<thead><tr><th>Flag</th><th>Description</th><th>Default</th></tr></thead>
<tbody>
<tr><td><code>-c &lt;file&gt;</code></td><td>Config file path</td><td><code>config.yml</code></td></tr>
<tr><td><code>-h</code></td><td>Show help</td><td>—</td></tr>
</tbody>
</table>

<h3>report Command Flags</h3>
<table>
<thead><tr><th>Flag</th><th>Description</th><th>Required</th></tr></thead>
<tbody>
<tr><td><code>-l &lt;file&gt;</code></td><td>Conversion log file path</td><td>Yes</td></tr>
<tr><td><code>-e &lt;file&gt;</code></td><td>Error log file path</td><td>No</td></tr>
<tr><td><code>-o &lt;file&gt;</code></td><td>Output HTML file path</td><td>No (auto-generated with timestamp)</td></tr>
</tbody>
</table>

<h3>assess Command Flags</h3>
<table>
<thead><tr><th>Flag</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>&lt;file&gt;</code></td><td>Config file path (positional argument)</td></tr>
</tbody>
</table>

<h3>Exit Codes</h3>
<table>
<thead><tr><th>Code</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Migration completed successfully</td></tr>
<tr><td><code>1</code></td><td>Migration failed (connection error, conversion error, validation failure, etc.)</td></tr>
</tbody>
</table>`
      }
    ]
  },
  {
    id: 'logging',
    title: 'Logging & Monitoring',
    sections: [
      {
        id: 'log-config',
        title: 'Log Configuration',
        body: `<p>MySQL2PG supports both console and file log output.</p>

<h3>Configuration Parameters</h3>
<table>
<thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>run.enable_file_logging</code></td><td><code>true</code></td><td>Enable file logging</td></tr>
<tr><td><code>run.log_file_path</code></td><td><code>./conversion.log</code></td><td>Conversion log file path</td></tr>
<tr><td><code>run.error_log_path</code></td><td><code>./errors.log</code></td><td>Error log file path</td></tr>
<tr><td><code>run.show_console_logs</code></td><td><code>true</code></td><td>Show progress logs in console</td></tr>
<tr><td><code>run.show_log_in_console</code></td><td><code>false</code></td><td>Show detailed logs in console</td></tr>
<tr><td><code>run.show_progress</code></td><td><code>true</code></td><td>Show progress bar</td></tr>
</tbody>
</table>

<h3>Recommended Configuration</h3>
<p>For production, enable both file logging and console progress:</p>
<pre><code>run:
  enable_file_logging: true
  log_file_path: ./conversion.log
  error_log_path: ./errors.log
  show_console_logs: true
  show_log_in_console: false
  show_progress: true</code></pre>

<h3>Log File Purposes</h3>
<ul>
<li><code>conversion.log</code>: Records per-table conversion details, used for HTML report generation</li>
<li><code>errors.log</code>: Records detailed error information for failed conversions, used for troubleshooting</li>
</ul>`
      },
      {
        id: 'log-progress',
        title: 'Progress Monitoring',
        body: `<p>During migration, the console displays real-time progress information.</p>

<h3>Progress Output Example</h3>
<pre><code>[Step 4/8] Syncing data...
  Table: users        [████████████████████] 100% (327680/327680 rows)
  Table: orders       [████████░░░░░░░░░░░░]  42% (524288/1250000 rows)
  Table: products     [░░░░░░░░░░░░░░░░░░░░]   0% (0/85000 rows)
  Speed: 45230 rows/s | Elapsed: 00:02:35 | ETA: 00:05:12</code></pre>

<h3>Key Metrics</h3>
<ul>
<li><strong>Speed</strong>: Current sync rate (rows/sec), indicates whether tuning is needed</li>
<li><strong>Elapsed</strong>: Time elapsed</li>
<li><strong>ETA</strong>: Estimated time remaining</li>
<li><strong>Progress bar</strong>: Per-table completion percentage</li>
</ul>

<h3>Background Execution & Log Tailing</h3>
<p>For long migrations, run in background and tail logs:</p>
<pre><code># Run in background
nohup ./mysql2pg -c config.yml > output.log 2>&1 &

# Tail progress
tail -f conversion.log

# Check errors
tail -f errors.log</code></pre>`
      }
    ]
  },
  {
    id: 'faq',
    title: 'FAQ',
    sections: [
      {
        id: 'faq-general',
        title: 'General',
        body: `<details>
<summary>Which MySQL storage engines are supported?</summary>
<p>MySQL2PG supports all major storage engines including InnoDB, MyISAM, and MEMORY. InnoDB tables automatically handle foreign key constraint migration.</p>
</details>

<details>
<summary>Which MySQL and PostgreSQL versions are supported?</summary>
<p>MySQL source: 5.7, 8.0, 8.4, 9.0+. PostgreSQL target: 12 through 18, including Greenplum and YugabyteDB compatibility.</p>
</details>

<details>
<summary>What are the system requirements for MySQL2PG?</summary>
<p>MySQL2PG is a single statically-compiled Go binary with zero external dependencies. It runs on Linux, macOS, and Windows with as little as 256MB RAM — no runtime installation needed.</p>
</details>

<details>
<summary>What license does MySQL2PG use? Can I use it commercially?</summary>
<p>The open-source edition uses the Apache-2.0 license and is free for commercial use. The commercial edition adds function conversion, MPP support, data validation, and dedicated technical support.</p>
</details>`
      },
      {
        id: 'faq-types',
        title: 'Type Conversion',
        body: `<details>
<summary>How is MySQL ENUM type converted?</summary>
<p>ENUM types are automatically converted to VARCHAR + CHECK constraints, preserving the original value restrictions. For example, <code>ENUM('a','b','c')</code> becomes <code>VARCHAR(20) CHECK (col IN ('a','b','c'))</code>.</p>
</details>

<details>
<summary>What's the difference between JSON and JSONB? Which to choose?</summary>
<p>MySQL JSON is mapped to PostgreSQL JSONB (binary JSON) by default, as JSONB supports indexing and richer query operations. If you need to preserve the original JSON format, you can configure the mapping to use the JSON type instead.</p>
</details>

<details>
<summary>Which special data types are supported?</summary>
<p>Full MySQL type coverage: <code>BLOB → BYTEA</code>, <code>GEOMETRY → GEOMETRY</code> (PostGIS), <code>DATETIME → TIMESTAMP</code>, <code>TINYINT(1) → BOOLEAN</code>, UNSIGNED types auto-upgrade bit width, <code>SET → TEXT[]</code>, and more — 100% mapping accuracy.</p>
</details>`
      },
      {
        id: 'faq-performance',
        title: 'Performance',
        body: `<details>
<summary>How to handle large tables (100M+ rows)?</summary>
<p>MySQL2PG includes a built-in concurrent engine supporting multi-table parallel sync and single-table sharded sync. For tables with 100M+ rows, enable 5-20 concurrent threads, sync data first then create indexes to boost write performance. See <a href="#bp-largetable">Large Table Optimization</a>.</p>
</details>

<details>
<summary>How long does it take to migrate 100 tables?</summary>
<p>Depends on data volume and network bandwidth. Typical scenario: 100 tables with tens of millions of rows completes full migration (schema + data + indexes) in approximately 5-15 minutes on a LAN.</p>
</details>

<details>
<summary>Does it support incremental migration?</summary>
<p>The current version focuses on full migration scenarios. For incremental sync, we recommend completing a full migration with MySQL2PG first, then using PostgreSQL Logical Replication or third-party CDC tools for ongoing sync.</p>
</details>`
      },
      {
        id: 'faq-security',
        title: 'Security & Ops',
        body: `<details>
<summary>Can the source database continue writing during migration?</summary>
<p>Yes. MySQL2PG uses a consistent snapshot during the read phase, which does not affect normal reads and writes on the source. However, we recommend running migrations during off-peak hours for accurate data validation.</p>
</details>

<details>
<summary>How to rollback if migration fails?</summary>
<p>MySQL2PG uses a "convert first, write later" strategy that does not affect the source database. You can run assess mode before writing to evaluate risks, and each conversion step can be independently toggled for step-by-step execution and rollback.</p>
</details>

<details>
<summary>What does the migration report include?</summary>
<p>The HTML migration report includes: migration overview (table count, data volume, duration), per-table conversion status, index change inventory, function mapping details, data validation results, risk alerts, and recommendations. See <a href="#report">Generate Migration Report</a>.</p>
</details>`
      },
      {
        id: 'faq-advanced',
        title: 'Advanced',
        body: `<details>
<summary>Does it support distributed databases like Greenplum / YugabyteDB?</summary>
<p>Yes. MySQL2PG auto-detects MPP distributed databases (Greenplum / YugabyteDB) and automatically adds <code>DISTRIBUTED BY</code> distribution keys while automatically handling redundant unique indexes. See <a href="#cfg-mpp">MPP Distributed Config</a>.</p>
</details>

<details>
<summary>How can I get technical support?</summary>
<p>Open-source users can get community support via <a href="https://github.com/xfg0218/MySQL2PG/issues" target="_blank" rel="noopener">GitHub Issues</a>, typically responded to within 24 hours. Commercial users enjoy priority support channels via email or WeChat community for direct access to the engineering team.</p>
</details>`
      }
    ]
  },
  {
    id: 'appendix',
    title: 'Appendix',
    sections: [
      {
        id: 'competitors',
        title: 'Competitor Comparison',
        body: `<table>
<thead><tr><th>Feature</th><th>MySQL2PG</th><th>pgloader</th><th>AWS DMS</th><th>EDB MTK</th></tr></thead>
<tbody>
<tr><td>DDL schema auto-conversion</td><td>✓</td><td>✓</td><td>~</td><td>✓</td></tr>
<tr><td>Index auto-conversion</td><td>✓</td><td>✓</td><td>~</td><td>✓</td></tr>
<tr><td>View auto-conversion</td><td>✓</td><td>~</td><td>~</td><td>—</td></tr>
<tr><td>Function/stored proc conversion</td><td>✓</td><td>—</td><td>~</td><td>—</td></tr>
<tr><td>User &amp; privilege migration</td><td>✓</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>Data consistency validation</td><td>✓</td><td>—</td><td>✓</td><td>—</td></tr>
<tr><td>HTML migration report</td><td>✓</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>Pre-migration risk assessment</td><td>✓</td><td>—</td><td>✓</td><td>—</td></tr>
<tr><td>MPP distributed support</td><td>✓</td><td>~</td><td>✓</td><td>—</td></tr>
</tbody>
</table>
<blockquote><p>✓ Full support · ~ Partial support (manual work needed) · — Not supported</p></blockquote>`
      },
      {
        id: 'editions',
        title: 'Open Source vs Commercial',
        body: `<table>
<thead><tr><th>Feature</th><th>Open Source</th><th>Commercial</th></tr></thead>
<tbody>
<tr><td>DDL conversion (schema/indexes)</td><td>✓</td><td>✓</td></tr>
<tr><td>Full data migration</td><td>✓</td><td>✓</td></tr>
<tr><td>Data type auto-mapping</td><td>✓</td><td>✓</td></tr>
<tr><td>User &amp; privilege migration</td><td>✓</td><td>✓</td></tr>
<tr><td>Local execution / zero source mod</td><td>✓</td><td>✓</td></tr>
<tr><td>Transport encryption / credential security</td><td>✓</td><td>✓</td></tr>
<tr><td>View conversion</td><td>—</td><td>✓</td></tr>
<tr><td>Function conversion</td><td>—</td><td>✓</td></tr>
<tr><td>MPP database support</td><td>—</td><td>✓</td></tr>
<tr><td>Data validation</td><td>—</td><td>✓</td></tr>
<tr><td>Pre-migration risk assessment</td><td>—</td><td>✓</td></tr>
<tr><td>Technical support</td><td>Community</td><td>Priority support</td></tr>
</tbody>
</table>
<p>The open source edition is licensed under Apache-2.0 and free for commercial use.</p>`
      }
    ]
  }
]

const manuals = { zh, en }

export function useManual() {
  const { lang } = useLang()
  const categories = computed(() => manuals[lang.value] || manuals.zh)
  const sections = computed(() => categories.value.flatMap(c => c.sections))
  return { categories, sections }
}
