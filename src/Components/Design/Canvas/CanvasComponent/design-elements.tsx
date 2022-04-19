
import { FC, Fragment, useEffect, useState } from "react";

import getDesignElements from "./api-requests/get-design-elements";
import UploadButton from "./components/upload-button";
import TopBar from "./components/top-bar";
import setDesignElement from "./api-requests/set-design-element";
import UploadPopup from "./components/upload-popup";
import { Loader } from "@fulhaus/react.ui.loader";



export type IDesignElements = {
    onSelect: (imageURL: string, name: string) => void;
}


const DesignElements: FC<IDesignElements> = ({ onSelect }) => {

    const [allDesignElements, setAllDesignElements] = useState<any>();
    const [allDesignElementCategories, setAllDesignElementCategories] = useState<any>();
    const [selectedDesignElementCategory, setSelectedDesignElementCategory] = useState<any>({ _id: "all" });
    const [uploadedImage, setUploadedImage] = useState<File>();
    const [uploadedImageCategory, setUploadedImageCategory] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllDesignElements();

    }, []);

    const getAllDesignElements = async () => {
        setLoading(true);
        const allDesignElementsResponse = await getDesignElements();
        if (allDesignElementsResponse.success) {
            setAllDesignElements(allDesignElementsResponse?.response?.data?.elements);
            setAllDesignElementCategories(allDesignElementsResponse?.response?.data?.categories);
        }

        setLoading(false);
    }

    const convertImageFileToBase64 = async (imageFile: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => resolve((reader.result as string).split("base64,")[1]);
            reader.onerror = reject;
        });
    }

    const handleAddDesignElement = async () => {
        if (uploadedImage && uploadedImageCategory) {
            setLoading(true);
            const imageBase64: any = await convertImageFileToBase64(uploadedImage);
            const setDesignElementResponse = await setDesignElement({ imageURL: imageBase64, category: uploadedImageCategory });
            if (setDesignElementResponse.success) await getAllDesignElements();
            setUploadedImage(undefined);
            setUploadedImageCategory(undefined);
            setLoading(false);
        }
    }



    return (
        <div className="fixed bottom-0 left-0 w-screen p-2 bg-cream">
            <TopBar allDesignElementCategories={allDesignElementCategories} selectedDesignElementCategory={selectedDesignElementCategory} onSelect={setSelectedDesignElementCategory} />
            <div className="w-full overflow-scroll whitespace-nowrap">
                {loading ? <div className="flex items-center justify-center w-full h-32">
                    <Loader />
                </div> :
                    <>
                        <UploadButton onUpload={setUploadedImage} />
                        {allDesignElements?.filter((allDesignElement: any) => selectedDesignElementCategory?._id === "all" || allDesignElement?.category?._id === selectedDesignElementCategory?._id)?.map((designElement: any) =>
                            <div key={designElement._id} className="inline-block ml-8 border-2 border-black cursor-pointer w-36 h-36 hover:border-primaryHover" onClick={() => {
                                onSelect(designElement?.imageURL, designElement?.category?.name)
                            }}>
                                <img className="object-contain w-full h-full " src={designElement?.imageURL} alt={`${designElement.category?.name} design element`} />
                            </div>)}
                    </>
                }
            </div>
            {uploadedImage && <UploadPopup
                uploadedImage={uploadedImage}
                uploadedImageCategory={uploadedImageCategory}
                allDesignElementCategories={allDesignElementCategories}
                onChangeImageCategory={(v) => setUploadedImageCategory(v)}
                onClose={() => setUploadedImage(undefined)}
                onAdd={handleAddDesignElement} />}
        </div>
    )
}

export default DesignElements;