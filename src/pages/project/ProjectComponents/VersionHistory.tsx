import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'

type VersionHistoryType = {
    close: () => void
}
const VersionHistory = ({ close }: VersionHistoryType) => {
    return <div className='fixed top-0 z-10 flex w-full h-full bg-black bg-opacity-50'>
        <div className='w-3/4 h-full' onClick={()=>close()}></div>
        <div className='z-10 w-1/4 h-full px-4 py-4 overflow-auto border-l border-black border-solid bg-cream'>
            <div className='flex'>
                <div className='text-2xl uppercase font-moret'>version history</div>
                <ExitIcon onClick={() => close()} className='my-auto ml-auto cursor-pointer' />
            </div>
        </div>
    </div>
}

export default VersionHistory