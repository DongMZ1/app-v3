
import { FC } from "react";

import { FiX } from "react-icons/fi";

import { TextInput } from "@fulhaus/react.ui.text-input";
import { Button } from "@fulhaus/react.ui.button";




export type IUploadPopup = {
    uploadedImage: File;
    uploadedImageCategory: string | undefined;
    allDesignElementCategories: any;
    onChangeImageCategory: (value: string | undefined) => void;
    onClose: () => void;
    onAdd: () => void;
}


const UploadPopup: FC<IUploadPopup> = ({uploadedImage, uploadedImageCategory, allDesignElementCategories, onChangeImageCategory, onClose, onAdd}) =>
{


    return (
         <div className="fixed z-50 inset-0 flex justify-center items-center bg-opacity-50 bg-black p-10"><div className="relative flex flex-col bg-white p-10 h-3/4 w-2/4">
                <FiX className="absolute top-2 right-2 text-xl cursor-pointer" onClick={onClose} />
                <img src={URL.createObjectURL(uploadedImage)} alt="uploaded design element" className="w-full h-3/4 object-contain"  />
                <div className="relative mt-8">
                    <div className="flex items-end">
                        <TextInput
                            className="flex-1"
                            variant="box"
                            label="Design Element Category"
                            placeholder="Enter design element category"
                            inputName="category"
                            value={uploadedImageCategory ?? ""}
                            onChange={(e) => onChangeImageCategory((e.target as any).value)}
                            required
                        />
                        <Button       
                            variant={'primary'}
                            className="ml-8 cursor-pointer mb-2 h-10"
                            onClick={onAdd}
                        >
                            Add
                        </Button>
                    </div>
                <div className="absolute top-full -left-10 -right-10 bg-white max-h-32 overflow-scroll">
                    {allDesignElementCategories?.filter((designElementCategory: any) => designElementCategory.name.includes(uploadedImageCategory))?.map((allDesignElementCategory: any) => <p key={allDesignElementCategory._id} className="cursor-pointer py-2 px-10 hover:bg-primaryHover" onClick={()=>onChangeImageCategory(allDesignElementCategory.name)}>{allDesignElementCategory.name}</p>)}
                </div>
                </div>
            </div></div>
    )
}

export default UploadPopup;