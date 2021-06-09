import productModel, {
  ProductDocument,
  ReviewDocument,
} from '../models/product'

type InputData = {
  title: string
  description: string
  category: string
  countInStock: number
  price: number
  color: string
  size: string
  generalRating: number
}

type FindAllType = () => Promise<ProductDocument[]>
type FindOneProductType = (productId: string) => Promise<ProductDocument>
type CreateProductType = (
  inputProduct: ProductDocument
) => Promise<ProductDocument>
type UpdateProductType = (
  productId: string,
  inputData: InputData
) => Promise<ProductDocument>
type CreateReviewType = (
  productId: string,
  inputData: ReviewDocument
) => Promise<ProductDocument>
type DeleteProductType = (productId: string) => Promise<ProductDocument | null>

const findAllProducts: FindAllType = () => {
  return productModel.find().exec()
}

const findOneProduct: FindOneProductType = async (productId: string) => {
  try {
    const product = await productModel.findById(productId).exec()
    if (!product) {
      throw new Error(`Product ${productId} not found`)
    }
    return product
  } catch (error) {
    throw new Error(error.message)
  }
}

const createProduct: CreateProductType = (inputProduct: ProductDocument) => {
  return inputProduct.save()
}

const createReview: CreateReviewType = async (
  productId: string,
  inputData: ReviewDocument
) => {
  try {
    const product = await productModel.findById(productId).exec()

    if (!product) {
      throw new Error(`Product ${productId} not found`)
    }

    const review: Partial<ReviewDocument> = {
      name: inputData.name,
      comment: inputData.comment,
      rating: inputData.rating,
    }

    product.reviews.push(review as ReviewDocument)
    product.generalRating =
      product.reviews.reduce((a, b) => b.rating + a, 0) / product.reviews.length

    return product.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateProduct: UpdateProductType = async (
  productId: string,
  inputData: InputData
) => {
  try {
    const product = await productModel.findOne({ _id: productId }).exec()

    if (!product) {
      throw new Error(`Product ${productId} not found`)
    }
    if (inputData.title) {
      product.title = inputData.title
    }
    if (inputData.description) {
      product.description = inputData.description
    }
    if (inputData.category) {
      product.category = inputData.category
    }
    if (inputData.countInStock) {
      product.countInStock = +inputData.countInStock
    }
    if (inputData.price) {
      product.variant.price = +inputData.price
    }
    if (inputData.color) {
      product.variant.color = inputData.color
    }
    if (inputData.price) {
      product.variant.size = inputData.size
    }
    return product.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteProduct: DeleteProductType = (productId: string) => {
  return productModel.findByIdAndDelete(productId).exec()
}

export default {
  findAllProducts,
  findOneProduct,
  createProduct,
  createReview,
  updateProduct,
  deleteProduct,
}
