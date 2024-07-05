import {Router} from "express";
import {createCustomer, customerDetails, deleteCustomer, updateCustomer, viewCustomers} from "../controllers/customers";
import passport from "passport";
import {validateCustomerData, validateCustomerId} from "../requests/customers.request";
import {handleValidationErrors} from "../services/config";
import {body} from "express-validator";
import {viewInvoices} from "../controllers/invoices";

const securedRoute = Router()

//============= CUSTOMERS ROUTE ================


securedRoute.get('/customers', passport.authenticate('jwt', {session: false}), viewCustomers)
securedRoute.post('/customers/store', passport.authenticate('jwt', {session: false}), validateCustomerData('create'), handleValidationErrors, createCustomer)
securedRoute.post('/customers/update',  passport.authenticate('jwt', {session: false}), validateCustomerData('update'), handleValidationErrors, updateCustomer)
securedRoute.post('/customers/details',  passport.authenticate('jwt', {session: false}), validateCustomerId, handleValidationErrors, customerDetails)
securedRoute.post('/customers/delete', passport.authenticate('jwt', {session: false}), validateCustomerId, handleValidationErrors, deleteCustomer)


// ==================== INVOICES ==================

securedRoute.get('/invoices', passport.authenticate('jwt', {session: false}), viewInvoices)
export default securedRoute