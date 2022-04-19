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
    <div onClick={() => document.getElementById('#upload-new-design-element')?.click()} className="flex items-center justify-center border-2 border-black border-dashed cursor-pointer design-element-0-0-auto w-36 h-36 hover:border-primaryHover">
      <FiPlus className="w-10 h-10 m-auto" />
      <input
        id='#upload-new-design-element'
        className='inset-0 hidden opacity-0 cursor-pointer'
        type='file'
        accept='.png, .jpg, .jpeg'
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadButton;
