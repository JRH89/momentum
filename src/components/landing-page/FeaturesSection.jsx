import {
    Mail,
    CreditCard,
    Database,
    Bell,
    Megaphone,
    Bug
} from 'lucide-react';
import Feature from './Feature';

// Page Data
const pageData = {
    tag: "Explore endless possibilities",
    title: "Capabilities",
    description: "Our platform offers a wide range of features designed to meet your needs. Discover everything you can achieve with our comprehensive toolset.",
}

// Feature Data
const features = [
    {
        title: 'QuickFox Emails',
        description: 'Experience lightning-fast email delivery with QuickFox, your go-to solution for communication.',
        icon: Mail,
    },
    {
        title: 'ZebraPay Integration',
        description: 'Handle payments effortlessly with ZebraPay, ensuring secure and smooth transactions every time.',
        icon: CreditCard,
    },
    {
        title: 'Nimbus Data',
        description: 'Store your data with Nimbus, providing real-time access and robust security for all your needs.',
        icon: Database,
    },
    {
        title: 'Echo Alerts',
        description: 'Stay informed with Echo Alerts, delivering instant notifications that keep you updated in real time.',
        icon: Bell,
    },
    {
        title: 'Support Desk',
        description: 'Resolve issues quickly with our Support Desk, designed to manage requests and enhance user satisfaction.',
        icon: Bug,
    },
    {
        title: 'Broadcast Center',
        description: 'Communicate efficiently with Broadcast Center, sending important updates to all users simultaneously.',
        icon: Megaphone,
    },

];

const FeaturesSection = () => {
    return (
        <section className="sm:p-10 md:px-24 p-8 px-2 pt-20 mx-auto w-full my-auto  md:mb-0 min-h-screen h-full flex items-center flex-col justify-center">
            <div className="section-heading">
                <div className='flex justify-center'>
                    <div className="tag text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
                        {pageData.tag}
                    </div>
                </div>
                <h2 className="section-title mt-5">
                    {pageData.title}
                </h2>
                <p className="section-description mt-5">
                    {pageData.description}
                </p>
            </div>
            <div className="mx-auto justify-center flex mt-10">
                <div className="grid grid-cols-1 gap-6 items-center w-full mx-auto sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Feature
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;
