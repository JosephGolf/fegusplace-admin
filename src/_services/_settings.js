import axios from "axios";
export const Setting_ser = {
    getSettings,
};

function getSettings() {
  return axios.get("https://fegusplacebackend.onrender.com/settings/get-settings");
}





