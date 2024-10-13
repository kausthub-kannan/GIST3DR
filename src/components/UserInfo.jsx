import Image from "next/image";
import { Button } from "./ui/button";

export default function UserInfo() {
    return (
        <div className="w-full flex gap-2">
            <div className="w-1/6">
                <Image src="/images/user.png" alt="user" width={100} height={100} />
            </div>
            <div className="w-4/6">
                <div className="flex flex-col justify-start content-center">
                    <p className="text-2xl font-bold">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                    <p className="text-sm text-gray-500">1234567890</p>
                    <p className="text-sm text-gray-500">1234567890</p>
                </div>
            </div>
            <div className="w-1/6 flex flex-col gap-2">
                <Button variant="outline" className="border-2">Edit</Button>
                <Button variant="outline" className="border-2">Edit</Button>
                <Button variant="outline" className="border-2">Edit</Button>
            </div>
        </div>
        );
}
