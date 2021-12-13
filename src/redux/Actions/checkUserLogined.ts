import apiRequest from '../../Service/apiRequest'
import {APP_ACCOUNTS_URL } from '../../Constant/url.constant'
const checkUserLogined = (redirectURL: string) => async (dispatch: any) => {
    const res = await apiRequest({
      url: '/account/user',
      method: 'GET'
    })
    if (!res?.success) {
      window.location.assign(`${APP_ACCOUNTS_URL}/login?redirectURL=${redirectURL}`)
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

