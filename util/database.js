const Sequelize = require("sequelize");

// const sequelize = new Sequelize("foodshare", "root", "37936845", {
//   dialect: "mysql",
//   host: "localhost",
// });

//start here
const sequelize = new Sequelize("postgres://postgres.zzkfoycflaxpayhaypqn:cjambetsa45@aws-0-eu-west-2.pooler.supabase.com:5432/postgres");

module.exports = sequelize;
