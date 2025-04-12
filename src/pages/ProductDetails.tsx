import toast from "react-hot-toast";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useProductDetailsQuery } from "../redux/api/productApi";
import { RootState, server } from "../redux/store";
import { CustomError } from "../types/apiTypes";
import { CartItem } from "../types/types";
import { Skeleton } from "../components/Loader";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { data, isLoading, isError, error } = useProductDetailsQuery(id!);

  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const existingCartItem = cartItems.find((item) => item.productId === id);
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    } else {
      setQuantity(0);
    }
  }, [cartItems, id]);

  const addToCartHandler = (product: any) => {
    if (product.stock < 1) {
      return toast.error("Out of Stock");
    }
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      photo: product.photo,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  const incrementHandler = (product: any) => {
    if (quantity >= product.stock) {
      toast.error("Quantity limit exceeded");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        photo: product.photo,
        price: product.price,
        quantity: quantity + 1,
        stock: product.stock,
      })
    );
    setQuantity((prev) => prev + 1);
    toast.success("Quantity increased!");
  };

  const decrementHandler = (product: any) => {
    if (quantity <= 1) {
      toast.error("Product quantity can't be less than 1");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        quantity: quantity - 1,
        name: product.name,
        photo: product.photo,
        price: product.price,
        stock: product.stock,
      })
    );
    setQuantity((prev) => prev - 1);
    toast.success("Quantity decreased!");
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    setQuantity(0);
    toast.success("Item removed from cart!");
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const product = data?.product!;

  return (
    <>
    
      {isLoading ? (
        <Skeleton
          className="skeleton w-full h-[35rem] rounded-lg "
          flex="flex flex-row gap-3 p-12 justify-center items-center "
          length={1}
        />
      ) : (
        <div className="flex container mx-auto px-4 py-8 justify-center">
          <div className="bg-gray-100 rounded-md shadow-lg w-full md:items-center justify-center flex flex-col md:flex-row md:w-[80%]">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img
                src={`${server}/${product.photo!}`}
                alt={product.name}
                className="w-full rounded-lg shadow-lg border-t-2 border-t-gray-100"
              />
            </div>
            <div className="md:w-1/2 md:p-0 p-2">
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

              <span className="flex text-xl font-bold text-gray-800 mb-4">
                Price:&nbsp;
                <p className="font-semibold text-gray-600">₹{product.price}</p>
              </span>

              <span className="flex text-md font-bold text-gray-800 mb-4">
                Stock:&nbsp;
                <p className="font-semibold text-gray-500">
                  {product.stock === 0 ? "Out of Stock" : product.stock}
                </p>
              </span>
              <div className="flex items-center mb-4">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCartHandler(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full"
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        className="duration-300 bg-gray-200 hover:bg-[#ff0000a4] p-1 rounded cursor-pointer"
                        onClick={() => decrementHandler(product)}
                      >
                        <FaMinus />
                      </button>
                      <p>{quantity}</p>
                      <button
                        className="duration-300 bg-gray-200 hover:bg-[#79d21289] p-1 rounded cursor-pointer"
                        onClick={() => incrementHandler(product)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      className="bg-transparent flex text-[1.2rem] cursor-pointer duration-300 hover:text-red-500"
                      onClick={() => removeHandler(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <div className=" flex text-sm text-gray-500">
                <p className="font-bold text-gray-800">Category:&nbsp;</p>{" "}
                {product.category.toUpperCase()}
              </div>
              <div className="flex text-sm mt-3 text-gray-800 font-bold mb-2">
                Share:
                <div className="flex mt-1">
                  <a href="#" className="ml-2 ">
                    <FaFacebook className="text-[16px]" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaLinkedin className="text-[16px]" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaInstagram className="text-[16px]" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaWhatsapp className="text-[16px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
