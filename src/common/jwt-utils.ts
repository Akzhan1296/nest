// // import { UserDBType } from '../types/types';
// import { ObjectId } from 'mongodb';
// // import jwt, { SignOptions } from 'jsonwebtoken';
// import { settings } from '../settings';
// import { UsersDocument } from '../users/domain/entity/users.schema';
// import { JwtService } from '@nestjs/jwt';

// export class JwtUtility {
//   /**
//    * @param user
//    * @return Returns JWT-token
//    */
//   async createJWT(user: UsersDocument) {
//     const login = user.getLogin();
//     const password = user.getPassword();
//     const email = user.getEmail();
//     const id = user._id;

//     const payload = {
//       login,
//       password,
//       email,
//       id,
//     };
//     // const secretOrPrivateKey = settings.JWT_SECRET;
//     // const options: SignOptions = {
//     //   expiresIn: '1d',
//     // };

//     // const jwtToken = JwtService.sign(payload, {
//     //   secret: settings.JWT_SECRET,
//     //   expiresIn: '1d',
//     // });

//     // return jwtToken;
//   },

//   // async createRefreshJWT(user: UsersDocument) {
//   //   const payload = {
//   //     userId: user._id,
//   //     tokenId: new ObjectId().toString(),
//   //   };
//   //   const secretOrPrivateKey = settings.JWT_SECRET;
//   //   const options: SignOptions = {
//   //     expiresIn: '2d',
//   //   };

//   //   const jwtToken = jwt.sign(payload, secretOrPrivateKey, options);

//   //   return jwtToken;
//   // },

//   // async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
//   //   try {
//   //     const result: any = jwt.verify(token, settings.JWT_SECRET);

//   //     if (result.exp * 1000 < new Date().getTime()) {
//   //       return null;
//   //     }

//   //     if (!result.userId) {
//   //       return null;
//   //     }
//   //     return new ObjectId(result.userId);
//   //   } catch (error) {
//   //     return null;
//   //   }
//   // },

//   // async extractPayloadFromRefreshToken(token: string): Promise<any> {
//   //   try {
//   //     const result: any = jwt.verify(token, settings.JWT_SECRET);

//   //     if (result.exp * 1000 < new Date().getTime()) {
//   //       return null;
//   //     }

//   //     if (!result) {
//   //       return null;
//   //     }
//   //     return result;
//   //   } catch (error) {
//   //     return null;
//   //   }
//   // },
// };
