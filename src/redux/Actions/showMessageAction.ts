const showMessageAction = (show: boolean, message: string) => (dispatch: any) => {
    dispatch({
        type: 'modalMessage',
        payload: message
      })
      dispatch(
        {
          type: 'showModal',
          payload: show
        }
      )
}

export default showMessageAction;