import { useState } from "react";
import { FaSearch, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import cart from "../assets/eKart.png";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PropsType {
  user: User | null;
}
const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  const logouthandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to logout!");
    }
  };
  return (
    <>
      <nav
        className="flex flex-row p-[1px] h-[50px] justify-between items-center gap-[1rem] px-[20px] shadow-md "
        id="header"
      >
        <div className="flex flex-row w-[40px] h-[40px] hover:rotate-12 duration-300 ease-in-out cursor-pointer">
          <Link to={"/"}>
            <img src={cart} alt="" />
          </Link>
        </div>

        <div className="flex flex-row gap-[1rem] items-center justify-center">
          <Link
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-900"
            to={"/"}
          >
            Home
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="duration-300 hover:scale-[1.2]"
            to={"/search"}
          >
            <FaSearch />
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            className="duration-300 hover:scale-[1.2]"
            to={"/cart"}
          >
            <div className="flex items-center">
              <FaCartShopping />
              <span className="bg-blue-400 px-[5px] text-white rounded-md -mt-4">
                {cartItems.length > 0 ? cartItems.length : ""}
              </span>
            </div>
          </Link>
          {user && user._id ? (
            <>
              <button
                className="border-none size-[1.2rem] cursor-pointer bg-transparent duration-300 hover:scale-[1.2]"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <FaUser />
              </button>
              <dialog
                className="border-[1px] border-gray-300 rounded-[5px] w-[100px] absolute left-[calc(99%-100px)] top-[8%] z-10 "
                open={isOpen}
              >
                <div className="flex flex-col justify-start items-center gap-[0.25rem] text-[16px] py-2">
                  {user.role === "admin" && (
                    <Link
                      onClick={() => setIsOpen(false)}
                      to="/admin/dashboard"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    onClick={() => setIsOpen(false)}
                    className=""
                    to="/orders"
                  >
                    Orders
                  </Link>
                  <button onClick={logouthandler}>
                    <FaSignOutAlt className="cursor-pointer" />
                  </button>
                </div>
              </dialog>
            </>
          ) : (
            <Link to={"/login"}>
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
