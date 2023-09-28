import { useSession } from "next-auth/react"

export default function HomeHeader() {
  const { data: session } = useSession()

  const headerWrapper =
    "text-blue-900 flex justify-between items-end border-b border-gray-300 pb-2 md:pb-1"
  const greetings = "text-2xl md:text-base mt-0 mb-0"
  const imgLabel =
    "text-sm md:text-md bg-gray-300 flex text-black gap-1 rounded-lg overflow-hidden items-center"

  return (
    <>
      <div className={headerWrapper}>
        <h2 className={greetings}>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className={imgLabel}>
          <img
            src={session?.user?.image}
            alt="Profile picture"
            className="w-10 h-10 md:w-8 md:h-8"
          />
          <span className="hidden md:block px-2">{session?.user?.name}</span>
        </div>
      </div>
    </>
  )
}
