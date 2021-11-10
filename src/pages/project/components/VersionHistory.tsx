import { ReactComponent as ExitIcon } from '../../../styles/images/exit.svg'

type VersionHistoryType = {
    close: () => void
}
const VersionHistory = ({close}:VersionHistoryType) => {
    return <div className='fixed right-0 z-10 w-1/4 h-full px-4 py-4 border-l border-black border-solid bg-sand'>
        <div className='flex'>
            <div className='text-2xl uppercase font-moret'>version history</div>
            <ExitIcon onClick={()=>close()} className='my-auto ml-auto cursor-pointer' />
        </div>
    </div>
}

export default VersionHistory