import { UserPage } from "@/components/UserPage";

export default function User({ params }) {
  const { id } = params; 

  return (
    <UserPage id={id} /> 
  );
}


