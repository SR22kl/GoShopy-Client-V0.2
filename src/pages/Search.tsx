import { useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useProductCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import { CustomError } from "../types/apiTypes";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const {
    data: searchedData,
    isLoading: productLoading,
    isError: productSearchError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    category,
    page,
    price: maxPrice,
    sort,
  });
  // console.log(searchedData);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  const isprevPage = page > 1;
  const isnextPage = searchedData?.totalPage
    ? page < searchedData.totalPage
    : false;

  const {
    data: categoriesResponse,
    isError,
    isLoading: loadingCategories,
    error,
  } = useProductCategoriesQuery("");

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productSearchError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }
  return (
    <>
      <div
        className="p-4 md:p-[2rem] flex flex-col md:flex-row justify-start items-stretch gap-4 md:gap-[2rem] min-h-[calc(100vh-6.5vh)]"
        id="searchProducts"
      >
        <aside className="w-full mb-[20px] md:w-[16rem] flex flex-col gap-2 md:gap-[1rem] justify-start items-stretch border-1 p-4 md:p-[2rem] border-gray-200 shadow-lg rounded-lg">
          <h2 className="text-lg md:text-[1.4rem] font-[400] uppercase">
            Filters
          </h2>
          <div className="flex flex-col gap-[0.5rem] w-full">
            <label className="font-[400] text-sm md:text-base">Sort</label>
            <select
              className="p-2 md:p-[10px] border-1 border-gray-200 shadow-md rounded outline-none cursor-pointer text-sm md:text-base"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">None</option>
              <option value="asc">Price(Low to High)</option>
              <option value="desc">Price(High to Low)</option>
            </select>
          </div>
          <div className="flex flex-col gap-[0.5rem] w-full">
            <label className="font-[400] text-sm md:text-base">
              Max-Price: {maxPrice || ""}
            </label>
            <input
              type="range"
              min={100}
              max={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-[0.5rem] w-full">
            <label className="font-[400] text-sm md:text-base">Category</label>
            <select
              className="p-2 md:p-[10px] border-1 border-gray-200 shadow-md rounded outline-none cursor-pointer text-sm md:text-base"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">ALL</option>
              {!loadingCategories &&
                categoriesResponse?.categories.map((i) => (
                  <option key={i} value={i}>
                    {i.toLocaleUpperCase()}
                  </option>
                ))}
            </select>
          </div>
        </aside>

        <main className="flex flex-col py-0 px-4 md:px-[2rem] gap-4 md:gap-[1rem] w-full">
          <h1 className="uppercase text-xl md:text-3xl">Products</h1>
          <div className="ml-0 md:ml-[20px] w-full">
            <input
              className="w-full p-2 md:p-[10px] border-1 border-gray-200 shadow-md rounded-lg outline-none cursor-pointer text-sm md:text-base"
              type="text"
              placeholder="Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button>Search</button> */}
          </div>

          {productLoading ? (
            <div className="flex justify-start gap-3 items-start flex-wrap h-[calc(100%-8rem)] overflow-y-auto">
              <Skeleton
                className="skeleton w-[calc(50%-6px)] md:w-[18.75rem] h-[18rem] md:h-[25rem] rounded-lg"
                flex="flex flex-col md:flex-row gap-3"
                length={6}
              />
            </div>
          ) : (
            <div className="flex justify-start gap-2 md:gap-3 items-start flex-wrap h-[calc(100%-8rem)] overflow-y-auto">
              {searchedData?.products.map((i) => (
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
              ))}
              {searchedData?.products.length === 0 && !productLoading && (
                <p className="text-gray-500">
                  No products found matching your search criteria.
                </p>
              )}
            </div>
          )}

          {searchedData && searchedData.totalPage > 1 && (
            <article className="flex items-center justify-center gap-2 md:gap-[0.5rem] mt-4">
              <button
                className="flex px-4 md:px-[20px] py-2 md:py-[10px] border-1 border-gray-200 shadow-md rounded-lg outline-none cursor-pointer duration-300 hover:text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base"
                disabled={!isprevPage}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {"< Prev"}
              </button>
              <span className="text-sm md:text-base">
                {page} of {searchedData.totalPage}
              </span>
              <button
                className="flex px-4 md:px-[20px] py-2 md:py-[10px] border-1 border-gray-200 shadow-md rounded-lg outline-none cursor-pointer duration-300 hover:text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base"
                disabled={!isnextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {"Next >"}
              </button>
            </article>
          )}
        </main>
      </div>
    </>
  );
};

export default Search;
