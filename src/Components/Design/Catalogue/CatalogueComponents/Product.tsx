import { AppV3FurnitureCard } from '@fulhaus/react.ui.product-card-app'
type ProductProp = {
    eachProduct: any;
}
const Product = ({eachProduct} : ProductProp) => {
    return <div className='w-1/3 px-2'>
          <AppV3FurnitureCard imageURLs={eachProduct?.imageURLs} inStock />
    </div>
}

export default Product;