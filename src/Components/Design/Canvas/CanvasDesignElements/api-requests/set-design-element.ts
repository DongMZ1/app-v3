import axios from 'axios';
import { APP_API_URL } from '../../../../../Constant/url.constant';
interface ISetDesignElement
{
    id?: string,
    imageURL: string,
    category: string
}

const setDesignElement = async ({id, imageURL, category}:ISetDesignElement) =>
{
    try
    {
        const response = await axios.post(`${APP_API_URL}/api/fhapp-service/design/canvas/design-element`, {id, imageURL, category});
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
};

export default setDesignElement;

