import React from "react";
import { features } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Features = () => {
    return (
        <div id="features" className="font-poppins md:py-10">
            <div className="text-center text-5xl md:text-8xl font-extrabold md:pb-20 flex w-full items-center justify-center md:space-x-4">
                <div className="divider md:w-1/4 divider-neutral h-20"></div>
                <h1>How it Works</h1>
                <div className="divider md:w-1/4 divider-neutral h-20"></div>
            </div>
            <div className="md:space-y-20">
                {
                    features.map((feature, index) => {
                        const { ref, inView } = useInView({
                            threshold: 0.2, // Trigger when 20% of the feature is in view
                            triggerOnce: true, // Only trigger the animation once
                        });

                        return (
                            <React.Fragment key={index}>
                                <motion.div
                                    ref={ref}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="feature1 w-full px-5 md:w-[70%] md:mx-auto flex flex-col md:flex-row"
                                >
                                    <div className={`content order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}  text-center lg:text-left space-y-8 mt-12 lg:w-1/2`}>
                                        <p className='relative text-5xl lg:text-7xl'>
                                            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-neutral relative inline-block">
                                                <span className="relative text-white font-bold">{feature.title}</span>
                                            </span>
                                        </p>
                                        <p className="text-xl">{feature.description}</p>
                                    </div>
                                    <div className={`image order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} w-full md:w-1/2 flex items-center justify-center`}>
                                        <img className="w-80 h-80 rounded-xl" src={feature.image} alt="Create Room" />
                                    </div>
                                </motion.div>
                                <div className="divider divider-neutral px-10 md:hidden"></div>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Features;
