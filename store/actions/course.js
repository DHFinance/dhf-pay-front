import {get, post} from "../../api"

export const GET_COURSE_START = 'GET_COURSE_START';
export const GET_COURSE_SUCCESS = 'GET_COURSE_SUCCESS';
export const GET_COURSE_FAILED = 'GET_COURSE_FAILED';


const getCourseStart = () => ({
  type: GET_COURSE_START,
});

const getCourseSuccess = (data) => ({
  type: GET_COURSE_SUCCESS,
  payload: data
});

const getCourseFailed = (error) => ({
  type: GET_COURSE_FAILED,
  payload: error
});

export const getCourse = () => async (dispatch, getState) => {
  dispatch(getCourseStart());
  const result = await get(`https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd`).catch(e => console.log(e));
  try {
    dispatch(getCourseSuccess(result.data));
  } catch (e) {
    dispatch(getCourseFailed(e));
  }
};
