import UserModeReset from "./components/UserModeReset";
import AllBrands from "./components/AllBrands";
import Banner from "./components/Banner";
import BestSelling from "./components/BestSelling";
import FeaturedCategories from "./components/FeaturedCategories";
import Features from "./components/Features";
import NewArrival from "./components/NewArrival";
import Services from "./components/Services";

const Home = () => {
    return (
        <main className="w-full">
            <UserModeReset />

            <Banner />
            <AllBrands />
            <FeaturedCategories />
            <BestSelling />
            <NewArrival />
            <Services />
            <Features />
        </main>
    );
};

export default Home;