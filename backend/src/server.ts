import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import publicRouter from "./routes/public.route";
import passport from "./services/passport";
import securedRoute from "./routes/secured.route";

const app = express();

// Allow client to send json requests
app.use(express.json())

app.use(morgan('dev'))
app.use(cors())

app.use(passport.initialize())

// Allows client to send query string or attach query string to request urls
app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api', publicRouter);
app.use('/api', securedRoute)

export default app