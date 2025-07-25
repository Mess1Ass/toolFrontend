// src/config.js

// const ENV = "dev"; // 切换成 "prod" 使用服务器地址
const ENV = "prod"; 

const config = {
  dev: {
    API_BASE_URL: "http://localhost:5000"
  },
  prod: {
    API_BASE_URL: "https://48api.tool4me.cn"
  }
};

export default config[ENV];

