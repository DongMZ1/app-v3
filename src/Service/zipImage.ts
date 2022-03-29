import JSZip from 'jszip';
import axios from 'axios';
import mime from 'mime-db';
import { APP_API_URL } from '../Constant/url.constant';


export interface IImageData
{
  imageURL: string,
  name: string
}

interface IZipImagesAsBlob
{
  imageData: IImageData[];
  zipFileName: string;
}


const zipImagesAsBlob = async ({
  imageData,
  zipFileName
}: IZipImagesAsBlob) =>
{
  let zippedDownload: any;

  try {
    const zip = new JSZip();
    const imageFiles = zip.folder(zipFileName);

    for (const imageDataInfo of imageData)
    {
      const response = await axios.get(`${APP_API_URL}/download-image?imageURL=${encodeURIComponent(imageDataInfo.imageURL)}`, { responseType: "blob" });
      const imageBlob = response.data;
      const imageExtension = mime[imageBlob.type]?.extensions?.[0];
      imageFiles?.file(`images/${imageDataInfo.name}.${imageExtension}`, imageBlob);
    }

    zippedDownload = await zip.generateAsync({ type: 'blob' });

    if (!zippedDownload)
      return {
        success: false,
        message: 'Error: Unable to generate zipped download',
      };

    return {
      success: true,
      message: 'Zipped Download generated',
      download: zippedDownload,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `${error.message}`,
    };
  }
};

export default zipImagesAsBlob;

