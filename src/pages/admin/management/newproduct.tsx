import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const [isLoading, setIsloading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(100);
  const [stock, setStock] = useState<number>(1);
  // const [photoPrev, setPhotoPrev] = useState<string>("");

  const [newProduct] = useNewProductMutation();

  const photos = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    try {
      if (!name || !price || stock < 0 || !category || !description) return;

      if (!photos.file || photos.file.length === 0) return;

      const formData = new FormData();

      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({ id: user?._id!, formData });

      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management ">
        <article className="overflow-auto">
          <form onSubmit={submitHandler}>
            <h2 className="text-[20px]">New Product</h2>
            <div>
              <label>Name</label>
              <input
                className="h-[50px]"
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                className="h-[60px] w-full border-[1px] border-gray-300 rounded-md p-2 outline-0"
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                className="h-[50px]"
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                className="h-[50px]"
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                className="h-[50px]"
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                className="h-[50px]"
                required
                type="file"
                accept="image/*"
                multiple
                onChange={photos.changeHandler}
              />
            </div>
            {photos.error && <p>{photos.error}</p>}

            {photos.preview &&
              photos.preview.map((img, i) => (
                <img key={i} src={img} alt="New Image" />
              ))}
            <button disabled={isLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
