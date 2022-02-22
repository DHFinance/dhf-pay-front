// @ts-ignore
import moxios from "moxios";
export const API_ROOT = process.env.NEXT_PUBLIC_API_HOST
import thunk from 'redux-thunk'
import expect from 'expect'
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import * as actions from '../store/actions/payment';
import {getPayment} from "../store/actions/payment";

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);

describe('Payment actions', () => {
    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
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