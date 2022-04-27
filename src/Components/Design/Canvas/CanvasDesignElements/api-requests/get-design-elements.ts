import axios from 'axios';
import { APP_API_URL } from '../../../../../Constant/url.constant';
const getDesignElements = async() =>
{
    try
    {
        const response = await axios.get(`${APP_API_URL}/api/fhapp-service/design/canvas/design-elements`, { withCredentials: true });
        return {
            success: true,
            response
        }  
    } catch (error:any)
    {
        return {
            success: false,
            message: `Error: ${error.message}`
        }
    }
}

export default getDesignElements;