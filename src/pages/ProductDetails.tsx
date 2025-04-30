import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgCloseO } from "react-icons/cg";
import { FaEdit, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegStar,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import RatingsComponent from "../components/Ratings";
import {
  useDeleteReviewMutation,
  useNewReviewMutation,
  useProductAllReviewsQuery,
  useProductDetailsQuery,
} from "../redux/api/productApi";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { CartItem } from "../types/types";
import { responseToast } from "../utils/features";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { data, isLoading, isError } = useProductDetailsQuery(id!);
  const { data: reviewData, isLoading: reviewLoading } =
    useProductAllReviewsQuery(id!);
  console.log(reviewData);
  // console.log(cartItems);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [createReview] = useNewReviewMutation();
  const [reviewDelete] = useDeleteReviewMutation();

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);
  const [reviewCommment, setReviewComment] = useState<string>("");

  // console.log(reviewCommment)

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
      photo: product?.photos?.[0]?.url || "",
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
        photo: product?.photos?.[0]?.url || "",
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
        photo: product?.photos?.[0]?.url || "",
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
    return <Navigate to={"/404"} />;
  }

  const product = data?.product!;

  const NextButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowRightLong />
    </button>
  );
  const PrevButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowLeftLong />
    </button>
  );

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      gap: "0.5rem",
      cursor: "pointer",
      justifyContent: "flex-start",
    },
  });

  const submitReviewHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setReviewOpen(false);

    //Api call to submit review
    const res = await createReview({
      comment: reviewCommment,
      rating: rating,
      productId: id!,
      userId: user?._id,
    });

    responseToast(res, null, "");
  };

  // const reviewUserId = reviewData?.reviews.find((review) => review.user);

  const deleteReviewHandler = async (reviewId: string) => {
    setReviewOpen(false);

    //Api call to delete review
    const res = await reviewDelete({
      reviewId,
      userId: user?._id,
    });

    setReviewComment("");
    setRating(0);

    responseToast(res, null, "");
  };

  return (
    <>
      <div className="product-details">
        {isLoading ? (
          <Skeleton
            className="skeleton w-full h-[35rem] rounded-lg "
            flex="flex flex-row gap-3 p-12 justify-center items-center "
            length={1}
          />
        ) : (
          <main className="flex md:flex-row flex-col shadow-lg rounded-md border-t-[1px] border-t-gray-100 md:shadow-none md:border-0 max-w-[1920px] w-full h-full m-auto gap-[2rem]">
            <section className="mt-2 md:w-[40%] mb-[4.5rem] md:mb-[20px]">
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={product?.photos.map((i) => i.url) || []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={product?.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section className="px-4 md:w-[60%] md:mt-2 mt-[10px]">
              <h1 className="md:text-[2.5rem] md:mb-[1rem] mb-[10px] text-[1.5rem]">
                {product?.name}
              </h1>
              <code className="text-[12px] md:text-[1rem] bg-blue-500 text-white rounded-[10px] p-[0.3rem] md:p-[0.4rem] ">
                {product?.category}
              </code>
              <em className="flex mt-[1rem] items-center gap-2 md:text-[1.2rem] text-[1rem] font-semibold text-gray-500 mb-[10px]">
                <RatingsComponent value={product?.ratings || 0} />(
                {product?.numOfReviews || ""} reviews)
              </em>
              <h3 className="text-[1.5rem] md:text-[2rem] mb-[10px]">₹{data?.product?.price}</h3>

              <span className="flex text-[14px] md:text-lg font-bold text-gray-800 mb-4">
                Stock:&nbsp;
                <p className="font-semibold text-gray-600">
                  {product.stock === 0 ? "Out of Stock" : product.stock}
                </p>
              </span>

              <div className="flex items-center mb-4">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCartHandler(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold md:text-[1rem] text-[12px] py-2 px-4 cursor-pointer rounded-full"
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        className="duration-300 bg-gray-200 hover:bg-[#ff0000a4] text-[12px] md:text-[1rem] p-2 rounded cursor-pointer"
                        onClick={() => decrementHandler(product)}
                      >
                        <FaMinus />
                      </button>
                      <p>{quantity}</p>
                      <button
                        className="duration-300 bg-gray-200 hover:bg-[#79d21289] text-[12px] md:text-[1rem] p-2 rounded cursor-pointer"
                        onClick={() => incrementHandler(product)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      className="bg-transparent flex text-[1.2rem] cursor-pointer duration-300 hover:text-red-500"
                      onClick={() => removeHandler(product._id)}
                    >
                      <FaTrash className="text-[1.4rem] md:text-[1.6rem]" />
                    </button>
                  </div>
                )}
              </div>

              <p className="md:text-[1.2rem] text-[14px] my-4 mx-0 font-light tracking-widest leading-relaxed">
                {data?.product?.description}
              </p>

              <div className="flex text-sm mt-3 text-gray-800 font-bold mb-2">
                Share:
                <div className="flex mt-1">
                  <a href="#" className="ml-2 ">
                    <FaFacebook className="text-[16px] hover:scale-125 duration-300 ease-in" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaLinkedin className="text-[16px] hover:scale-125 duration-300 ease-in" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaInstagram className="text-[16px] hover:scale-125 duration-300 ease-in" />
                  </a>
                  <a href="#" className="ml-2">
                    <FaWhatsapp className="text-[16px] hover:scale-125 duration-300 ease-in" />
                  </a>
                </div>
              </div>
            </section>
          </main>
        )}

        {reviewOpen === true && (
          <dialog open={reviewOpen}>
            <div
              id="reviewbox"
              className="fixed inset-0  z-50 flex items-center justify-center "
            >
              <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[40%]">
                <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                <form
                  onSubmit={submitReviewHandler}
                  className="flex flex-col gap-4"
                >
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Rating:</span>
                    <RatingsEditable />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Comment:</span>
                    <textarea
                      value={reviewCommment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="border border-gray-500 outline-0 rounded-md p-2"
                      placeholder="Write your review here..."
                    ></textarea>
                  </label>

                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 duration-300 cursor-pointer text-white font-semibold py-2 px-4 rounded-full"
                  >
                    Submit Review
                  </button>
                </form>
                <button
                  onClick={() => {
                    setReviewOpen(false);
                    setRating(0);
                    setReviewComment("");
                  }}
                  className="absolute top-2 right-2"
                >
                  <CgCloseO className="text-[1.5rem] text-gray-800 hover:text-red-700 duration-300 cursor-pointer" />
                </button>
              </div>
            </div>
          </dialog>
        )}
        <section className="rounded-md bg-violet-100 max-w-[1920px] w-full m-auto mt-[30px] py-8 px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-mono md:text-2xl font-semibold text-gray-700 mb-6">
              Customer Reviews
            </h2>
            {user && (
              <button
                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-purple-600 hover:bg-purple-700 duration-300 text-white font-semibold py-1 px-2 md:py-2 md:px-4 rounded-full mb-1 cursor-pointer -mt-5"
                onClick={() => setReviewOpen(!reviewOpen)}
              >
                <FaEdit />
              </button>
            )}
          </div>

          {reviewLoading ? (
            <div className="flex justify-center items-center">
              <Skeleton
                className="skeleton w-full max-w-[36rem] h-[11rem] rounded-lg"
                flex="flex flex-col gap-3 p-1"
                length={2}
              />
            </div>
          ) : (
            <div className="p-1">
              {reviewData?.reviews.length === 0 && (
                <div className="flex justify-center items-center">
                  <h2 className="text-2xl font-semibold text-red-700 mb-6">
                    No Reviews Available❌
                  </h2>
                </div>
              )}
              {reviewData?.reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex flex-col h-full max-w-[36rem] w-full bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-300 mb-[20px] "
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        review?.user.photo ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s"
                      }
                      alt="user"
                      className="w-[2rem] h-[2rem] md:w-10 md:h-10 rounded-full object-cover border border-gray-300 mr-3"
                    />
                    <div>
                      <h3 className="text-[14px] md:text-lg font-semibold text-gray-800">
                        {review.user.name}
                      </h3>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-[1rem] text-sm font-semibold text-yellow-500">
                    <RatingsComponent value={review.rating || 0} />
                  </span>

                  <div className=" text-[12px] md:text-[18px] px-[1rem] mt-[5px] text-gray-700 leading-relaxed grow">
                    <p>{review.comment}</p>
                  </div>

                  <div className="flex items-center mt-4 w-full justify-end">
                    {user?._id === review.user._id && (
                      <button
                        onClick={() => deleteReviewHandler(review._id)}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-red-700 duration-300 cursor-pointer text-[12px] md:text-[1rem] text-white font-semibold py-1 px-2 md:py-2 md:px-4 rounded-md"
                      >
                       <FaTrash /> Delete 
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProductDetails;
