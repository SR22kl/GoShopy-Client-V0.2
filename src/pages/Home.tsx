import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  if (isError) toast.error("Cannot Fetch Products Data from Server");
  return (
    <>
      <div
        className="flex flex-col w-full py-[2rem] px-[5%] h-[cal(100vh-4rem)]"
        id="home"
      >
        <section id="bannerSection"></section>

        <h1 className="mt-[3rem] flex flex-row justify-between items-center uppercase text-[20px] leading-1 font-[400] mb-[20px]">
          Latest Products
          <Link to="/search" className="text-[1rem]">
            More
          </Link>
        </h1>

        <main id="mainProducts">
          {isLoading ? (
            <>
              <Skeleton
                className="skeleton w-[18.75rem] h-[25rem] rounded-lg"
                flex="flex flex-row gap-3"
                length={3}
              />
            </>
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                category={i.category}
                price={i.price}
                stock={i.stock}
                photo={i.photo}
                handler={addToCartHandler}
              />
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
