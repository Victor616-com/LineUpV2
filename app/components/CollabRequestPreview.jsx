import { useNavigate } from "react-router";
import CollabRequestPreviewCard from "./CollabRequestPreviewCard";
import YellowBtn from "./YellowBtn";

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8 12H12M16 12H12M12 12V8M12 12V16"
      stroke="#1D1D1D"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="#1D1D1D"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function CollabRequestPreview() {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/create", { state: { selected: "request" } });
  };
  return (
    <div className="bg-[#F7F6F6] py-s flex flex-col gap-s">
      <p className="text-m text-center">Collaboration requests for you</p>
      <div className="px-s w-full overflow-x-auto no-scrollbar">
        <div className="flex flex-row flex-nowrap w-fit gap-3 py-1">
          <CollabRequestPreviewCard />
          <CollabRequestPreviewCard />
          <CollabRequestPreviewCard />
          <CollabRequestPreviewCard />
        </div>
      </div>
      <div className="flex flex-row justify-between px-s">
        <button className="border border-yellow px-[10px] rounded-full text-m">
          See more
        </button>
        <YellowBtn className="text-m text-black" onClick={handleCreateClick}>
          {plusIcon}Create your own
        </YellowBtn>
      </div>
    </div>
  );
}

export default CollabRequestPreview;
