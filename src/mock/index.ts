import Mock from "mockjs";
const API_URL = "http://localhost:3000";

const userInfo = [
  {
    username: "admin",
    password: "123456",
    role: "admin",
    token: "system_token",
  },
  {
    username: "user",
    password: "123456",
    role: "user",
    token: "user_token",
  },
];

const userinfo_mock = (options: any) => {
  const urlParams = new URLSearchParams(options.url.split("?")[1]);
  const token = urlParams.get("token");
  const user = userInfo.find((item) => item.token === token);
  if (!user) {
    return { code: 201, data: { message: "获取用户信息失败" } };
  }
  return {
    code: 200,
    message: "获取成功",
    data: user,
  };
};
// 用户登录
const login_mock = (options: any) => {
  const urlParams = new URLSearchParams(options.url.split("?")[1]);
  const username = urlParams.get("username");
  const password = urlParams.get("password");

  const user = userInfo.find(
    (item) => item.username === username && item.password === password
  );
  if (!user) {
    return { code: 201, message: "账号或者密码不正确", data: {} };
  }
  const { token } = user;
  return { code: 200, data: token, message: "登录成功！" };
};

Mock.mock(new RegExp(`${API_URL}/user/login`), "get", login_mock);
Mock.mock(new RegExp(`${API_URL}/user`), "get", userinfo_mock);
