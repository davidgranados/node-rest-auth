import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x);

async function main() {
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  const users = await UserModel.insertMany(seedData.users);

  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetween0AndX(users.length - 1)]._id,
    }))
  );

  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetween0AndX(users.length - 1)]._id,
      category: categories[randomBetween0AndX(categories.length - 1)]._id,
    }))
  );

  console.log("Users", users.length);
  console.log("Categories", categories.length);
  console.log("Products", products.length);
}

(async () => {
  MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongUrl: envs.MONGO_URL,
  });

  await main();

  MongoDatabase.disconnect();
})();
