import { useEffect } from 'react'
import { Loader } from "@fulhaus/react.ui.loader";
import useLocationSearch from '../../Hooks/useLocationSearch'
import apiRequest from '../../Service/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, showMessageAction } from '../../redux/Actions';
import { useHistory } from 'react-router';
import { Tappstate } from '../../redux/reducers';

type VerifyEmailType = {
    setverifyUser: React.Dispatch<React.SetStateAction<boolean>>
}
const VerifyEmail = ({ setverifyUser }: VerifyEmailType) => {
    const [token] = useLocationSearch('token');
    const dispatch = useDispatch();
    const history = useHistory();
    const state = useSelector((state: Tappstate) => state)
    useEffect(() => {
        const verifyEmail = async () => {
            const res = await apiRequest(
                {
                    url: '/api/fhapp-service/organization/invite/verify/user',
                    method: 'POST',
                    body: {
                        inviteToken: token
                    }
                }
            )
            if (res?.success) {
                setverifyUser(true);
                dispatch(showMessageAction(true, 'verified !'));
                history.push('/')
            }

            if (!res?.success) {
                dispatch(showMessageAction(true, res.message));
                history.push('/');
            }
        }
        if (state.userInfo) {
            verifyEmail();
        }
    }, [state.userInfo])
    return <div className='flex w-screen h-screen bg-cream'>
        <div className='m-auto'>
            <Loader />
        </div>
    </div>
}

export default VerifyEmail;