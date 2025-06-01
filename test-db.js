const { Client } = require("pg");
const client = new Client({
  host: "maglev.proxy.rlwy.net",
  port: 5432, // تم التغيير هنا
  user: "postgres",
  password: "RqaVvsCEWmCbzvijjPTSVLVbYDsHGOnf",
  database: "railway",
  ssl: true,
});
client
  .connect()
  .then(() => console.log("تم الاتصال بنجاح!"))
  .catch((err) => console.error("فشل الاتصال:", err))
  .finally(() => client.end());
