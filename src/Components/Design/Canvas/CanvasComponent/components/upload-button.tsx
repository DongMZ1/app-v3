import { FC, ChangeEvent } from 'react';
import { FiPlus } from 'react-icons/fi';


interface IUploadPad {
  onUpload: (file: File) => void;
}

const UploadButton: FC<IUploadPad> = ({ onUpload }) => {

  const handleUpload = async (event: ChangeEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const files = [...(event.target as any).files];
    onUpload(files[0]);
  };


  return (
    <div className="items-center justify-center inline-block border-2 border-black border-dashed cursor-pointer w-36 h-36 hover:border-primaryHover">
        <FiPlus className="w-10 h-10 m-auto" />
      <input
        className='inset-0 hidden opacity-0 cursor-pointer'
        type='file'
        accept='.png, .jpg, .jpeg'
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadButton;
