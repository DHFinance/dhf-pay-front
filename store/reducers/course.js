import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";
import {GET_COURSE_SUCCESS, GET_COURSE_START, GET_COURSE_FAILED} from "../actions/course";

const initialState = {
  data: {
    usd: 0
  },
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_COURSE_START:
      return {
        ...state,
        error: '',
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_COURSE_SUCCESS:
      return {
        ...state,
        data: {
          usd: action.payload.data['casper-network'].usd,
        },
        start: false,
        error: '',
        isLoading: false,
        isChanged: true
      };
    case  GET_COURSE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    default:
      return state
  }
}
