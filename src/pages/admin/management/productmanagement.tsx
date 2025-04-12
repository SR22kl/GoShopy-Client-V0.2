import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(id!);
  // console.log(data)

  const { name, price, stock, category, photo } = data?.product || {
    name: "",
    price: 0,
    stock: 0,
    category: "",
    photo: "",
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  if (isError) {
    <Navigate to={"/404"} />;
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (photoFile) formData.set("photo", photoFile);

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };
  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="product-management">
        {isLoading ? (
          <Skeleton
            flex="flex flex-row gap-4"
            className="skeleton w-[25.75rem] h-[37rem] rounded-lg"
            length={2}
          />
        ) : (
          <>
            <section>
              <strong>ID-{data?.product._id}</strong>
              <img src={`${server}/${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article className="">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    className="h-[50px]"
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    className="h-[50px]"
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    className="h-[50px]"
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    className="h-[50px]"
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input
                    className="h-[50px]"
                    type="file"
                    onChange={changeImageHandler}
                  />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
