import { APP_API_URL, APP_ACCOUNTS_URL } from '../Constant/url.constant'
interface IApiRequest {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any | FormData;
  isFileUpload?: boolean;
}

//A helper function to handle api requests and response
const apiRequest = async ({
  url,
  method,
  body,
  isFileUpload = false,
}: IApiRequest) => {
  let apiURL = APP_API_URL + url;

  let params: any = {};
  if (method === "GET")
    params = {
      method: method,
      credentials: "include",
    }; //GET requests do not include headers and body

  if (method !== "GET") {
    params = {
      method: method,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      body: isFileUpload ? body : JSON.stringify(body),
    }; //POST|PATCH|DELETE can include headers and body

    //If it is NOT a file upload set header "Content-Type" to "application/json"; file uploads are usually form data not json
    if (!isFileUpload) params.headers["Content-Type"] = "application/json";
  }

  try {
    const RESPONSE = await fetch(apiURL, params);
    if ((Response as any)?.status === 401) {
      window.location.assign(`${APP_ACCOUNTS_URL}/login?redirectURL=${window.location.href}`)
    }
    return RESPONSE.json();
  } catch (error: any) {
    console.error(`apiRequest: ${error.message}`);
    return {
      success: false,
      message: "Could not connect to the server",
    };
  }
};

export default apiRequest;
