import CatalogueFilter from "./CatalogueFilter/CatalogueFilter";
const Catalogue = () => {
    return <div className="flex w-full h-full catalogue">
          <div className="w-1/2 border-r border-black border-solid">
              <CatalogueFilter />
          </div>
          <div className="w-1/2"></div>
    </div>
}

export default Catalogue;