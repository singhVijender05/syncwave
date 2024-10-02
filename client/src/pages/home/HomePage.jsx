import Footer from '../../components/Layout/Footer';
import Features from './Features';
import Hero from './Hero';

const HomePage = () => {

    return (
        <div className='overflow-hidden'>
            <Hero />
            <Features />
            <Footer />
        </div>
    );
};

export default HomePage;
