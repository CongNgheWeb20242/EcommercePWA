import collection_1 from '../../assets/home/collection_1.jpg';
import collection_2 from '../../assets/home/collection_2.jpg';
import collection_3 from '../../assets/home/collection_3.jpg';
import collection_4 from '../../assets/home/collection_4.jpg';

const NikeCollection = () => {
  return (
    <section className="bg-gray-800 py-12 text-white">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold uppercase">NIKESHOP Collection</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-40 container mx-auto px-4">
        {/* Collection 1 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={collection_1}
            alt="Nike Collection 1"
            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
          />
          <p className="mt-4 font-medium">NIKESHOP Collection 1</p>
        </div>

        {/* Collection 2 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={collection_2}
            alt="Nike Collection 2"
            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
          />
          <p className="mt-4 font-medium">NIKESHOP Collection 2</p>
        </div>

        {/* Collection 3 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={collection_3}
            alt="Nike Collection 3"
            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
          />
          <p className="mt-4 font-medium">NIKESHOP Collection 3</p>
        </div>

        {/* Collection 4 */}
        <div className="flex flex-col items-center text-center">
          <img
            src={collection_4}
            alt="Nike Collection 4"
            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
          />
          <p className="mt-4 font-medium">NIKESHOP Collection 4</p>
        </div>
      </div>
    </section>
  );
};

export default NikeCollection;
