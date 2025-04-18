import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-4 hover:opacity-75 transition">
      <Image
        src="/logo.svg"
        alt="Jotion"
        height={40}
        width={40}
      />
      <p className="hidden md:block text-lg font-semibold">
        Jotion
      </p>
    </Link>
  )
} 