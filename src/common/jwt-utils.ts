// import { UserDBType } from '../types/types';
// import { ObjectId } from 'mongodb';
// import jwt, { SignOptions } from 'jsonwebtoken';
// import { settings } from '../settings';

// export const jwtUtility = {
//   /**
//    * @param user
//    * @return Returns JWT-token
//    */
//   async createJWT(user: UserDBType) {
//     const payload = { userId: user._id, isAccess: true };
//     const secretOrPrivateKey = settings.JWT_SECRET;
//     const options: SignOptions = {
//       expiresIn: '1d',
//     };

//     const jwtToken = jwt.sign(payload, secretOrPrivateKey, options);

//     return jwtToken;
//   },

//   async createRefreshJWT(user: UserDBType) {
//     const payload = {
//       userId: user._id,
//       tokenId: new ObjectId().toString(),
//     };
//     const secretOrPrivateKey = settings.JWT_SECRET;
//     const options: SignOptions = {
//       expiresIn: '2d',
//     };

//     const jwtToken = jwt.sign(payload, secretOrPrivateKey, options);

//     return jwtToken;
//   },

//   async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);

//       if (result.exp * 1000 < new Date().getTime()) {
//         return null;
//       }

//       if (!result.userId) {
//         return null;
//       }
//       return new ObjectId(result.userId);
//     } catch (error) {
//       return null;
//     }
//   },

//   async extractPayloadFromRefreshToken(token: string): Promise<any> {
//     try {
//       const result: any = jwt.verify(token, settings.JWT_SECRET);

//       if (result.exp * 1000 < new Date().getTime()) {
//         return null;
//       }

//       if (!result) {
//         return null;
//       }
//       return result;
//     } catch (error) {
//       return null;
//     }
//   },
// };
