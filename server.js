const app = require("./src/app");
const dbConnect = require("./src/database/database");

dbConnect()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
