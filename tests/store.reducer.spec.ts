import reducer from "../store/reducers/store";
import {
    ADD_STORE_FAILED,
    EDIT_STORE_START, EDIT_STORE_SUCCESS,
} from "../store/actions/store";
import {initialState} from "../store/reducers/store";

describe('store reducer', () => {
    it('edit store start', () => {
        const initialStateEditStore = {
            ...initialState
        }
        const actionEdit = {
            type: EDIT_STORE_START
        }
        expect(reducer(initialStateEditStore, actionEdit)).toEqual({
            ...initialStateEditStore,
            start: true,
            isLoading: true,
            isChanged: true
        });
    });

    it('edit store success', () => {
        const initialStateEditStore = {
            ...initialState
        }
        const actionEdit = {
            type: EDIT_STORE_SUCCESS,
            payload: [1,2,3]
        }
        expect(reducer(initialStateEditStore, actionEdit)).toEqual({
            ...initialStateEditStore,
            data: actionEdit.payload,
            start: false,
            error: '',
            isLoading: false,
            isChanged: true
        });
    });

    it('add store failed', () => {
        const initialStateEditStore = {
            ...initialState
        }
        const actionAdd = {
            type: ADD_STORE_FAILED,
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