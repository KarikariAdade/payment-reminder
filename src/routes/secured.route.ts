import {Router} from "express";
import {createCustomer, customerDetails, deleteCustomer, updateCustomer, viewCustomers} from "../controllers/customers";
import passport from "passport";
import {validateCustomerData, validateCustomerId} from "../requests/customers.request";
import {handleValidationErrors} from "../services/config";
import {
    createInvoice,
    deleteInvoice,
    invoiceDetails,
    sendInvoiceEmail,
    updateInvoice,
    viewInvoices
} from "../controllers/invoices";
import {validateInvoiceData, validateInvoiceId} from "../requests/invoices.request";
import {createTax, deleteTax, updateTax, viewTaxes} from "../controllers/taxes";
import {validateTaxData, validateTaxId} from "../requests/taxes.request";


const securedRoute = Router()

//============= CUSTOMERS ROUTE ================


securedRoute.get('/customers', passport.authenticate('jwt', {session: false}), viewCustomers)
securedRoute.post('/customers/store', passport.authenticate('jwt', {session: false}), validateCustomerData('create'), handleValidationErrors, createCustomer)
securedRoute.post('/customers/update',  passport.authenticate('jwt', {session: false}), validateCustomerData('update'), handleValidationErrors, updateCustomer)
securedRoute.post('/customers/details',  passport.authenticate('jwt', {session: false}), validateCustomerId, handleValidationErrors, customerDetails)
securedRoute.post('/customers/delete', passport.authenticate('jwt', {session: false}), validateCustomerId, handleValidationErrors, deleteCustomer)


// ==================== INVOICES ==================

securedRoute.get('/invoices', passport.authenticate('jwt', {session: false}), viewInvoices)
securedRoute.post('/invoices/store', passport.authenticate('jwt', {session: false}), validateInvoiceData('create'), handleValidationErrors, createInvoice)
securedRoute.post('/invoices/update', passport.authenticate('jwt', {session: false}), validateInvoiceData('update'), handleValidationErrors, updateInvoice)
securedRoute.post('/invoices/details', passport.authenticate('jwt', {session: false}), validateInvoiceId(), handleValidationErrors, invoiceDetails)
securedRoute.post('/invoices/delete', passport.authenticate('jwt', {session: false}), validateInvoiceId(), handleValidationErrors, deleteInvoice)
securedRoute.get('/invoices/send', passport.authenticate('jwt', {session: false}), sendInvoiceEmail)


// ======================= TAXES ==================
securedRoute.get('/taxes', passport.authenticate('jwt', {session: false}), viewTaxes)
securedRoute.post('/taxes/store', passport.authenticate('jwt', {session: false}), validateTaxData('create'), handleValidationErrors,  createTax)
securedRoute.post('/taxes/update', passport.authenticate('jwt', {session: false}), validateTaxData('update'), handleValidationErrors, updateTax)
securedRoute.post('/taxes/delete', passport.authenticate('jwt', {session: false}), validateTaxId(), handleValidationErrors, deleteTax)






export default securedRoute