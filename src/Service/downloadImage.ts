import cloneDeep from 'lodash.clonedeep'
import zipImagesAsBlob from './zipImage'
import fileSaver from 'file-saver'
const handleDownloadImages = async (designItems: any[]) =>
    {
        const copyOfDesignItems = cloneDeep(designItems ?? []);
            const designItemImageData: any = copyOfDesignItems?.map((dd) =>
            {
                return {
                    imageURL: dd.value,
                    name: dd.name
                };
            });
            const zippedDownloadBlobResponse = await zipImagesAsBlob({ imageData: designItemImageData, zipFileName: "canvas-images" }); 

            if (!zippedDownloadBlobResponse.success) return console.log(zippedDownloadBlobResponse.message);
            fileSaver.saveAs(zippedDownloadBlobResponse.download, `canvas-images-download.zip`);        
        
    }
export default handleDownloadImages;