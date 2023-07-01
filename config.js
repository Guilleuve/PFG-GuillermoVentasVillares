let BASE_URL = "www.cooltrainer.com/";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:3000/";
}
export { BASE_URL };