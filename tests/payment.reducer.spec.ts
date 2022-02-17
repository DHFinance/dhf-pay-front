import reducer from "../store/reducers/payment";
import {initialState} from "../store/reducers/payment";
import {ADD_PAYMENT_FAILED, GET_PAYMENT_START, GET_PAYMENT_SUCCESS} from "../store/actions/payment";

describe('payment reducer', () => {
    it('get payment start', () => {
        const initialStateStartPayment = {
            ...initialState
        }
        const actionStart = {
            type: GET_PAYMENT_START
        }
        expect(reducer(initialStateStartPayment, actionStart)).toEqual({
            ...initialStateStartPayment,
            error: '',
            start: true,
            isLoading: true,
            isChanged: true
        });
    });

    it('get payment success', () => {
        const initialStateEditStore = {
            ...initialState
        }
        const actionSuccess = {
            type: GET_PAYMENT_SUCCESS,
            payload: [1,2,3]
        }
        expect(reducer(initialStateEditStore, actionSuccess)).toEqual({
            ...initialStateEditStore,
            data: actionSuccess.payload,
            error: '',
            start: false,
            isLoading: false,
            isChanged: true
        });
    });

    it('add payment failed', () => {
        const initialStateEditStore = {
            ...initialState
        }
        const actionAdd = {
            type: ADD_PAYMENT_FAILED,
            payload: "error message"
        }
        expect(reducer(initialStateEditStore, actionAdd)).toEqual({
            ...initialStateEditStore,
            isLoading: false,
            error: actionAdd.payload,
            isChanged: true
        });
    });
})