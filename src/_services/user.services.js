import axios from "axios";
import { authHeader } from "_helper/auth-header";
export const userService = {
  LogIn,
  AddUser,
  GetAllUsers,
  DeleteUser,
  UpdateUser,
  findUser,
};
function LogIn(email, password) {
  return axios.post("https://fegusplacebackend.onrender.com/auth/login", { email, password });
}
function AddUser(name, email, password, age, cart,isAdmin) {
  return axios.post("https://fegusplacebackend.onrender.com/auth/signup", {
    name,
    email,
    password,
    cart,
    age,
    isAdmin,
  });
}

function GetAllUsers() {
  let token = JSON.parse(localStorage.getItem("token"));
  const header = { headers: { Authorization: `Bearer ${token}` } };

  return axios.get("https://fegusplacebackend.onrender.com/user/getAll", header);
}

function DeleteUser(email) {
  let token = JSON.parse(localStorage.getItem("token"));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  // console.log(email);
  return axios({
    method: "delete",
    url: "https://fegusplacebackend.onrender.com/user/delete",
    data: { email: email },
    headers: { Authorization: `Bearer ${token}` },
  });
}

function UpdateUser(user) {
  let token = JSON.parse(localStorage.getItem("token"));

  return axios({
    method: "PUT",
    url: "https://fegusplacebackend.onrender.com/user/update",
    data: { ...user },
    headers: { Authorization: `Bearer ${token}` },
  });
}
function findUser(user) {
  let token = JSON.parse(localStorage.getItem("token"));
  return axios({
    method: "post",
    url: "https://fegusplacebackend.onrender.com/user/get-user",
    data: { ...user },
    headers: { Authorization: `Bearer ${token}` },
  });
}
