# YSC GEO Lab — GEORank 二开与部署包

这个目录把 GEORank 的通用工作台改造成 YSC 面向客户的白标服务入口。它不复制上游的专家资料、书封、品牌与研究首页内容；首页、文案和结构化资料均使用 YSC 自有内容。

## 已完成的二开

- `homepage/`：可直接导入 GEORank 后台的自定义首页包，默认入口为网站诊断，并保留方案、拓词和工具入口。
- `.env.production.example`：`geo.yscai101.com` 的生产变量模板。真实密钥只保存在服务器的 `.env` 中。
- `nginx/geo.yscai101.com.conf`：由现有 Nginx 接管 TLS，再反向代理到 GEORank 的仅本机监听端口，避免与主站抢占 80/443。
- 主站 `geo.html` 和项目页入口：负责阐明服务边界、转化和跳转到工作台。

## 部署步骤

1. 在一台有 Docker Compose 与 Nginx 的 Linux 服务器上克隆上游项目：

   ```bash
   git clone https://github.com/yaojingang/GEORank.git /opt/ysc-georank
   cd /opt/ysc-georank
   cp /path/to/geo-service/.env.production.example .env
   chmod 600 .env
   ```

2. 生成并替换 `.env` 中所有 `replace-with-...` 值；填入自己控制的 OpenAI 兼容模型与 Embedding API。不要把任何密钥提交到 Git。

3. 增加 DNS 记录：`geo.yscai101.com` 的 `A`（以及可选的 `AAAA`）记录指向该服务器。确认解析完成后先签发证书，再安装本目录 Nginx 配置。下面的方式会暂时停止 Nginx；如果主站不能短暂停止，请改用该服务器现有的证书签发流程：

   ```bash
   sudo systemctl stop nginx
   sudo certbot certonly --standalone -d geo.yscai101.com
   sudo systemctl start nginx
   sudo cp /path/to/geo-service/nginx/geo.yscai101.com.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/geo.yscai101.com.conf /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

4. 启动工作台。它只绑定本机 `127.0.0.1:18080`，公网流量必须经过 Nginx：

   ```bash
   docker compose -f docker-compose.yml -f /path/to/geo-service/docker-compose.yscai101.yml up -d --build
   docker compose ps
   curl -fsS http://127.0.0.1:18080/health
   ```

5. 用种子管理员密码登录 `https://geo.yscai101.com/admin`。在“系统设置 → 首页管理”上传 `homepage/` 目录打出的 zip，启用后验证根路径、`/diagnostic`、`/plans`、`/keywords` 与 `/tools`。

   ```bash
   cd /path/to/geo-service/homepage
   zip -r ../ysc-geo-homepage.zip index.html css
   ```

## 上线前检查

- 后台只给运营人员；用户、客户诊断、方案、API 池不能作为公共数据开放。
- 用客户自己的站点测试抓取前，取得其明确授权；不要抓取登录后页面、隐私数据或受访问限制内容。
- 所有输出标示为“优化建议/诊断”，不要承诺 ChatGPT、Claude、Perplexity、Gemini 等任何平台的排名、引用或推荐。
- 上游代码为 Apache-2.0；但其专家资料、名称、商标和内置首页受额外权利边界约束，YSC 实例不应复用这些资料。
