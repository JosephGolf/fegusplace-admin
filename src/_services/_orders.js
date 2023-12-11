import axios from "axios";
export const orderServic = {
  getAllOrders,
};

function getAllOrders() { 
  return axios.get("https://fegusplacebackend.onrender.com/order/get-all");
}