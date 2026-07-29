import { ref, computed } from 'vue'

const lang = ref(localStorage.getItem('mysql2pg-lang') || 'zh')

function setLang(l) {
  lang.value = l
  localStorage.setItem('mysql2pg-lang', l)
}

function toggleLang() {
  setLang(lang.value === 'zh' ? 'en' : 'zh')
}

const zh = {
  // Nav
  nav: { pain: '痛点', features: '功能', architecture: '架构', faq: 'FAQ', metrics: '性能', flow: '流程', quickstart: '快速开始', quickStartBtn: '快速开始' },

  // Hero
  hero: {
    badge: 'v3.4.0 · 开源协议 · Go 1.24+',
    titleLine2: '一站式异构数据库迁移',
    desc: 'DDL、索引、视图、函数、用户、权限、数据校验，一次转换全部搞定。告别传统 DTS 工具的功能短板，大幅提高迁移效率，节省迁移人力成本。',
    quickStart: '快速开始 →',
    github: 'View on GitHub',
    stats: [
      { value: '类型', label: '100% 全类型映射' },
      { value: '索引', label: '100% 全索引映射' },
      { value: '用户', label: '100% 用户自动映射' },
      { value: '权限', label: '100% 权限自动映射' },
    ]
  },

  // Pain Points
  pain: {
    tag: '行业痛点',
    title: '传统工具的困境',
    desc: '常见的工具功能单一，难以覆盖异构数据库全链路迁移需求。大量适配、校验、结构兼容工作仍依赖人工介入处理，耗时耗力、项目实施周期长。',
    items: [
      { icon: '📋', title: 'DDL 无法全部自动转换', desc: '结构需手动逐结构需手动逐字段再次改写，改写工作量巨大。' },
      { icon: '🔑', title: 'Index 无法自动转换', desc: '主键、唯一索引、普通索引、全文索引无法转换，需要手动在 PG 侧重建，耗时耗力。' },
      { icon: '👁', title: 'View 无法转换', desc: '视图定义涉及语法差异和函数替换，手动改写复杂度高。' },
      { icon: '⚙️', title: 'Function 无法转换', desc: '跨库存储过程与内置函数语法存在天然鸿沟，依靠人工改写难度高、极易出现逻辑缺陷。' },
      { icon: '👤', title: 'User 信息无法转换', desc: 'MySQL 用户体系与 PG Role 体系不同，需手动逐一创建和配置。' },
      { icon: '🔒', title: 'Permission 信息无法转换', desc: '表级别 GRANT 权限需手动重新配置，权限遗漏影响业务访问。' },
      { icon: '✅', title: '数据一致性无法校验', desc: '同步后缺少自动化校验手段，数据是否完整只能靠人工比对，存在错误风险。' },
      { icon: '⏱', title: '人力成本高昂', desc: '上述所有问题叠加，人力投入大、错误率高，导致迁移周期长。' },
    ]
  },

  // Competitors
  competitors: {
    tag: '🏆 竞品对比',
    title: 'MySQL2PG vs 主流迁移工具',
    desc: '对比业界主流数据库迁移方案，MySQL2PG 在功能覆盖度和迁移效率上全面领先。',
    colFeature: '功能特性',
    tools: [
      { name: 'MySQL2PG', icon: '✅' },
      { name: 'pgloader', icon: '📦' },
      { name: 'AWS DMS', icon: '☁️' },
      { name: 'Azure DMS', icon: '🔷' },
    ],
    rows: [
      { feature: 'DDL 表结构自动转换', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '索引自动转换', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '视图自动转换', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '函数/存储过程转换', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '用户与权限迁移', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '数据一致性校验', m2pg: true, pgloader: false, aws: true, azure: true },
      { feature: 'HTML 迁移报告', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: '迁移前风险评估', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'MPP 分布式支持', m2pg: true, pgloader: false, aws: false, azure: false },
    ]
  },

  // Features
  features: {
    tag: '🚀 核心功能',
    title: 'MySQL2PG 全链路迁移能力',
    desc: '从表结构到数据、从视图到权限，覆盖迁移的每一个环节。',
    items: [
      { icon: '📐', title: '表结构转换', desc: '覆盖 MySQL 全字段类型智能映射到 PostgreSQL，包括 JSON/GEOMETRY/SERIAL/ENUM/BLOB 等特殊类型。', metric: '自动转换 · 准确率 100%' },
      { icon: '📦', title: '高性能数据同步', desc: '并发引擎 + 批量插入，高效承载亿级数据迁移，充分发挥批量数据插入的效率，提升传输效率。', metric: '批量写入 · 速度 10,000+ 行/秒' },
      { icon: '👁', title: '视图转换', desc: '自动处理反引号、LIMIT 语法、IFNULL/GROUP_CONCAT 等函数替换，批量转换。', metric: '自动转换 · 准确率 90%' },
      { icon: '🔑', title: '索引转换', desc: '主键、唯一索引、普通索引、全文索引自动重建，支持 MPP 分布键。', metric: '自动转换 · 准确率 100%' },
      { icon: '⚙️', title: '函数/存储过程转换', desc: 'JSON、正则、日期时间、聚合、加密等语法自动映射。', metric: '自动转换 · 准确率 90%+' },
      { icon: '🔐', title: '用户与权限迁移', desc: 'MySQL 用户自动转换为 PG Role，保留密码哈希，表级 GRANT 权限完整映射。', metric: '自动映射 · 准确率 100%' },
      { icon: '✅', title: '数据一致性校验', desc: '同步后自动比对行数，生成不一致表清单，支持全量校验和增量校验。', metric: '自动校验 · 全维度校验' },
      { icon: '🌐', title: 'MPP 分布式支持', desc: '自动检测 Greenplum / YugabyteDB ，添加 DISTRIBUTED BY 分布键，跳过冗余唯一索引。', metric: 'Greenplum / YugabyteDB 的语法' },
    ]
  },

  // Architecture
  architecture: {
    tag: '🏗 工作原理',
    title: '智能转换引擎架构',
    desc: 'MySQL2PG 采用流水线架构，每个阶段独立处理、可配置开关，确保转换过程透明可控。',
    stages: [
      { icon: '🐬', title: 'MySQL 源库', desc: '读取表结构、索引、视图、函数、用户、表权限等元数据' },
      { icon: '🔍', title: 'SQL 解析器', desc: '解析 MySQL DDL 语法，提取类型定义和依赖关系' },
      { icon: '🔄', title: '类型映射引擎', desc: '支持 MySQL 类型的全部类型智能映射' },
      { icon: '✅', title: '兼容性校验', desc: '检测不兼容语法，生成风险评估和修改建议' },
      { icon: '⚡', title: 'PG 生成器', desc: '生成 PostgreSQL 兼容 DDL，自动写入目标数据库' },
    ]
  },

  // SQL Demo
  sqlDemo: {
    tag: '💻 转换示例',
    title: 'SQL 转换前后对比',
    desc: '真实展示 MySQL 到 PostgreSQL 的智能转换效果，所见即所得。',
    examples: [
      {
        title: '表结构转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE TABLE</span> users (
  id <span class="val">INT AUTO_INCREMENT</span> PRIMARY KEY,
  name <span class="val">VARCHAR(100)</span> NOT NULL,
  email <span class="val">VARCHAR(255)</span> UNIQUE,
  profile <span class="val">JSON</span>,
  location <span class="val">GEOMETRY</span>,
  created <span class="val">DATETIME</span> DEFAULT <span class="val">NOW()</span>,
  status <span class="val">ENUM('active','disabled')</span>
) <span class="val">ENGINE=InnoDB</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE TABLE</span> users (
  id <span class="val">SERIAL</span> PRIMARY KEY,
  name <span class="val">VARCHAR(100)</span> NOT NULL,
  email <span class="val">VARCHAR(255)</span> UNIQUE,
  profile <span class="val">JSONB</span>,
  location <span class="val">GEOMETRY</span>,
  created <span class="val">TIMESTAMP</span> DEFAULT <span class="val">NOW()</span>,
  status <span class="val">VARCHAR(20)</span> CHECK (status IN ('active','disabled'))
);`
      },
      {
        title: '索引转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE INDEX</span> idx_email
  <span class="key">ON</span> users (email);

<span class="key">CREATE FULLTEXT INDEX</span> idx_name
  <span class="key">ON</span> users (name);`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE INDEX</span> idx_email
  <span class="key">ON</span> users (email);

<span class="key">CREATE INDEX</span> idx_name
  <span class="key">ON</span> users
  <span class="key">USING GIN</span> (to_tsvector('simple', name));`
      },
      {
        title: '函数转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">SELECT</span>
  <span class="val">IFNULL</span>(name, 'N/A'),
  <span class="val">DATE_FORMAT</span>(created, '%Y-%m'),
  <span class="val">GROUP_CONCAT</span>(email SEPARATOR ',')
<span class="key">FROM</span> users
<span class="key">WHERE</span> name <span class="key">REGEXP</span> <span class="val">'^admin'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">SELECT</span>
  <span class="val">COALESCE</span>(name, 'N/A'),
  <span class="val">TO_CHAR</span>(created, 'YYYY-MM'),
  <span class="val">STRING_AGG</span>(email, ',')
<span class="key">FROM</span> users
<span class="key">WHERE</span> name <span class="key">~</span> <span class="val">'^admin'</span>;`
      },
      {
        title: '视图转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE VIEW</span> v_active_users <span class="key">AS</span>
<span class="key">SELECT</span> <span class="val">\`id\`</span>, <span class="val">\`name\`</span>,
  <span class="val">IFNULL</span>(<span class="val">\`email\`</span>, 'N/A') <span class="key">AS</span> email,
  <span class="val">DATE_FORMAT</span>(<span class="val">\`created\`</span>, '%Y-%m') <span class="key">AS</span> month
<span class="key">FROM</span> <span class="val">\`users\`</span>
<span class="key">WHERE</span> <span class="val">\`status\`</span> = 'active'
<span class="key">LIMIT</span> <span class="val">100</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE VIEW</span> v_active_users <span class="key">AS</span>
<span class="key">SELECT</span> id, name,
  <span class="val">COALESCE</span>(email, 'N/A') <span class="key">AS</span> email,
  <span class="val">TO_CHAR</span>(created, 'YYYY-MM') <span class="key">AS</span> month
<span class="key">FROM</span> users
<span class="key">WHERE</span> status = 'active'
<span class="key">ORDER BY</span> id
<span class="key">FETCH FIRST</span> <span class="val">100</span> <span class="key">ROWS ONLY</span>;`
      },
      {
        title: '用户转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE USER</span> <span class="val">'app_user'@'%'</span>
  <span class="key">IDENTIFIED BY</span> <span class="val">'SecurePass123'</span>;

<span class="key">CREATE USER</span> <span class="val">'readonly'@'10.0.0.%'</span>
  <span class="key">IDENTIFIED BY</span> <span class="val">'ReadPass456'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE ROLE</span> app_user
  <span class="key">WITH LOGIN PASSWORD</span> <span class="val">'SecurePass123'</span>;

<span class="key">CREATE ROLE</span> readonly
  <span class="key">WITH LOGIN PASSWORD</span> <span class="val">'ReadPass456'</span>
  <span class="key">VALID UNTIL</span> <span class="val">'infinity'</span>;`
      },
      {
        title: '权限转换',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">GRANT</span> SELECT, INSERT, UPDATE
  <span class="key">ON</span> <span class="val">mydb</span>.users
  <span class="key">TO</span> <span class="val">'app_user'@'%'</span>;

<span class="key">GRANT</span> SELECT
  <span class="key">ON</span> <span class="val">mydb</span>.v_active_users
  <span class="key">TO</span> <span class="val">'readonly'@'10.0.0.%'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">GRANT</span> SELECT, INSERT, UPDATE
  <span class="key">ON TABLE</span> users
  <span class="key">TO</span> app_user;

<span class="key">GRANT</span> SELECT
  <span class="key">ON TABLE</span> v_active_users
  <span class="key">TO</span> readonly;`
      }
    ]
  },

  // Report Preview
  report: {
    tag: '📄 迁移报告',
    title: 'HTML 可视化迁移报告',
    desc: '迁移完成后自动生成 HTML 报告，一目了然掌握迁移结果和潜在问题。',
    sections: [
      { icon: '📊', title: '迁移总览', desc: '表数量、数据量、耗时、成功率等关键指标汇总' },
      { icon: '⚠️', title: '风险告警', desc: '不兼容语法、潜在数据丢失风险、需人工确认的项目' },
      { icon: '📋', title: '详细清单', desc: '每张表的转换状态、索引变更、函数映射的逐条记录' },
      { icon: '✅', title: '校验结果', desc: '数据一致性校验结果，不一致表的行数和差异详情' },
    ],
    mockStats: [
      { label: '转换表数', value: '128' },
      { label: '成功率', value: '99.2%' },
      { label: '风险项', value: '3' },
      { label: '迁移耗时', value: '2h 15m' },
    ],
    mockRisks: [
      { level: 'warn', text: '表 orders 含 GEOMETRY 列，已转换为 PostGIS 类型，需确认 PostGIS 扩展已安装' },
      { level: 'warn', text: '函数 fn_calc_total 含自定义逻辑，已转换核心语法，建议人工复核' },
      { level: 'info', text: '表 logs 数据量 500 万行，建议启用并发同步以提升性能' },
    ]
  },

  // Assessment
  assessment: {
    tag: '🔬 迁移评估',
    title: '迁移前风险评估',
    desc: '在正式迁移前运行 assess 模式，全面了解兼容性状况和潜在风险，做到心中有数。',
    categories: [
      {
        icon: '📐', title: '表结构兼容性', color: 'green',
        score: '100 %',
        items: ['MySQL 全部类型自动映射', '特殊类型（JSON/GEOMETRY）自动转换', '特殊语法给出建议']
      },
      {
        icon: '⚙️', title: '函数复杂度', color: 'amber',
        score: '90%+',
        items: ['常用函数自动转换', '自定义函数标注', '版本差异提示']
      },
      {
        icon: '📦', title: '数据量评估', color: 'green',
        score: '智能策略',
        items: ['大表自动识别', '并发策略推荐', '预计耗时估算']
      },
      {
        icon: '🔒', title: '权限迁移风险', color: 'amber',
        score: '100%',
        items: ['用户映射检查', '权限差异分析', 'Role 冲突检测']
      },
    ]
  },

  // Security
  security: {
    tag: '🔐 安全与数据保障',
    title: '数据安全，始终第一',
    desc: 'MySQL2PG 从架构设计到运行执行，全方位保障你的数据库安全。不收集、不上传、不存储任何数据。',
    items: [
      { icon: '🔑', title: '凭证安全', desc: '配置文件本地存储，支持环境变量注入密码，凭证不上传任何外部服务。' },
      { icon: '🔒', title: '传输加密', desc: '支持 SSL/TLS 加密连接 MySQL 和 PostgreSQL，数据传输全程加密保护。' },
      { icon: '🛡', title: '源库零修改', desc: '评估模式只读不写。正式迁移采用"先转换后写入"策略，源库不受任何影响。' },
    ],
    summary: ''
  },

  // Metrics
  metrics: {
    tag: '📈 性能指标',
    title: '用数据说话',
    items: [
      { target: 10000, suffix: '+', label: '行/秒 同步速度', decimal: 0 },
      { target: 100, suffix: '%', label: '类型映射准确率', decimal: 1 },
      { target: 10, suffix: '+', label: '客户全自动转换率 100%', decimal: 0 },
      { target: 5, suffix: '-20x', label: '并发加速倍数', decimal: 0 },
    ]
  },

  // Flow Steps
  flow: {
    tag: '🔄 转换流程',
    title: '8 步完成全量迁移',
    desc: '从连接数据库到数据校验，MySQL2PG 全自动流水线，每一步都可独立控制开关。',
    steps: [
      { num: '01', title: '读取表定义', desc: '自动扫描 MySQL 数据库中的所有表和结构，支持灵活过滤，精准选择迁移范围。', tags: ['白名单筛选', '黑名单排除', '自动发现'] },
      { num: '02', title: '转换表结构', desc: '智能识别 MySQL 全部的字段类型并映射为 PostgreSQL 兼容类型，一键在目标表上创建。', tags: ['全部类型自动映射', '准确率 100%', ' 支持 MPP 分布键'] },
      { num: '03', title: '转换视图', desc: '自动将 MySQL 视图定义转换为 PostgreSQL 兼容语法，无需手动改写 SQL。', tags: ['函数语法自动转换', '90% 可转换率', '特殊语法进行给出建议'] },
      { num: '04', title: '同步数据', desc: '高性能并发引擎批量搬运数据，自动优化写入性能，支持百万级数据迁移。', tags: ['10,000+ 行/秒', '并发加速', '灵活同步策略'] },
      { num: '05', title: '转换索引', desc: '自动重建主键、唯一索引、普通索引和全文索引，完整保留查询性能。', tags: ['主键/唯一/普通/全文', '成功率 100%', 'MPP 模式适配'] },
      { num: '06', title: '转换函数', desc: 'MySQL 内置函数自动映射为 PostgreSQL 等效函数，覆盖 JSON、正则、日期等场景。', tags: ['内置函数自动转换', '100% 准确率', '特殊语法进行给出建议'] },
      { num: '07', title: '转换用户', desc: 'MySQL 用户自动转换为 PostgreSQL 的用户，密码和身份信息安全保留。', tags: ['密码保持一致', '无损转换', '批量创建'] },
      { num: '08', title: '转换权限 + 数据校验', desc: '自动迁移表级权限，并在同步后校验数据一致性，生成完整迁移报告。', tags: ['表级 GRANT', '智能校验', '不一致表清单'] },
    ],
    summary: [
      { num: '8', label: '全自动化步骤' },
      { num: '0', label: '人工干预' },
      { num: '100%', label: '可配置开关' },
    ]
  },

  // Versions
  versions: {
    tag: '🏷 版本兼容',
    title: '广泛的数据库版本支持',
    mysql: '🐬 MySQL（源库）',
    pg: '🐘 PostgreSQL（目标库）',
    mysqlVersions: ['5.7+', '8.0', '8.4', '9.0+'],
    pgVersions: ['12', '13', '14', '15', '16', '17', '18'],
  },

  // Quick Start
  quickstart: {
    tag: '⚡ 快速开始',
    title: '3 步启动迁移',
    steps: [
      {
        num: 1,
        title: '创建配置文件',
        code: `<span class="cmt"># config.yml</span>
<span class="key">mysql</span>:
  host: localhost
  port: 3306
  username: root
  password: password
  database: mydb

<span class="key">postgresql</span>:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: mydb

<span class="key">conversion</span>:
  <span class="key">options</span>:
    tableddl: <span class="val">true</span>
    data: <span class="val">true</span>
    view: <span class="val">true</span>
    indexes: <span class="val">true</span>
    functions: <span class="val">true</span>
    users: <span class="val">true</span>
    table_privileges: <span class="val">true</span>
    validate_data: <span class="val">true</span>`
      },
      {
        num: 2,
        title: '运行转换',
        code: `<span class="cmt"># 构建</span>
git clone https://github.com/xfg0218/MySQL2PG.git
cd MySQL2PG
make build

<span class="cmt"># 运行迁移</span>
./mysql2pg -c config.yml

<span class="cmt"># 迁移前评估（可选）</span>
./mysql2pg assess config.yml`
      },
      {
        num: 3,
        title: '查看报告',
        code: `<span class="cmt"># 生成 HTML 迁移报告</span>
./mysql2pg report -l conversion.log

<span class="cmt"># 包含错误日志</span>
./mysql2pg report \\
  -l conversion.log \\
  -e errors.log

<span class="cmt"># 自定义输出路径</span>
./mysql2pg report \\
  -l conversion.log \\
  -o my-report.html`
      }
    ]
  },

  // FAQ
  faq: {
    tag: '❓ 常见问题',
    title: 'FAQ',
    desc: '关于 MySQL2PG 迁移工具的常见问题解答。',
    items: [
      { q: '支持哪些 MySQL 存储引擎？', a: 'MySQL2PG 支持所有主流存储引擎，包括 InnoDB、MyISAM、MEMORY 等。InnoDB 表会自动处理外键约束的迁移。' },
      { q: '支持增量迁移吗？', a: '当前版本主要面向全量迁移场景。对于增量同步需求，建议先使用 MySQL2PG 完成全量迁移，再配合 PostgreSQL 的 Logical Replication 或第三方 CDC 工具实现增量同步。' },
      { q: '迁移失败如何回滚？', a: 'MySQL2PG 采用"先转换后写入"策略，转换过程不影响源库。目标库写入前可先运行评估模式评估风险，且每个转换步骤可独立开关，支持分步执行和回退。' },
      { q: '大表（亿级以上）如何处理？', a: 'MySQL2PG 内置并发引擎，支持多表并行同步和单表分片同步。亿级数据表建议启用 5-20 个并发线程，先同步数据再创还能索引的方式进行提升数据写入性能。' },
      { q: 'MySQL 的 ENUM 类型如何转换？', a: 'ENUM 类型会自动转换为 VARCHAR + CHECK 约束，保留原有的值域限制。例如 ENUM(\'a\',\'b\',\'c\') 会转换为 VARCHAR(20) CHECK (col IN (\'a\',\'b\',\'c\'))。' },
      { q: 'JSON 和 JSONB 有什么区别？如何选择？', a: 'MySQL 的 JSON 类型默认映射为 PostgreSQL 的 JSONB（二进制 JSON），因为 JSONB 支持索引和更丰富的查询操作。如需保留原始 JSON 格式，可在配置中指定映射为 JSON 类型。' },
      { q: '数据迁移过程中源库可以继续写入吗？', a: '可以。MySQL2PG 在读取阶段使用一致性快照，不会影响源库的正常读写。但建议在业务低峰期执行迁移，以确保数据一致性校验的准确性。' },
      { q: '迁移报告包含哪些内容？', a: 'HTML 迁移报告包含：迁移总览（表数量、数据量、耗时）、每张表的转换状态、索引变更清单、函数映射详情、数据校验结果、风险告警和建议。' },
      { q: '是否支持 Greenplum / YugabyteDB 等分布式数据库？', a: '支持。MySQL2PG 自动检测目标库是否为 MPP 分布式数据库（Greenplum / YugabyteDB），并自动添加 DISTRIBUTED BY 分布键，对冗余唯一索引进行自动处理。' },
    ]
  },

  // Footer
  footer: {
    text: 'MySQL2PG · Apache-2.0 License · Built with Go 1.24+',
    copyright: '© 2026 MySQL2PG Contributors',
  }
}

