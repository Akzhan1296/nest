export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb+srv://Akzhan:!qwerty123@test.acpyg.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  MONGO_DB_NAME: 'nestmoongose',
};
