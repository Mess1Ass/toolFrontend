// src/config.js

const ENV = "dev"; // 切换成 "prod" 使用服务器地址
//const ENV = "prod"; 

const config = {
  dev: {
    API_BASE_URL: "http://localhost:5000"
  },
  prod: {
    API_BASE_URL: "http://106.14.212.1:5000"
  }
};

export default config[ENV];

