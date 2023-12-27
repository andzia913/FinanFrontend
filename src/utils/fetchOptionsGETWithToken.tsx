const accessToken = localStorage.getItem("accessToken");
const fetchOptionsGETWithToken = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  },
};

export default fetchOptionsGETWithToken;
