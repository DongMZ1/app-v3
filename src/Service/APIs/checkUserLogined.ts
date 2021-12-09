import apiRequest from '../apiRequest'
import {APP_ACCOUNTS_URL } from '../../Constant/url.constant'
const checkUserLogined = () => async (dispatch: any) => {
    const res = await apiRequest({
      url: '/account/user',
      method: 'GET'
    })
    if (!res?.success) {
      window.location.assign(`${APP_ACCOUNTS_URL}/login`)
    } else {
      dispatch(
        {
          type: "userInfo",
          payload: res.data
        }
      )
    }
  }

export default checkUserLogined;

