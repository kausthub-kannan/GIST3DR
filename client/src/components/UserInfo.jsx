import Image from "next/image";
import { Button } from "./ui/button";

export default function UserInfo() {
    return (
        <div className="w-full flex gap-2">
            <div className="w-5/6">
                <div className="flex flex-col justify-start content-center">
                    <p className="text-2xl font-bold">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
            </div>
            {/* <div className="w-1/6 flex flex-col gap-2">
                <Button variant="outline" className="border-2">Edit</Button>
            </div> */}
        </div>
        );
}
