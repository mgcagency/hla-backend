import passport from "passport";
import { Strategy as LocalStrategy, Strategy } from "passport-local";
import { IUser, User } from "./models/user";
import { compareSync } from "bcryptjs";


export const initializingPassport = (passport: passport.PassportStatic) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email',
            passwordField: "password",
            passReqToCallback: true
         },
        async (req:any, email: string, password: string, done: any) => {
            try {
                const user = await User.findOne({ email });

                console.log("user is : ", user);

                if (!user) return done(null, false, { message: 'User not found' });
                const result = compareSync(password, user.password)

                if (!result) return done(null, false, { message: 'Incorrect password' });
                console.log(" continuing for done")
                return await done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
        done(null, (user as any)._id);
    });

    passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};