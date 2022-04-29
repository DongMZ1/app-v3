import { Button } from "@fulhaus/react.ui.button";
import { useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineFullscreenExit } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getQuoteDetailAndUpdateSelectedUnit } from '../../../../redux/Actions';
import apiRequest from '../../../../Service/apiRequest';
import { Tappstate } from '../../../../redux/reducers'
import { Loader } from "@fulhaus/react.ui.loader";

const convertImageFileToBase64 = async (imageFile: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => resolve((reader.result as string).split("base64,")[1]);
        reader.onerror = reject;
    });
}

type TSmartPopulate = {
    onClose: () => void;
    eachRoom: any
}
const SmartPopulate = ({ onClose, eachRoom }: TSmartPopulate) => {
    const [file, setfile] = useState<any>(undefined);
    const [step, setstep] = useState<'Step 1' | 'Step 2'>('Step 1');
    const [roomType, setroomType] = useState<'bed' | 'living' | 'dining'>('bed');
    const [loading, setloading] = useState(false);
    const currentOrgID = useSelector((state: Tappstate) => state?.currentOrgID);
    const quoteID = useSelector((state: Tappstate) => state.quoteDetail)?._id;
    const unitID = useSelector((state: Tappstate) => state.selectedQuoteUnit)?.unitID;
    const selectedQuoteUnit = useSelector((state: Tappstate) => state.selectedQuoteUnit);
    const projectID = useSelector((state: Tappstate) => state.selectedProject)?._id;

    const pupolate = async () => {
        setloading(true)
    }

    return <div className='relative flex flex-col items-center justify-center border border-black border-solid bg-cream w-80vw h-80vh'>
        <AiOutlineFullscreenExit onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer" />
        {
            loading && <Loader />
        }
        {!loading && <>
            {step === 'Step 1' && <>
                <input accept="image/*" type='file' onChange={(e) => setfile(e.target.files?.[0])} className='hidden' id='smart-populate-image-upload' ></input>
                {
                    file && <div className="flex mb-8 border border-black border-solid">
                        <><img className="object-contain h-64 w-80 " alt='smart-populate-preview-img' src={URL.createObjectURL(file)} />
                            <div className="flex h-64 px-6 bg-white w-80">
                                <div className="my-auto text-sm">{file?.name}</div> <RiDeleteBin5Line onClick={() => setfile(undefined)} className="my-auto ml-auto cursor-pointer" color="red" />
                            </div></>
                    </div>
                }
                {file ? <div>
                    <button onClick={() => setstep('Step 2')} className="flex h-12 font-sans font-semibold text-white w-160 bg-alert"><div className="m-auto">Next</div></button>
                </div> :
                    <div>
                        <Button onClick={() => {
                            document.getElementById('smart-populate-image-upload')?.click()
                        }} className="h-12 w-160"><span className="px-8 py-1">UPLOAD IMAGE FROM COMPUTER</span></Button>
                    </div>
                }
            </>}
            {
                step === 'Step 2' && <div className="w-160">
                    <div className="flex w-full text-4xl font-moret"><div className="mx-auto">Which Room are you looking to populate</div></div>
                    <div className="flex w-full mt-8">
                        <div onClick={() => setroomType('living')} className={`flex w-40 ${roomType === 'living' ? ' bg-black text-white' : ''} h-12 border border-black border-solid cursor-pointer`}><div className="m-auto text-sm font-bold font-neu">LIVING ROOM</div></div>
                        <div onClick={() => setroomType('dining')} className={`flex mx-auto w-40 ${roomType === 'dining' ? ' bg-black text-white' : ''} h-12 border border-black border-solid cursor-pointer`}><div className="m-auto text-sm font-bold font-neu">DINING ROOM</div></div>
                        <div onClick={() => setroomType('bed')} className={`flex w-40 ${roomType === 'bed' ? ' bg-black text-white' : ''} h-12 border border-black border-solid cursor-pointer`}><div className="m-auto text-sm font-bold font-neu">BEDROOM</div></div>
                    </div>
                    <button onClick={() => pupolate()} className="flex h-12 mt-8 font-sans font-semibold text-white w-160 bg-alert"><div className="m-auto">POPULATE</div></button>
                </div>
            }
        </>}
    </div>
}

export default SmartPopulate