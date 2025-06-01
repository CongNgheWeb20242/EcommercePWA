import collection_1 from '../../assets/home/collection_1.jpg';
import collection_2 from '../../assets/home/collection_2.jpg';
import collection_3 from '../../assets/home/collection_3.jpg';
import collection_4 from '../../assets/home/collection_4.jpg';

const NikeCollection = () => {
  return (
    <section className="bg-gray-800 py-8 sm:py-12 text-white">
      <div className="container mx-auto text-center mb-6 sm:mb-8 px-2">
        <h2 className="text-xl sm:text-3xl font-bold uppercase">EcommercePWA Collection</h2>
      </div>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Collection 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={collection_1}
              alt="Nike Collection 1"
              className="rounded-lg shadow-lg w-full h-40 xs:h-52 sm:h-60 md:h-64 lg:h-[250px] object-cover transition-all duration-300"
            />
            <p className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">EcommercePWA Collection 1</p>
          </div>
          {/* Collection 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={collection_2}
              alt="Nike Collection 2"
              className="rounded-lg shadow-lg w-full h-40 xs:h-52 sm:h-60 md:h-64 lg:h-[250px] object-cover transition-all duration-300"
            />
            <p className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">EcommercePWA Collection 2</p>
          </div>
          {/* Collection 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={collection_3}
              alt="Nike Collection 3"
              className="rounded-lg shadow-lg w-full h-40 xs:h-52 sm:h-60 md:h-64 lg:h-[250px] object-cover transition-all duration-300"
            />
            <p className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">EcommercePWA Collection 3</p>
          </div>
          {/* Collection 4 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={collection_4}
              alt="Nike Collection 4"
              className="rounded-lg shadow-lg w-full h-40 xs:h-52 sm:h-60 md:h-64 lg:h-[250px] object-cover transition-all duration-300"
            />
            <p className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">EcommercePWA Collection 4</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NikeCollection;

