import useCartStore from "@/store/useCartStore";
import CustomImage from "../ui/image";


export default function OrderedProductList() {
    const items = useCartStore(state => state.items);

    return (
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {items.map((item) => (
                <div key={item._id} className="flex items-center gap-2">
                    <CustomImage
                        src={item._id} // TODO
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded bg-white"
                    />
                    <div className="text-xs">
                        <div className="font-semibold truncate w-36">{item.name}</div>
                        <div>Size: {item.size}</div>
                        <div>SL: {item.quantity} x {item.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}


