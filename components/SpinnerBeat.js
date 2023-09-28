import { BeatLoader } from "react-spinners"

export default function SpinnerBeat({ fullWidth = false }) {
  if (fullWidth) {
    return (
      <div className="w-full flex justify-center">
        <BeatLoader color={"#5542F6"} speedMultiplier={2} />
      </div>
    )
  }

  return <BeatLoader color={"#5542F6"} speedMultiplier={2} />
}
