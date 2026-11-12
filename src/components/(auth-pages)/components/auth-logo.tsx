import Image from "next/image";

export function AuthLogo() {
  return (
    <div className=" flex justify-center">
      <Image
        src="/logo.png"
        alt="Worth World"
        width={88}
        height={88}
        className="h-[88px] w-[88px] rounded-full object-cover"
        priority
      />
    </div>
  );
}
