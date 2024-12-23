const Feature = ({ title, description, icon: Icon }) => (
    <div className="max-w-sm p-2 py-5 bg-white text-black rounded-lg shadow-md shadow-black w-full flex flex-col justify-between my-auto h-full">
        <div className="flex flex-col items-center mb-2 mx-auto justify-start w-full">
            <Icon className="w-8 h-8 text-white bg-destructive mb-1 p-1 rounded sm:w-10 sm:h-10" />
            <p className="font-bold border-b w-full text-center text-xl lg:text-2xl">
                {title}
            </p>
        </div>
        <div className="flex-grow w-full flex">
            <p className="font-medium text-justify p-2">
                {description}
            </p>
        </div>
    </div>
);

export default Feature;
