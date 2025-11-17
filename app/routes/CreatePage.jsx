import NoteCreate from "../components/create_components/NoteCreate";
import CreateSelector from "../components/create_components/CreateSelector";
import CreateProfileView from "../components/create_components/CreateProfileVIew";
import RequestCreate from "../components/create_components/RequestCreate";
import { useState } from "react";
import { useLocation } from "react-router";

function CreatePage() {
  const location = useLocation();
  const initialSelected =
    location.state?.selected === "request" ? "request" : "note";

  const [selected, setSelected] = useState(initialSelected);
  return (
    <div className="px-s flex flex-col gap-[25px] w-full pb-20">
      <CreateSelector selected={selected} setSelected={setSelected} />
      <CreateProfileView />
      {selected === "note" ? <NoteCreate /> : <RequestCreate />}
    </div>
  );
}

export default CreatePage;
