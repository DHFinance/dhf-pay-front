// @ts-ignore
import moxios from "moxios";
import axios from "axios"
export const API_ROOT = process.env.NEXT_PUBLIC_API_HOST
import thunk from 'redux-thunk'
import expect from 'expect'
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import * as actions from '../store/actions/payment';
import {getPayment} from "../store/actions/payment";
import api from "./../api/index"

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);

jest.mock('./../api/index');



describe('Payment actions', () => {
    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('get all payments', async () => {

        const expectedActions = [
            {type: actions.GET_PAYMENT_START},
            {type: actions.GET_PAYMENT_SUCCESS, payload: expect.any(Array)},
        ];

        const store = mockStore({
            auth: {
                data: {
                    token: "$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f."
                }
            }
        })




        // @ts-ignore
        api.get.mockImplementation(() => Promise.resolve({
            data: []
        }));


        await store.dispatch(getPayment());
        expect(await store.getActions()).toEqual(expectedActions);
    });



    it('fires GET_PAYMENT_FAILED if server not available', async () => {

        const expectedActions = [
            {type: actions.GET_PAYMENT_START},
            {type: actions.GET_PAYMENT_FAILED, payload: expect.any(String)},
        ];

        const store = mockStore({
            auth: {
                data: {
                    token: "$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f."
                }
            }
        })


        // @ts-ignore
        api.get.mockImplementation(() => Promise.reject({}));


        await store.dispatch(getPayment());
        expect(store.getActions()).toEqual(expectedActions);
    });



});