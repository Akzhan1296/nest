import { ObjectId } from 'mongodb';

//to create Blog
export class BlogItemType {
  constructor(
    public name: string,
    public youtubeUrl: string,
    public createdAt: Date,
  ) {}
}

// db type
export class BlogItemDBType {
  name: string;
  youtubeUrl: string;
  _id: ObjectId;
  createdAt: Date;
}
