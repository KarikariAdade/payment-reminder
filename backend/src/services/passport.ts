import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt'
import passport from 'passport'
import prisma from "../database";


const options:any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

passport.use(
    new Strategy(options, async (jwtPayload:any, done:VerifiedCallback) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: jwtPayload.id } });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
)

export default passport