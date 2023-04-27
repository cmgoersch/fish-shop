import Product from "../components/Product";
import FormChangeData from "../components/ProductChangeForm";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/router";
import useSWR from "swr";

async function sendRequest(url, { arg }) {
  // here we set the request method
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
  }
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useSWR(`/api/products/${id}`);

  const { trigger, isMutating } = useSWRMutation(
    `/api/products/${id}`,
    sendRequest
  );

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  async function handleEdit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);
    // Here you are preparing your updated data to be handed over to your sendRequest function.
    await trigger(productData);
  }
  async function handleDelete() {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  return (
    <>
      <Product />
      <FormChangeData
        value={data}
        onSubmit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
