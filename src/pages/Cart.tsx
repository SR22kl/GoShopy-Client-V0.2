import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitailState } from "../types/reducerTypes";
import toast from "react-hot-toast";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, shippingCharges, subtotal, tax, total, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitailState }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isvalid, setisValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error("Quantity limit exceeded");
      return;
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    toast.success("Quantity increased!");
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      toast.error("Product quantity can't be 0");
      return;
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    toast.success("Quantity decreased!");
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    toast.success("Item removed from cart!");
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOut = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?code=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          if (res) {
            dispatch(discountApplied(res.data.discount));
            setisValid(true);
            dispatch(calculatePrice());
          }
        })
        .catch((e) => {
          console.log(e.response?.data);
          dispatch(discountApplied(0));
          setisValid(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOut);
      cancel();
      setisValid(false);
    };
  }, [couponCode, dispatch]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  return (
    <>
      <div
        className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-[4rem] py-4 md:py-[2rem] px-4 md:px-[4rem] min-h-[calc(100vh-4rem)]"
        id="cart"
      >
        <main className="w-full md:w-2/3">
          {cartItems.length > 0 ? (
            cartItems.map((i, index) => (
              <CartItemCard
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={index}
                cartItem={i}
              />
            ))
          ) : (
            <h1 className="text-lg text-center">Your cart is empty</h1>
          )}
        </main>

        <aside className="w-full md:w-1/3 mt-0 md:mt-[100px] p-4 md:p-[4rem] flex flex-col justify-start gap-2 md:gap-[1rem] sticky top-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p className="text-sm md:text-base">Subtotal: ₹{subtotal}</p>
          <p className="text-sm md:text-base">
            Shipping Charges: ₹{shippingCharges}
          </p>
          <p className="text-sm md:text-base">
            Tax: <em className="text-red-600">₹{tax}</em>
          </p>
          <p className="text-sm md:text-base">
            Discount: <em className="text-green-600">₹{discount}</em>
          </p>
          <p className="text-lg font-semibold mt-2">
            <b>Total: ₹{total}</b>
          </p>
          <div className="flex flex-col gap-2 md:gap-[1rem] mt-4">
            <input
              className="p-2 md:p-[1rem] border-1 border-gray-400 rounded-md outline-none"
              placeholder="Coupon Code"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            {couponCode &&
              (isvalid ? (
                <span className="text-green-500 mt-[-0.5rem] flex flex-col justify-center items-center text-xs md:text-sm">
                  ₹{discount} off on coupon code: <code>"{couponCode}"</code>
                </span>
              ) : (
                <span className="text-red-500 flex flex-row justify-center items-center mt-[-0.5rem] text-xs md:text-sm">
                  <VscError className="mr-1" /> Invalid coupon code
                </span>
              ))}
            {cartItems.length > 0 && (
              <Link
                className="border p-2 md:p-[10px] text-center rounded-md bg-[#2fb4a8] text-white cursor-pointer duration-300 hover:bg-[#59938e] hover:text-gray-100 uppercase text-sm md:text-base"
                to={"/shipping"}
              >
                Checkout
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Cart;