const en = {
  // Nav
  nav: { pain: 'Pain Points', features: 'Features', architecture: 'Architecture', faq: 'FAQ', metrics: 'Metrics', flow: 'Workflow', quickstart: 'Quick Start', quickStartBtn: 'Quick Start' },

  // Hero
  hero: {
    badge: 'v3.4.0 · Open Source · Go 1.24+',
    titleLine2: 'One-Stop Heterogeneous DB Migration',
    desc: 'More than data sync — DDL, indexes, views, functions, users, privileges, and data validation, all handled in one pass. Say goodbye to the limitations of traditional DTS tools.',
    quickStart: 'Quick Start →',
    github: 'View on GitHub',
    stats: [
      { value: 'Types', label: '100% Full Type Mapping' },
      { value: 'Indexes', label: '100% Full Index Mapping' },
      { value: 'Users', label: '100% Auto User Mapping' },
      { value: 'Privileges', label: '100% Auto Privilege Mapping' },
    ]
  },

  // Pain Points
  pain: {
    tag: '⚠ Industry Pain Points',
    title: 'The Dilemma of Traditional Tools',
    desc: 'Common tools have limited capabilities and cannot cover the full-pipeline migration needs of heterogeneous databases. A large amount of adaptation, validation, and structural compatibility work still relies on manual intervention — time-consuming, labor-intensive, and with long project cycles.',
    items: [
      { icon: '📋', title: 'No Full Auto DDL Conversion', desc: 'Structures must be manually rewritten field by field, resulting in a massive workload.' },
      { icon: '🔑', title: 'No Auto Index Conversion', desc: 'Primary keys, unique indexes, regular indexes, and full-text indexes cannot be converted and must be manually rebuilt in PostgreSQL.' },
      { icon: '👁', title: 'No View Conversion', desc: 'View definitions involve syntax differences and function replacements. Manual rewriting is highly complex.' },
      { icon: '⚙️', title: 'No Function Conversion', desc: 'Cross-database stored procedures and built-in function syntax have inherent gaps. Manual rewriting is difficult and prone to logic defects.' },
      { icon: '👤', title: 'No User Migration', desc: 'MySQL user system differs from PostgreSQL Roles. Each user must be manually created and configured.' },
      { icon: '🔒', title: 'No Privilege Migration', desc: 'Table-level GRANT privileges must be manually reconfigured. Missing privileges affect business access.' },
      { icon: '✅', title: 'No Data Validation', desc: 'After sync, there is no automated validation. Data completeness can only be verified through manual comparison, risking errors.' },
      { icon: '⏱', title: 'High Labor Costs', desc: 'All these issues combined lead to heavy manpower investment, high error rates, and long migration cycles.' },
    ]
  },

  // Competitors
  competitors: {
    tag: '🏆 Competitive Landscape',
    title: 'MySQL2PG vs Leading Migration Tools',
    desc: 'Side-by-side comparison with mainstream database migration solutions. MySQL2PG leads in feature coverage and migration efficiency.',
    colFeature: 'Feature',
    tools: [
      { name: 'MySQL2PG', icon: '✅' },
      { name: 'pgloader', icon: '📦' },
      { name: 'AWS DMS', icon: '☁️' },
      { name: 'Azure DMS', icon: '🔷' },
    ],
    rows: [
      { feature: 'DDL Table Auto Conversion', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'Index Auto Conversion', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'View Auto Conversion', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'Function/Procedure Conversion', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'User & Privilege Migration', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'Data Consistency Validation', m2pg: true, pgloader: false, aws: true, azure: true },
      { feature: 'HTML Migration Report', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'Pre-migration Risk Assessment', m2pg: true, pgloader: false, aws: false, azure: false },
      { feature: 'MPP Distributed DB Support', m2pg: true, pgloader: false, aws: false, azure: false },
    ]
  },

  // Features
  features: {
    tag: '🚀 Core Features',
    title: 'Full-Pipeline Migration Capabilities',
    desc: 'From table structures to data, from views to privileges — MySQL2PG covers every aspect of migration.',
    items: [
      { icon: '📐', title: 'Table Structure Conversion', desc: 'Covers intelligent mapping of all MySQL field types to PostgreSQL, including special types like JSON/GEOMETRY/SERIAL/ENUM/BLOB.', metric: 'Auto Conversion · 100% Accuracy' },
      { icon: '📦', title: 'High-Performance Data Sync', desc: 'Concurrent engine + batch insert, efficiently handles billion-level data migration, fully leveraging batch insert efficiency to boost transfer speed.', metric: 'Batch Write · 10,000+ Rows/sec' },
      { icon: '👁', title: 'View Conversion', desc: 'Auto-handles backticks, LIMIT syntax, IFNULL/GROUP_CONCAT and other function replacements with batch conversion.', metric: 'Auto Conversion · 90% Accuracy' },
      { icon: '🔑', title: 'Index Conversion', desc: 'Auto-rebuild of primary keys, unique indexes, regular indexes, and full-text indexes with MPP distribution key support.', metric: 'Auto Conversion · 100% Accuracy' },
      { icon: '⚙️', title: 'Function/Procedure Conversion', desc: 'Auto-mapping of JSON, regex, datetime, aggregation, encryption and other syntax.', metric: 'Auto Conversion · 90%+ Accuracy' },
      { icon: '🔐', title: 'User & Privilege Migration', desc: 'MySQL users auto-converted to PG Roles, preserving password hashes with complete table-level GRANT mapping.', metric: 'Auto Mapping · 100% Accuracy' },
      { icon: '✅', title: 'Data Consistency Validation', desc: 'Post-sync auto row-count comparison, generates inconsistency reports, supports full and incremental validation.', metric: 'Auto Validation · Full-Dimensional' },
      { icon: '🌐', title: 'MPP Distributed Support', desc: 'Auto-detects Greenplum / YugabyteDB, adds DISTRIBUTED BY distribution keys, skips redundant unique indexes.', metric: 'Greenplum / YugabyteDB Syntax' },
    ]
  },

  // Architecture
  architecture: {
    tag: '🏗 How It Works',
    title: 'Conversion Engine Architecture',
    desc: 'MySQL2PG uses a pipeline architecture where each stage is independently processed and configurable, ensuring transparent and controllable conversion.',
    stages: [
      { icon: '🐬', title: 'MySQL Source', desc: 'Reads table structures, indexes, views, functions, users, table privileges and other metadata' },
      { icon: '🔍', title: 'SQL Parser', desc: 'Parses MySQL DDL syntax, extracts type definitions and dependency relationships' },
      { icon: '🔄', title: 'Type Mapping Engine', desc: 'Supports intelligent mapping of all MySQL types' },
      { icon: '✅', title: 'Compatibility Validator', desc: 'Detects incompatible syntax, generates risk assessments and fix suggestions' },
      { icon: '⚡', title: 'PG Generator', desc: 'Generates PostgreSQL-compatible DDL and writes to target database' },
    ]
  },

  // SQL Demo
  sqlDemo: {
    tag: '💻 Conversion Examples',
    title: 'Before & After SQL Conversion',
    desc: 'See real MySQL to PostgreSQL DDL conversion results. What you see is what you get.',
    examples: [
      {
        title: 'Table Structure Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE TABLE</span> users (
  id <span class="val">INT AUTO_INCREMENT</span> PRIMARY KEY,
  name <span class="val">VARCHAR(100)</span> NOT NULL,
  email <span class="val">VARCHAR(255)</span> UNIQUE,
  profile <span class="val">JSON</span>,
  location <span class="val">GEOMETRY</span>,
  created <span class="val">DATETIME</span> DEFAULT <span class="val">NOW()</span>,
  status <span class="val">ENUM('active','disabled')</span>
) <span class="val">ENGINE=InnoDB</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE TABLE</span> users (
  id <span class="val">SERIAL</span> PRIMARY KEY,
  name <span class="val">VARCHAR(100)</span> NOT NULL,
  email <span class="val">VARCHAR(255)</span> UNIQUE,
  profile <span class="val">JSONB</span>,
  location <span class="val">GEOMETRY</span>,
  created <span class="val">TIMESTAMP</span> DEFAULT <span class="val">NOW()</span>,
  status <span class="val">VARCHAR(20)</span> CHECK (status IN ('active','disabled'))
);`
      },
      {
        title: 'Index Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE INDEX</span> idx_email
  <span class="key">ON</span> users (email);

<span class="key">CREATE FULLTEXT INDEX</span> idx_name
  <span class="key">ON</span> users (name);`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE INDEX</span> idx_email
  <span class="key">ON</span> users (email);

<span class="key">CREATE INDEX</span> idx_name
  <span class="key">ON</span> users
  <span class="key">USING GIN</span> (to_tsvector('simple', name));`
      },
      {
        title: 'Function Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">SELECT</span>
  <span class="val">IFNULL</span>(name, 'N/A'),
  <span class="val">DATE_FORMAT</span>(created, '%Y-%m'),
  <span class="val">GROUP_CONCAT</span>(email SEPARATOR ',')
<span class="key">FROM</span> users
<span class="key">WHERE</span> name <span class="key">REGEXP</span> <span class="val">'^admin'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">SELECT</span>
  <span class="val">COALESCE</span>(name, 'N/A'),
  <span class="val">TO_CHAR</span>(created, 'YYYY-MM'),
  <span class="val">STRING_AGG</span>(email, ',')
<span class="key">FROM</span> users
<span class="key">WHERE</span> name <span class="key">~</span> <span class="val">'^admin'</span>;`
      },
      {
        title: 'View Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE VIEW</span> v_active_users <span class="key">AS</span>
<span class="key">SELECT</span> <span class="val">\`id\`</span>, <span class="val">\`name\`</span>,
  <span class="val">IFNULL</span>(<span class="val">\`email\`</span>, 'N/A') <span class="key">AS</span> email,
  <span class="val">DATE_FORMAT</span>(<span class="val">\`created\`</span>, '%Y-%m') <span class="key">AS</span> month
<span class="key">FROM</span> <span class="val">\`users\`</span>
<span class="key">WHERE</span> <span class="val">\`status\`</span> = 'active'
<span class="key">LIMIT</span> <span class="val">100</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE VIEW</span> v_active_users <span class="key">AS</span>
<span class="key">SELECT</span> id, name,
  <span class="val">COALESCE</span>(email, 'N/A') <span class="key">AS</span> email,
  <span class="val">TO_CHAR</span>(created, 'YYYY-MM') <span class="key">AS</span> month
<span class="key">FROM</span> users
<span class="key">WHERE</span> status = 'active'
<span class="key">ORDER BY</span> id
<span class="key">FETCH FIRST</span> <span class="val">100</span> <span class="key">ROWS ONLY</span>;`
      },
      {
        title: 'User Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">CREATE USER</span> <span class="val">'app_user'@'%'</span>
  <span class="key">IDENTIFIED BY</span> <span class="val">'SecurePass123'</span>;

<span class="key">CREATE USER</span> <span class="val">'readonly'@'10.0.0.%'</span>
  <span class="key">IDENTIFIED BY</span> <span class="val">'ReadPass456'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">CREATE ROLE</span> app_user
  <span class="key">WITH LOGIN PASSWORD</span> <span class="val">'SecurePass123'</span>;

<span class="key">CREATE ROLE</span> readonly
  <span class="key">WITH LOGIN PASSWORD</span> <span class="val">'ReadPass456'</span>
  <span class="key">VALID UNTIL</span> <span class="val">'infinity'</span>;`
      },
      {
        title: 'Privilege Conversion',
        mysql: `<span class="cmt">-- MySQL</span>
<span class="key">GRANT</span> SELECT, INSERT, UPDATE
  <span class="key">ON</span> <span class="val">mydb</span>.users
  <span class="key">TO</span> <span class="val">'app_user'@'%'</span>;

<span class="key">GRANT</span> SELECT
  <span class="key">ON</span> <span class="val">mydb</span>.v_active_users
  <span class="key">TO</span> <span class="val">'readonly'@'10.0.0.%'</span>;`,
        pg: `<span class="cmt">-- PostgreSQL</span>
<span class="key">GRANT</span> SELECT, INSERT, UPDATE
  <span class="key">ON TABLE</span> users
  <span class="key">TO</span> app_user;

<span class="key">GRANT</span> SELECT
  <span class="key">ON TABLE</span> v_active_users
  <span class="key">TO</span> readonly;`
      }
    ]
  },

  // Report Preview
  report: {
    tag: '📄 Migration Report',
    title: 'HTML Visual Migration Report',
    desc: 'Automatically generates an HTML report after migration, giving you a clear overview of results and potential issues.',
    sections: [
      { icon: '📊', title: 'Migration Overview', desc: 'Summary of table counts, data volume, duration, and success rates' },
      { icon: '⚠️', title: 'Risk Alerts', desc: 'Incompatible syntax, potential data loss risks, items requiring manual review' },
      { icon: '📋', title: 'Detailed Inventory', desc: 'Per-table conversion status, index changes, and function mapping records' },
      { icon: '✅', title: 'Validation Results', desc: 'Data consistency validation results with row counts and discrepancy details' },
    ],
    mockStats: [
      { label: 'Tables Converted', value: '128' },
      { label: 'Success Rate', value: '99.2%' },
      { label: 'Risk Items', value: '3' },
      { label: 'Migration Duration', value: '2h 15m' },
    ],
    mockRisks: [
      { level: 'warn', text: 'Table orders contains GEOMETRY columns, converted to PostGIS types. Verify PostGIS extension is installed.' },
      { level: 'warn', text: 'Function fn_calc_total contains custom logic. Core syntax converted, manual review recommended.' },
      { level: 'info', text: 'Table logs has 5 million rows. Consider enabling concurrent sync for better performance.' },
    ]
  },

  // Assessment
  assessment: {
    tag: '🔬 Pre-Migration Assessment',
    title: 'Risk Assessment Before Migration',
    desc: 'Run the assess mode before actual migration to fully understand compatibility status and potential risks.',
    categories: [
      {
        icon: '📐', title: 'Schema Compatibility', color: 'green',
        score: '100%',
        items: ['All MySQL types auto-mapped', 'Special types (JSON/GEOMETRY) auto-converted', 'Suggestions for special syntax']
      },
      {
        icon: '⚙️', title: 'Function Complexity', color: 'amber',
        score: '90%+',
        items: ['Common functions auto-converted', 'Custom function annotations', 'Version difference warnings']
      },
      {
        icon: '📦', title: 'Data Volume Assessment', color: 'green',
        score: 'Smart Strategy',
        items: ['Auto large table detection', 'Concurrency strategy recommendations', 'Estimated duration calculation']
      },
      {
        icon: '🔒', title: 'Privilege Migration Risk', color: 'amber',
        score: '100%',
        items: ['User mapping verification', 'Privilege gap analysis', 'Role conflict detection']
      },
    ]
  },

  // Security
  security: {
    tag: '🔐 Security & Data Safety',
    title: 'Data Security Always Comes First',
    desc: 'MySQL2PG safeguards your database at every level — from architecture design to runtime execution. No data collection, no uploads, no storage.',
    items: [
      { icon: '🔑', title: 'Credential Safety', desc: 'Config files stored locally. Passwords support environment variable injection. Credentials never leave your server.' },
      { icon: '🔒', title: 'Encrypted Transport', desc: 'Supports SSL/TLS encrypted connections to MySQL and PostgreSQL. All data in transit is encrypted.' },
      { icon: '🛡', title: 'Zero Source DB Modification', desc: 'Assess mode is read-only. Migration uses a "convert first, write later" strategy — the source database is never modified.' },
    ],
    summary: ''
  },

  // Metrics
  metrics: {
    tag: '📈 Performance Metrics',
    title: 'Data-Driven Results',
    items: [
      { target: 10000, suffix: '+', label: 'Rows/sec Sync Speed', decimal: 0 },
      { target: 100, suffix: '%', label: 'Type Mapping Accuracy', decimal: 1 },
      { target: 10, suffix: '+', label: 'Customers with 100% Auto Conversion', decimal: 0 },
      { target: 5, suffix: '-20x', label: 'Concurrency Speedup', decimal: 0 },
    ]
  },

  // Flow Steps
  flow: {
    tag: '🔄 Workflow',
    title: 'Full Migration in 8 Steps',
    desc: 'From database connection to data validation — MySQL2PG is a fully automated pipeline with independent on/off control for each step.',
    steps: [
      { num: '01', title: 'Read Table Definitions', desc: 'Auto-scans all tables and structures in the MySQL database. Supports flexible filtering to precisely select migration scope.', tags: ['Whitelist Filter', 'Blacklist Exclude', 'Auto Discovery'] },
      { num: '02', title: 'Convert Table Structure', desc: 'Intelligently identifies all MySQL field types and maps them to PostgreSQL-compatible types. One-click target table creation.', tags: ['All MySQL Types Auto-Mapped', '100% Accuracy', 'MPP Distribution Key'] },
      { num: '03', title: 'Convert Views', desc: 'Automatically converts MySQL view definitions to PostgreSQL-compatible syntax. No manual SQL rewriting needed.', tags: ['Function Syntax Auto-Conversion', '90% Convertible', 'Suggestions for Special Syntax'] },
      { num: '04', title: 'Sync Data', desc: 'High-performance concurrent engine for batch data transfer with auto-optimized write performance. Supports million-level migration.', tags: ['10,000+ Rows/sec', 'Concurrent Speedup', 'Flexible Sync Strategy'] },
      { num: '05', title: 'Convert Indexes', desc: 'Auto-rebuilds primary keys, unique indexes, regular indexes, and full-text indexes, fully preserving query performance.', tags: ['PK/Unique/Regular/Fulltext', '100% Success', 'MPP Mode Compatible'] },
      { num: '06', title: 'Convert Functions', desc: 'MySQL built-in functions auto-mapped to PostgreSQL equivalents, covering JSON, regex, datetime, and more.', tags: ['MySQL Built-in Functions', '100% Accuracy', 'Suggestions for Special Syntax'] },
      { num: '07', title: 'Convert Users', desc: 'MySQL users auto-converted to PostgreSQL users. Passwords and identity information securely preserved.', tags: ['Password Consistent', 'Lossless Conversion', 'Batch Creation'] },
      { num: '08', title: 'Convert Privileges + Validate', desc: 'Auto-migrates table-level privileges and validates data consistency post-sync. Generates complete migration report.', tags: ['Table-level GRANT', 'Smart Validation', 'Inconsistency Report'] },
    ],
    summary: [
      { num: '8', label: 'Fully Automated Steps' },
      { num: '0', label: 'Manual Intervention' },
      { num: '100%', label: 'Configurable Switches' },
    ]
  },

  // Versions
  versions: {
    tag: '🏷 Version Compatibility',
    title: 'Broad Database Version Support',
    mysql: '🐬 MySQL (Source)',
    pg: '🐘 PostgreSQL (Target)',
    mysqlVersions: ['5.7+', '8.0', '8.4', '9.0+'],
    pgVersions: ['12', '13', '14', '15', '16', '17', '18'],
  },

  // Quick Start
  quickstart: {
    tag: '⚡ Quick Start',
    title: 'Start Migration in 3 Steps',
    steps: [
      {
        num: 1,
        title: 'Create Config File',
        code: `<span class="cmt"># config.yml</span>
<span class="key">mysql</span>:
  host: localhost
  port: 3306
  username: root
  password: password
  database: mydb

<span class="key">postgresql</span>:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: mydb

<span class="key">conversion</span>:
  <span class="key">options</span>:
    tableddl: <span class="val">true</span>
    data: <span class="val">true</span>
    view: <span class="val">true</span>
    indexes: <span class="val">true</span>
    functions: <span class="val">true</span>
    users: <span class="val">true</span>
    table_privileges: <span class="val">true</span>
    validate_data: <span class="val">true</span>`
      },
      {
        num: 2,
        title: 'Run Conversion',
        code: `<span class="cmt"># Build</span>
git clone https://github.com/xfg0218/MySQL2PG.git
cd MySQL2PG
make build

<span class="cmt"># Run migration</span>
./mysql2pg -c config.yml

<span class="cmt"># Pre-migration assessment (optional)</span>
./mysql2pg assess config.yml`
      },
      {
        num: 3,
        title: 'View Report',
        code: `<span class="cmt"># Generate HTML migration report</span>
./mysql2pg report -l conversion.log

<span class="cmt"># Include error logs</span>
./mysql2pg report \\
  -l conversion.log \\
  -e errors.log

<span class="cmt"># Custom output path</span>
./mysql2pg report \\
  -l conversion.log \\
  -o my-report.html`
      }
    ]
  },

  // FAQ
  faq: {
    tag: '❓ FAQ',
    title: 'Frequently Asked Questions',
    desc: 'Common questions about the MySQL2PG migration tool.',
    items: [
      { q: 'Which MySQL storage engines are supported?', a: 'MySQL2PG supports all major storage engines including InnoDB, MyISAM, and MEMORY. InnoDB tables automatically handle foreign key constraint migration.' },
      { q: 'Does it support incremental migration?', a: 'The current version focuses on full migration scenarios. For incremental sync, we recommend completing a full migration with MySQL2PG first, then using PostgreSQL Logical Replication or third-party CDC tools for ongoing sync.' },
      { q: 'How to rollback if migration fails?', a: 'MySQL2PG uses a "convert first, write later" strategy that does not affect the source database. You can run assess mode before writing to evaluate risks, and each conversion step can be independently toggled for step-by-step execution and rollback.' },
      { q: 'How to handle large tables (100M+ rows)?', a: 'MySQL2PG includes a built-in concurrent engine supporting multi-table parallel sync and single-table sharded sync. For tables with 100M+ rows, enable 5-20 concurrent threads, sync data first then create indexes to boost write performance.' },
      { q: 'How is MySQL ENUM type converted?', a: 'ENUM types are automatically converted to VARCHAR + CHECK constraints, preserving the original value restrictions. For example, ENUM(\'a\',\'b\',\'c\') becomes VARCHAR(20) CHECK (col IN (\'a\',\'b\',\'c\')).' },
      { q: 'What\'s the difference between JSON and JSONB? Which to choose?', a: 'MySQL JSON is mapped to PostgreSQL JSONB (binary JSON) by default, as JSONB supports indexing and richer query operations. If you need to preserve the original JSON format, you can configure the mapping to use the JSON type instead.' },
      { q: 'Can the source database continue writing during migration?', a: 'Yes. MySQL2PG uses a consistent snapshot during the read phase, which does not affect normal reads and writes on the source. However, we recommend running migrations during off-peak hours for accurate data validation.' },
      { q: 'What does the migration report include?', a: 'The HTML migration report includes: migration overview (table count, data volume, duration), per-table conversion status, index change inventory, function mapping details, data validation results, risk alerts, and recommendations.' },
      { q: 'Does it support distributed databases like Greenplum / YugabyteDB?', a: 'Yes. MySQL2PG auto-detects MPP distributed databases (Greenplum / YugabyteDB) and automatically adds DISTRIBUTED BY distribution keys while automatically handling redundant unique indexes.' },
    ]
  },

  // Footer
  footer: {
    text: 'MySQL2PG · Apache-2.0 License · Built with Go 1.24+',
    copyright: '© 2026 MySQL2PG Contributors',
  }
}

const translations = { zh, en }

const t = computed(() => translations[lang.value])

export function useLang() {
  return { lang, t, setLang, toggleLang }
}
