import BioCard from "./BioCard";
import NameCard from "./NameCard";
import ProjectsShowcase from "./ProjectsShowcase";
import SkillsCard from "./SkillsCard";
import ContactCard from "./ContactCard.jsx";

const MainPage = () => {
  return (
    <div className="text-gray-100 p-5  flex flex-col gap-5 ">
      <NameCard />
      <BioCard />
      <ProjectsShowcase />

      {/* <SkillsCard /> */}

      {/* <div className="border-2 border-gray-400 p-2 flex flex-col justify-center items-center">
        <div className="happy">Contact me</div>
        <div className="flex w-full justify-around">
          <div>Github</div>
          <div>Email</div>
          <div>linkedin</div>
        </div>
      </div> */}

      <ContactCard />
    </div>
  );
};
export default MainPage;
