import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Todo",
  password: "1234567",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



async function checkTodolist() {
  const result = await db.query('SELECT id, title FROM to_dolist;');
  let dataTitle = [];
  result.rows.forEach((Title) => {
    dataTitle.push(Title);
  });
  return dataTitle;
}

app.get("/", async (req, res) => {
  const dataTitle = await checkTodolist();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: dataTitle ,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const addInput = await db.query('INSERT INTO to_dolist (title)VALUES ($1);',[item]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const editTitle = req.body.updatedItemTitle;
  const editId = req.body.updatedItemId;
  const update = await db.query('UPDATE to_dolist SET title=$1 WHERE id = $2;',[editTitle, editId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteValue = req.body.deleteItemId;
  console.log(deleteValue);
  const delet = await db.query('DELETE FROM to_dolist WHERE id=$1;',[deleteValue]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
