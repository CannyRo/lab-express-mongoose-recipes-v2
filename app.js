const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

// IMPORT MODELS
const Recipe = require("./models/Recipe.model");

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";
mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", async (req, res) => {
  try {
    const dataRecipe = {
      title: req.body.title,
      instructions: req.body.instructions,
      level: req.body.level,
      ingredients: req.body.ingredients,
      image: req.body.image,
      duration: req.body.duration,
      isArchived: req.body.isArchived,
      created: req.body.created,
    };
    const createdRecipe = await Recipe.create(dataRecipe);
    //   console.log("Recipe created with success.", createdRecipe);
    res
      .status(201)
      .json({ message: "Recipe created with success.", recipe: createdRecipe });
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Error while creating a new recipe." });
    console.log(error);
  }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await Recipe.find({});
    res.status(200).json({
      message: "Getting all recipes with success.",
      recipes: allRecipes,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Error while getting all recipes from the database.",
    });
    console.log(error);
  }
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const oneRecipe = await Recipe.findById(id);
    res.status(200).json({
      message: `Getting the recipe ID : ${id} with success.`,
      recipe: oneRecipe,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: `Error while getting the recipe ID : ${id} from the database.`,
    });
    console.log(error);
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.patch("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dataRecipe = {
      title: req.body.title,
      instructions: req.body.instructions,
      level: req.body.level,
      ingredients: req.body.ingredients,
      image: req.body.image,
      duration: req.body.duration,
      isArchived: req.body.isArchived,
      created: req.body.created,
    };
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, dataRecipe, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Recipe updated with success.", recipe: updatedRecipe });
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: `Error while updating the recipe ID : ${id}.` });
    console.log(error);
  }
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    res
     .status(204)
     .json({ message: "Recipe deleted with success.", recipe: deletedRecipe})
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: `Error while deleting the recipe ID : ${id}.` });
    console.log(error);
  }
});

// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
