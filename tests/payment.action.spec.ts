// @ts-ignore
import moxios from "moxios";
export const API_ROOT = process.env.NEXT_PUBLIC_API_HOST
import thunk from 'redux-thunk'
import expect from 'expect'
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import * as actions from '../store/actions/payment';
import {addPayment, getPayment} from "../store/actions/payment";


const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);


const addPaymentMock = {
    "amount": "2500000000",
    "status": "Not_paid",
    "comment": "Tips",
    "type": 1,
    "text": "Pay",
}

const apiKey = "FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak";

describe('Payment actions', () => {
    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
    });

    it('add payment ',  () => {
        moxios.wait(() => {
            moxios.stubRequest({
                status: 200,
                response: {id:expect.any(Number)}
            })
        });

        const expectedActions = [
            { type: actions.ADD_PAYMENT_START },
            { type: actions.ADD_PAYMENT_SUCCESS, payload: {id:expect.any(Number)} },
        ];
        const store = mockStore({})

        return store.dispatch(addPayment(addPaymentMock,apiKey)).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('get all payments', () => {
        moxios.wait(() => {
            moxios.stubRequest({
                status: 200,
                response: expect.any(Array)
            })
        });

        const expectedActions = [
            { type: actions.GET_PAYMENT_START },
            { type: actions.GET_PAYMENT_SUCCESS, payload: expect.any(Array) },
        ];

        const store = mockStore({ auth: {
            data: {
                token: "$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f."
            }
            } })
        return store.dispatch(getPayment()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});