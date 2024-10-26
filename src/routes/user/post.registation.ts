// import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
// export const registration = async (req: Request, res: Response) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     console.log(req.body)
//     let userRepo = AppDataSource.getRepository(User)
//     console.log(userRepo)
//     const user = await userRepo.findOne({where:{email}});
//     console.log(user)
//     if (user) {
//       return res.status(400).json({ error: "user already exists" });
//     }
//      const userInsert =  new User();
//       userInsert.first_name = first_name
//       userInsert.last_name = last_name
//       userInsert.email = email
//       userInsert.password = password
//       console.log(userInsert)
//      await userRepo.save(userInsert)
//     return res.status(200).json({data:userInsert})
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ error: error });
//   }
// };
