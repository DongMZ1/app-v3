import './Catalogue.scss'
import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";

type CatalogueProps = {
    tabState: string
}
const Catalogue = ({tabState}:CatalogueProps) => {
    return <div className={`${tabState !== "Catalogue" && 'catalogue-display-none-important'} flex w-full h-full catalogue`}>
          <div className="w-1/2 border-r border-black border-solid">
              <CatalogueFilter />
          </div>
          <div className="w-1/2"></div>
    </div>
}

export default Catalogue;