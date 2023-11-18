import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@/AppContext";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const { products } = useContext(AppContext);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const foundProduct = products.find((p) => p.Id === Number(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1>{product.Name}</h1>
      <p>{product.Description}</p>
    </div>
  );
}
