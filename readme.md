# mas.actab.v1 1.0.0 (Assetto Corsa 记分板插件)

## Warn 告知

插件尚在测试当中，无法确保稳定性。

## Stacks 技术栈

API 和 UDP 服务端 - NodeJS/Typescript/Koa2/TypeORM

前端 - Vue3

## Functions 功能

- 数据统计中心
- 玩家游玩数据统计
- 多台 AC 服务器数据集中
- Session 记录
- 在线地图

## Notice 声明

该项目遵循 GPLv3 License。

提示：不提供二进制执行文件的 Release，请自行 Clone 项目修改您需要的样子。

---

## Project setup 使用前置

项目所需环境

```
# Windows

# Nginx

# MySQL

# NodeJS
版本 16+

# Yarn
使用 npm install yarn 即可，如果不想使用也可以把 yarn install 替换成 npm install
```

Download 下载项目

```
# 克隆仓库
git clone https://github.com/Kenhuey/mas.actab.v1.git

# 给服务端插件代码安装第三方库
cd actab-back
yarn install

# 给前端代码安装第三方库
cd actab-front
yarn install
```

## 服务端插件

编译成可执行文件

```
yarn build:exe
```

直接运行

```
# 服务端插件
yarn serve:udp

# 服务端接口
yarn serve:api
```

## 前端

编译成压缩过的结构

```
yarn build
```

直接运行（不建议）

```
yarn serve
```

提示：在 vue.config.js 配置文件中添加以下配置可更改 serve 端口。

```
devServer: {
    port: 80,
}
```

---

## Usage 使用流程

提示：请先确保已经安装完成所有第三方库。

### 第一步 - 编译服务端插件并尝试运行

```
# 跳转到服务端插件代码目录
cd actab-back
# 编译成 exe 文件
yarn build:exe
```

在 ./dist_exe 目录中会生成一个 actab-back.exe 的文件，把他复制出来到服务器中的一个单独文件夹，如：/actab。

然后添加名为 udp.bat 批处理文件并输入：

```
# E:/somefolder 为文件所在的路径
E:/somefolder/actab/actab-back.exe -s udp
@pause
```

也添加名为 api.bat 批处理文件并输入：

```
# E:/somefolder 为文件所在的路径
E:/somefolder/actab/actab-back.exe -s api
@pause
```

然后运行 udp.bat 文件，第一次运行会报错退出来并生成一个配置文件。

打开插件生成的 ./config/server.json 文件会有以下内容，把他编辑成你需要的配置。

```
{
    "ac": {
        "udpPortSender": 11000, // 插件发送服务器数据端口
        "udpPortListen": 12000, // 插件接收服务器数据端口
        "path": "F:\\xxx\\xxx\\assettocorsa" // 神力科莎的服务器目录
    },
    "web": {
        "apiPort": 8081 // API 端口
    },
    "mysql": {
        "port": 3306, // 数据库端口
        "address": "123.123.123.123", // 数据库 IP host
        "database": "actab", // 数据库名
        "username": "username001", // 用户名
        "password": "password001" // 密码
    }
}
```

接下来再次使用 udp.bat 运行 UDP 服务器，如果数据库是可用的与 AC 服务端配置没问题的话，可以看到数据库将会出现多个表，此时代表插件初始化数据库成功：

```
cache_player
cache_position
cache_server
session
session_car
session_event
session_lap
session_result
users
...
```

下一步是使用 api.bat 开启 API 服务器供前端数据面板使用，如果没有出现问题则会有以下输出：

```
[2021-11-15 00:00:54] [INFO] <Kenhuey-Desktop 20408> main - Config found at: "FE:\xxx\xxx\actab-back\config\server.json".
[2021-11-15 00:00:55] [INFO] <Kenhuey-Desktop 20408> main - HTTP API server running at "http:/localhost:8081/".
```

此时在浏览器打开

```
# xxx 为你的外网 IP
http:/xxx:8081/
```

如果成功开启则会返回以下数据：

```
{"message":"AcTab Api Running."}
```

此时，你的服务端已经配置完毕。

### 第二步 - 编译前端

前端只需要简单几个步骤即可部署。

打开 actab-front/src/utils/request/service.ts 文件会看到如下内容：

```
import axios from "axios";

export const apiHost = "127.0.0.1:8081";

const service = axios.create({
  baseURL: `http://${apiHost}/`,
});

...
```

修改后：

```
import axios from "axios";

// xxx 是你的公网 IP,后面的端口按需更改。
export const apiHost = "xxx:8081";

const service = axios.create({
  baseURL: `http://${apiHost}/`,
});
```

编译：

```
# 跳转到前端项目目录
cd actab-front
# Webpack 打包
yarn build
```

接下来会看到会创建一个 dist 文件夹在根目录。

把他里面的文件复制到 Nginx 设置中的 location.root 目录即可。

Nginx 一般配置如下：

```
# actab.conf
server {
    listen 80;
    server_name xxx.com;
    location / {
        root /xxx/prod_dist;
        index index.html index.htm;
        try_files $uri $uri/ @router;
    }
    location @router {
        rewrite ^.*$ /index.html last;
    }
}
...

# nginx.conf
...
http {
    ...
    gzip  on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    ...
    include actab.conf;
    ...
}
...
```

如果不会使用 Nginx 那就直接用 VueCli 来生成一个 DevServer（不推荐）：

```
# CMD 运行以下指令
# 修改端口在上面有写，如果不修改默认是 8080
yarn serve
```

### 在线地图所需（重要）

请将客户端中的 /content/tracks 复制到服务端中（kn5 后缀的文件可忽略）。

服务端的路径对应的 actab-back.exe 中设置的 /config/server.json 中同步：

```
{
    "ac": {
        "udpPortSender": 11000,
        "udpPortListen": 12000,
        "path": "F:\\xxx\\assettocorsa" // 这个目录
    },
    "web": {
        "apiPort": 8081
    },
    "mysql": {
        "port": 3306,
        "address": "127.0.0.1",
        "database": "actab",
        "username": "123123",
        "password": "123123"
    }
}
```
其中包含了地图小地图、地图 Banner、地图坐标等参数文件，如果缺失会导致在线小地图和玩家无法正常显示。
