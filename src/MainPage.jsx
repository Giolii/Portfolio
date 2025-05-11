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

      <ContactCard />
    </div>
  );
};
export default MainPage;
