import {POST_LOGIN_FAILED, postLogin} from "../store/actions/auth";

export const API_ROOT = process.env.NEXT_PUBLIC_API_HOST
import thunk from 'redux-thunk'
import expect from 'expect'
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import * as actions from '../store/actions/auth';
import {getPayment} from "../store/actions/payment";
import api from "./../api/index"

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);

jest.mock('./../api/index');



describe('Auth actions', () => {
    beforeEach(function () {
    });

    afterEach(function () {
    });

    it('post login action fires', async () => {

        const expectedActions = [
            {type: actions.POST_LOGIN_START},
            {type: actions.POST_LOGIN_SUCCESS, payload: expect.any(Array)},
        ];

        const store = mockStore({
            auth: {
                data: {
                    token: "$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f."
                }
            }
        })




        // @ts-ignore
        api.post.mockImplementation(() => Promise.resolve({
            data: []
        }));


        await store.dispatch(postLogin({}, ()=>{}));
        expect(await store.getActions()).toEqual(expectedActions);
    });


    //
    it('fires POST_LOGIN_FAILED on fail', async () => {

        const expectedActions = [
            {type: actions.POST_LOGIN_START},
            {type: actions.POST_LOGIN_FAILED, payload: {}},
        ];

        const store = mockStore({
            auth: {
                data: {
                    token: "$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f."
                }
            }
        })


        // @ts-ignore
        api.post.mockImplementation(() => Promise.reject({}));


        await store.dispatch(postLogin({}, ()=>{}));
        // console.log(store.getActions())
        expect(await store.getActions()).toEqual(expectedActions);
    });



});