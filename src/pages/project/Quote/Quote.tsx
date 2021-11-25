import './Quote.scss'
import { ReactComponent as AddUnitIcon } from "../../../styles/images/add-a-unit-to-get-start.svg";
const Quote = () => {
    return <div className='flex quote'>
        <div className='h-full'></div>
        {true ?
            <div className='flex w-full h-full'>
                <div className='m-auto'>
                    <AddUnitIcon />
                    <div className='flex text-4xl font-moret'><div className='mx-auto'>Add a unit to get started</div></div>
                </div>
            </div> : <div> </div>
        }
    </div>
}

export default Quote;