import mongoose from "mongoose";

interface Options {
  mongUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options) {
    const { mongUrl, dbName } = options;

    try {
      await mongoose.connect(mongUrl, {
        dbName,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
  }
}
