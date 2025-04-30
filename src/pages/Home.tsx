import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import videoCover from "../assets/covervideo.mp4";
import { motion } from "framer-motion";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { Slider } from "6pp";

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];

const banners = [
  "https://images.indianexpress.com/2025/01/Nintendo-Switch-2-console.png",
  "https://4kwallpapers.com/images/walls/thumbs_3t/19032.jpg",
  // "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  // "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];
const categories = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Books",
  "Fashion",
  "Microphone",
  "Furniture",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

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

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language. Silhouettes and textures speak volumes, a conversation starter with every bold print. It's a way to tell our story, a confidence booster, or a playful exploration. From elegance to rebellion, fashion lets us navigate the world in style.".split(
      " "
    );

  return (
    <>
      <div
        className="flex flex-col w-full py-[2rem] px-[5%] h-[cal(100vh-4rem)]"
        id="home"
      >
        <section className="hidden" id="bannerSection"></section>

        <div className="bg-white border-[1px] border-gray-100 rounded-lg shadow-md p-4 md:p-6 flex flex-col-reverse md:flex-row">
          <aside className="w-full md:w-[15%] pr-0 md:pr-6 mb-4 md:mb-0">
            <h1 className="text-[18px] md:border-l-2 bg-teal uppercase md:border-l-teal-600 md:px-2 md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 mt-2 md:mt-0">
              Categories
            </h1>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 gap-3 font-semibold md:space-y-2">
              {categories.map((i) => (
                <li key={i} className="flex items-center justify-center">
                  <Link
                    to={`/search?category=${i.toLowerCase()}`}
                    className="text-gray-600 w-full bg-violet-300 p-[0.5rem] rounded-md md:p-0 md:rounded-none md:bg-white hover:scale-105 transition duration-300 ease-in block py-0.5 md:py-1 text-[12px]  md:text-base text-center"
                  >
                    {i}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="w-full md:w-[85%]">
            <Slider
              autoplay
              autoplayDuration={1500}
              showNav={false}
              images={banners}
            />
          </div>
        </div>

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
                photos={i.photos}
                handler={addToCartHandler}
              />
            ))
          )}
        </main>
      </div>

      <article className="cover-video-container ">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            className="text-gray-300"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              className="text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>
      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>
      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="bg-gray-100 py-12 px-6 rounded-lg shadow-md">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: "easeInOut",
                },
              }}
              viewport={{ once: true }}
              key={service.title}
              className="bg-white rounded-md p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="text-indigo-500  p-5 rounded-[50%] text-4xl mb-4 bg-blue-200 hover:bg-green-200  hover:text-green-500 duration-300 ease-in cursor-pointer">
                {service.icon}
              </div>
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description || service.title}
                </p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;
