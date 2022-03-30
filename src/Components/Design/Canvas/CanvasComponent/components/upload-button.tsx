import { FC, ChangeEvent } from 'react';
import { FiPlus } from 'react-icons/fi';


interface IUploadPad
{
  onUpload: (file: File) => void;
}

const UploadButton: FC<IUploadPad> = ({ onUpload }) =>
{

  const handleUpload = async (event: ChangeEvent) =>
  {
    event.preventDefault();
    event.stopPropagation();
    const files = [...(event.target as any).files];
    onUpload(files[0]);
  };


  return (
    <div className="relative border-2 border-dashed flex justify-center items-center w-36 h-36 border-black cursor-pointer hover:border-primaryHover">
      <FiPlus className="w-10 h-10" />
      <input
        className='absolute inset-0 cursor-pointer opacity-0'
        type='file'
        accept='.png, .jpg, .jpeg'
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadButton;
