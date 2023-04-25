import { HydratedDocument } from 'mongoose';

export abstract class Repository<T> {
  async save(model: HydratedDocument<T>): Promise<boolean> {
    return model
      .save()
      .then((savedDoc) => {
        return savedDoc === model;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  async delete(model: HydratedDocument<T>): Promise<boolean> {
    return model
      .delete()
      .then((deletedDoc) => {
        return deletedDoc === model;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
}
