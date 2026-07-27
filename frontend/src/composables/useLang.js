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
  nav: { pain: '痛点', compare: '对比', features: '功能', metrics: '性能', flow: '流程', quickstart: '快速开始', quickStartBtn: '快速开始' },

  // Hero
  hero: {
    badge: 'v3.4.0 · 开源协议 · Go 1.24+',
    titleLine2: '一站式异构数据库迁移',
    desc: '不止数据同步 —— DDL、索引、视图、函数、用户、权限、数据校验，一次转换全部搞定。告别传统 DTS 工具的功能短板，大幅提高迁移效率，节省迁移人力成本。',
    quickStart: '快速开始 →',
    github: 'View on GitHub',
    stats: [
      { value: '100+', label: '类型映射' },
      { value: '113', label: '函数支持' },
      { value: '42', label: '视图转换' },
      { value: '500+', label: '测试用例' },
    ]
  },

  // Pain Points
  pain: {
    tag: '⚠ 行业痛点',
    title: '传统 DTS 工具的困境',
    desc: '常见的数据传输服务（DTS）工具功能单一。大量迁移工作仍需人工处理，耗时耗力、频繁出错。',
    items: [
      { icon: '📋', title: 'DDL 无法自动转换', desc: '表结构需手动逐字段改写，40+ 种类型映射工作量巨大，极易出错。' },
      { icon: '🔑', title: '索引无法自动转换', desc: '主键、唯一索引、普通索引、全文索引需要手动在 PG 侧重建。' },
      { icon: '👁', title: 'View 无法转换', desc: '视图定义涉及语法差异和函数替换，手动改写复杂度高。' },
      { icon: '⚙️', title: 'Function 无法转换', desc: '存储过程/函数的语法和内置函数差异大，113+ 个函数需逐一映射。' },
      { icon: '👤', title: '用户信息无法转换', desc: 'MySQL 用户体系与 PG Role 体系不同，需手动逐一创建和配置。' },
      { icon: '🔒', title: '表权限无法转换', desc: '表级别 GRANT 权限需手动重新配置，权限遗漏影响业务访问。' },
      { icon: '✅', title: '数据一致性无法校验', desc: '同步后缺少自动化校验手段，数据是否完整只能靠人工比对，耗时耗力。' },
      { icon: '⏱', title: '人力成本高昂', desc: '上述所有问题叠加，导致迁移周期长、人力投入大、错误率高。' },
    ]
  },

  // Comparison
  compare: {
    tag: '📊 差异化对比',
    title: 'MySQL2PG vs 传统 DTS 工具',
    desc: '一张表看清差距 —— MySQL2PG 覆盖完整迁移生命周期，传统 DTS 仅解决有限的功能。',
    colDim: '对比维度',
    colDts: '❌ 传统 DTS 工具',
    colM2p: '✅ MySQL2PG',
    no: '✗ 不支持',
    rows: [
      { dim: '数据同步', dts: '支持', mysql2pg: '百万级数据，10000+ 行/秒' },
      { dim: 'DDL 表结构转换', dts: 'no', mysql2pg: '40+ 类型自动映射，99.9% 准确率' },
      { dim: '索引自动转换', dts: 'no', mysql2pg: '主键/唯一/普通/全文索引，98% 成功率' },
      { dim: '视图（View）转换', dts: 'no', mysql2pg: '42 个视图 100% 转换' },
      { dim: '函数/存储过程转换', dts: 'no', mysql2pg: '113 个函数核心语法 100% 转换' },
      { dim: '用户迁移', dts: 'no', mysql2pg: '自动转换用户 → PG Role' },
      { dim: '表权限迁移', dts: 'no', mysql2pg: '自动映射表级权限，98% 准确率' },
      { dim: '数据一致性校验', dts: 'no', mysql2pg: '自动校验，100% 准确率' },
      { dim: 'MPP 分布式数据库支持', dts: 'no', mysql2pg: 'Greenplum / YugabyteDB' },
      { dim: 'HTML 迁移报告', dts: 'no', mysql2pg: '自动生成可视化报告' },
      { dim: '迁移前兼容性评估', dts: 'no', mysql2pg: 'assess 模式生成风险评估报告' },
      { dim: '迁移周期', dts: '数周~数月', mysql2pg: '数小时~数天' },
      { dim: '人力投入', dts: '多人协作', mysql2pg: '单人即可完成' },
    ]
  },

  // Features
  features: {
    tag: '🚀 核心功能',
    title: '全链路迁移能力',
    desc: '从表结构到数据、从视图到权限，MySQL2PG 覆盖迁移的每一个环节。',
    items: [
      { icon: '📐', title: '表结构转换', desc: '40+ 种 MySQL 字段类型智能映射到 PostgreSQL，包括 JSON/GEOMETRY/SERIAL 等特殊类型。', metric: '准确率 99.9%' },
      { icon: '📦', title: '高性能数据同步', desc: '并发引擎 + 批量插入，支持百万级数据迁移，自动禁用外键和索引提升性能。', metric: '10,000+ 行/秒' },
      { icon: '👁', title: '视图转换', desc: '自动处理反引号、LIMIT 语法、IFNULL/GROUP_CONCAT 等函数替换，批量转换。', metric: '42 视图 · 100% 可转换' },
      { icon: '🔑', title: '索引转换', desc: '主键、唯一索引、普通索引、全文索引自动重建，支持 MPP 分布键。', metric: '成功率 98%' },
      { icon: '⚙️', title: '函数/存储过程转换', desc: 'JSON、正则、日期时间、聚合、加密等 113 个函数自动映射，支持版本感知策略。', metric: '113 函数 · 95%+ 准确率' },
      { icon: '🔐', title: '用户与权限迁移', desc: 'MySQL 用户自动转换为 PG Role，保留密码哈希，表级 GRANT 权限完整映射。', metric: '权限准确率 98%' },
      { icon: '✅', title: '数据一致性校验', desc: '同步后自动比对行数，生成不一致表清单，支持全量校验和增量校验。', metric: '校验准确率 100%' },
      { icon: '🌐', title: 'MPP 分布式支持', desc: '自动检测 Greenplum / YugabyteDB，添加 DISTRIBUTED BY 分布键，跳过冗余唯一索引。', metric: 'Greenplum · YugabyteDB' },
    ]
  },

  // Metrics
  metrics: {
    tag: '📈 性能指标',
    title: '用数据说话',
    items: [
      { target: 10000, suffix: '+', label: '行/秒 同步速度', decimal: 0 },
      { target: 99.9, suffix: '%', label: '类型映射准确率', decimal: 1 },
      { target: 500, suffix: '+', label: '测试用例 100% 通过', decimal: 0 },
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
      { num: '02', title: '转换表结构', desc: '智能识别 40+ 种 MySQL 字段类型并映射为 PostgreSQL 兼容类型，一键生成目标表。', tags: ['40+ 类型映射', '准确率 99.9%', 'MPP 分布键'] },
      { num: '03', title: '转换视图', desc: '自动将 MySQL 视图定义转换为 PostgreSQL 兼容语法，无需手动改写 SQL。', tags: ['42 个视图', '100% 可转换', '函数自动替换'] },
      { num: '04', title: '同步数据', desc: '高性能并发引擎批量搬运数据，自动优化写入性能，支持百万级数据迁移。', tags: ['10,000+ 行/秒', '并发加速', '灵活同步策略'] },
      { num: '05', title: '转换索引', desc: '自动重建主键、唯一索引、普通索引和全文索引，完整保留查询性能。', tags: ['主键/唯一/普通/全文', '成功率 98%', 'MPP 适配'] },
      { num: '06', title: '转换函数', desc: '113 个 MySQL 内置函数自动映射为 PostgreSQL 等效函数，覆盖 JSON、正则、日期等场景。', tags: ['113 个函数', '版本感知', '95%+ 准确率'] },
      { num: '07', title: '转换用户', desc: 'MySQL 用户自动转换为 PostgreSQL Role，密码和身份信息安全保留。', tags: ['用户 → Role', '密码保留', '批量创建'] },
      { num: '08', title: '转换权限 + 数据校验', desc: '自动迁移表级权限，并在同步后校验数据一致性，生成完整迁移报告。', tags: ['表级 GRANT', '行数校验', '不一致表清单'] },
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

  // Footer
  footer: {
    text: 'MySQL2PG · Apache-2.0 License · Built with Go 1.24+',
    copyright: '© 2026 MySQL2PG Contributors',
  }
}

const en = {
  // Nav
  nav: { pain: 'Pain Points', compare: 'Compare', features: 'Features', metrics: 'Metrics', flow: 'Workflow', quickstart: 'Quick Start', quickStartBtn: 'Quick Start' },

  // Hero
  hero: {
    badge: 'v3.4.0 · Open Source · Go 1.24+',
    titleLine2: 'One-Stop Heterogeneous DB Migration',
    desc: 'More than data sync — DDL, indexes, views, functions, users, privileges, and data validation, all handled in one pass. Say goodbye to the limitations of traditional DTS tools.',
    quickStart: 'Quick Start →',
    github: 'View on GitHub',
    stats: [
      { value: '100+', label: 'Type Mappings' },
      { value: '113', label: 'Functions' },
      { value: '42', label: 'View Conversions' },
      { value: '500+', label: 'Test Cases' },
    ]
  },

  // Pain Points
  pain: {
    tag: '⚠ Industry Pain Points',
    title: 'Limitations of Traditional DTS Tools',
    desc: 'Common Data Transmission Service (DTS) tools have limited capabilities. Most migration work still requires manual effort — time-consuming, labor-intensive, and error-prone.',
    items: [
      { icon: '📋', title: 'No Auto DDL Conversion', desc: 'Table structures must be manually rewritten field by field. 40+ type mappings are a huge workload and highly error-prone.' },
      { icon: '🔑', title: 'No Auto Index Conversion', desc: 'Primary keys, unique indexes, regular indexes, and full-text indexes must all be manually rebuilt in PostgreSQL.' },
      { icon: '👁', title: 'No View Conversion', desc: 'View definitions involve syntax differences and function replacements. Manual rewriting is highly complex.' },
      { icon: '⚙️', title: 'No Function Conversion', desc: 'Stored procedures and functions have major syntax and built-in function differences. 113+ functions need one-by-one mapping.' },
      { icon: '👤', title: 'No User Migration', desc: 'MySQL user system differs from PostgreSQL Roles. Each user must be manually created and configured.' },
      { icon: '🔒', title: 'No Privilege Migration', desc: 'Table-level GRANT privileges must be manually reconfigured. Missing privileges affect business access.' },
      { icon: '✅', title: 'No Data Validation', desc: 'After sync, there is no automated validation. Data completeness can only be verified through manual comparison.' },
      { icon: '⏱', title: 'High Labor Costs', desc: 'All these issues combined lead to long migration cycles, heavy manpower investment, and high error rates.' },
    ]
  },

  // Comparison
  compare: {
    tag: '📊 Comparison',
    title: 'MySQL2PG vs Traditional DTS Tools',
    desc: 'See the gap at a glance — MySQL2PG covers the full migration lifecycle, while traditional DTS only addresses limited functions.',
    colDim: 'Dimension',
    colDts: '❌ Traditional DTS',
    colM2p: '✅ MySQL2PG',
    no: '✗ Not Supported',
    rows: [
      { dim: 'Data Sync', dts: 'Supported', mysql2pg: 'Million-level data, 10,000+ rows/sec' },
      { dim: 'DDL Table Conversion', dts: 'no', mysql2pg: '40+ auto type mapping, 99.9% accuracy' },
      { dim: 'Index Auto Conversion', dts: 'no', mysql2pg: 'PK/Unique/Regular/Fulltext, 98% success' },
      { dim: 'View Conversion', dts: 'no', mysql2pg: '42 views, 100% converted' },
      { dim: 'Function/Procedure Conversion', dts: 'no', mysql2pg: '113 functions, 100% core syntax converted' },
      { dim: 'User Migration', dts: 'no', mysql2pg: 'Auto convert users → PG Roles' },
      { dim: 'Table Privilege Migration', dts: 'no', mysql2pg: 'Auto map table-level privileges, 98% accuracy' },
      { dim: 'Data Consistency Validation', dts: 'no', mysql2pg: 'Auto validation, 100% accuracy' },
      { dim: 'MPP Distributed DB Support', dts: 'no', mysql2pg: 'Greenplum / YugabyteDB' },
      { dim: 'HTML Migration Report', dts: 'no', mysql2pg: 'Auto-generated visual report' },
      { dim: 'Pre-migration Assessment', dts: 'no', mysql2pg: 'Assess mode with risk report' },
      { dim: 'Migration Cycle', dts: 'Weeks ~ Months', mysql2pg: 'Hours ~ Days' },
      { dim: 'Manpower Required', dts: 'Multi-person team', mysql2pg: 'Single person' },
    ]
  },

  // Features
  features: {
    tag: '🚀 Core Features',
    title: 'Full-Pipeline Migration Capabilities',
    desc: 'From table structures to data, from views to privileges — MySQL2PG covers every aspect of migration.',
    items: [
      { icon: '📐', title: 'Table Structure Conversion', desc: 'Intelligent mapping of 40+ MySQL field types to PostgreSQL, including JSON/GEOMETRY/SERIAL and other special types.', metric: '99.9% accuracy' },
      { icon: '📦', title: 'High-Performance Data Sync', desc: 'Concurrent engine + batch insert, supports million-level data migration with auto-disabled FK and indexes for performance.', metric: '10,000+ rows/sec' },
      { icon: '👁', title: 'View Conversion', desc: 'Auto-handles backticks, LIMIT syntax, IFNULL/GROUP_CONCAT and other function replacements with batch conversion.', metric: '42 views · 100% convertible' },
      { icon: '🔑', title: 'Index Conversion', desc: 'Auto-rebuild of primary keys, unique indexes, regular indexes, and full-text indexes with MPP distribution key support.', metric: '98% success rate' },
      { icon: '⚙️', title: 'Function/Procedure Conversion', desc: 'Auto-mapping of 113 functions covering JSON, regex, datetime, aggregation, encryption with version-aware strategies.', metric: '113 functions · 95%+ accuracy' },
      { icon: '🔐', title: 'User & Privilege Migration', desc: 'MySQL users auto-converted to PG Roles, preserving password hashes with complete table-level GRANT mapping.', metric: '98% privilege accuracy' },
      { icon: '✅', title: 'Data Consistency Validation', desc: 'Post-sync auto row-count comparison, generates inconsistency reports, supports full and incremental validation.', metric: '100% validation accuracy' },
      { icon: '🌐', title: 'MPP Distributed Support', desc: 'Auto-detects Greenplum / YugabyteDB, adds DISTRIBUTED BY keys, skips redundant unique indexes.', metric: 'Greenplum · YugabyteDB' },
    ]
  },

  // Metrics
  metrics: {
    tag: '📈 Performance Metrics',
    title: 'Data-Driven Results',
    items: [
      { target: 10000, suffix: '+', label: 'Rows/sec Sync Speed', decimal: 0 },
      { target: 99.9, suffix: '%', label: 'Type Mapping Accuracy', decimal: 1 },
      { target: 500, suffix: '+', label: 'Test Cases 100% Passing', decimal: 0 },
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
      { num: '02', title: 'Convert Table Structure', desc: 'Intelligently identifies 40+ MySQL field types and maps them to PostgreSQL-compatible types. One-click target table generation.', tags: ['40+ Type Mappings', '99.9% Accuracy', 'MPP Distribution'] },
      { num: '03', title: 'Convert Views', desc: 'Automatically converts MySQL view definitions to PostgreSQL-compatible syntax. No manual SQL rewriting needed.', tags: ['42 Views', '100% Convertible', 'Auto Function Replace'] },
      { num: '04', title: 'Sync Data', desc: 'High-performance concurrent engine for batch data transfer with auto-optimized write performance. Supports million-level migration.', tags: ['10,000+ Rows/sec', 'Concurrent Speedup', 'Flexible Sync Strategy'] },
      { num: '05', title: 'Convert Indexes', desc: 'Auto-rebuilds primary keys, unique indexes, regular indexes, and full-text indexes, fully preserving query performance.', tags: ['PK/Unique/Regular/Fulltext', '98% Success', 'MPP Compatible'] },
      { num: '06', title: 'Convert Functions', desc: '113 MySQL built-in functions auto-mapped to PostgreSQL equivalents, covering JSON, regex, datetime, and more.', tags: ['113 Functions', 'Version-Aware', '95%+ Accuracy'] },
      { num: '07', title: 'Convert Users', desc: 'MySQL users auto-converted to PostgreSQL Roles. Passwords and identity information securely preserved.', tags: ['User → Role', 'Password Preserved', 'Batch Creation'] },
      { num: '08', title: 'Convert Privileges + Validate', desc: 'Auto-migrates table-level privileges and validates data consistency post-sync. Generates complete migration report.', tags: ['Table-level GRANT', 'Row Count Validation', 'Inconsistency Report'] },
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
