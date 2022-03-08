import {GET_TRANSACTION_FAILED, GET_TRANSACTION_START, getTransaction} from "../store/actions/transaction";


export const API_ROOT = process.env.NEXT_PUBLIC_API_HOST
import thunk from 'redux-thunk'
import expect from 'expect'
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import * as actions from '../store/actions/transaction';
import {getPayment} from "../store/actions/payment";
import api from "./../api/index"

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);

jest.mock('./../api/index');



describe('Transactions actions', () => {
    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('getTransaction returns data', async () => {

        const expectedActions = [
            {type: actions.GET_TRANSACTION_START},
            {type: actions.GET_TRANSACTION_SUCCESS, payload: expect.any(Array)},
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


        await store.dispatch(getTransaction('0x0sdfsdfsd'));
        expect(await store.getActions()).toEqual(expectedActions);
    });


    //
    it('fires GET_TRANSACTION_FAILED on fail', async () => {

        const expectedActions = [
            {type: actions.GET_TRANSACTION_START},
            {type: actions.GET_TRANSACTION_FAILED, payload: expect.any(String)},
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


        await store.dispatch(getTransaction('0x0sdfsdf'));


        expect(await store.getActions()).toEqual(expectedActions);
    });



});