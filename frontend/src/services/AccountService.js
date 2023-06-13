import axios from "axios";

const tryLogin = async (kcData) => {
  let loginData = {
    username: kcData,
    password: kcData,
  };

  let res = await axios.put("http://localhost:8081/user/login", loginData);
  return res.data.token;
};

const register = async (kcData) => {
  let loginData = {
    username: kcData,
    password: kcData,
  };

  await axios.post("http://localhost:8081/user/register", loginData);
};

const AccountService = {
  tryLogin,
  register,
};

export default AccountService;
