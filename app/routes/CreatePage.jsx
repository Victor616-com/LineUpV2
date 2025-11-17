import NoteCreate from "../components/create_components/NoteCreate";
import CreateSelector from "../components/create_components/CreateSelector";
import CreateProfileView from "../components/create_components/CreateProfileVIew";
import RequestCreate from "../components/create_components/RequestCreate";
import { useState } from "react";

function CreatePage() {
  const [selected, setSelected] = useState("note");
  return (
    <div className="px-s flex flex-col gap-[25px] w-full pb-20">
      <CreateSelector selected={selected} setSelected={setSelected} />
      <CreateProfileView />
      {selected === "note" ? <NoteCreate /> : <RequestCreate />}
    </div>
  );
}

export default CreatePage;
