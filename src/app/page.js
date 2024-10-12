import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import { PatientsList } from "@/components/PatientsList";
import { AddUser } from "@/components/AddUser";

export default function Home() {
  const tabs = [
    {
      title: "All Patients",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-green-700 to-green-900">
          <p>Product Tab</p>
          <PatientsList />
        </div>
      ),
    },
    {
      title: "Add Patients",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-green-700 to-green-900">
          <p>Services tab</p>
          <AddUser />
        </div>
      ),
    },
  ];
  return (
    <div className=" h-screen relative flex flex-col  mx-10 w-full  items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  );
}


const DummyContent = () => {
  return (
    <Image
      src=""
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};