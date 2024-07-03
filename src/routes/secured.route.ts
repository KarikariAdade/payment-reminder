import {Router} from "express";
import {viewCustomers} from "../controllers/customers";
import passport from "passport";

const securedRoute = Router()

//============= CUSTOMERS ROUTE ================
securedRoute.get('/customers', passport.authenticate('jwt', {session: false}), viewCustomers)

export default securedRoute