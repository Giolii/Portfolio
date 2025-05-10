import BioCard from "./BioCard";
import NameCard from "./NameCard";
import ProjectsShowcase from "./ProjectsShowcase";

const MainPage = () => {
  return (
    <div className="text-gray-100 p-5 border-4 border-gray-800 flex flex-col gap-5 ">
      <NameCard />

      {/* <div className="border-2 border-gray-400 p-2">
        <h2 className="happy">Who I am?</h2>
        <p className="point text-2xl">
          I'm a self-taught software engineer with an unconventional background.
          Before coding, I served as a paratrooper in the Italian Army—an
          experience that taught me a lot about myself and working under
          pressure. After leaving the Army I made the decision to move to the
          US. Starting fresh wasn't easy—I waited tables to make ends meet while
          teaching myself to build WordPress websites for people unfamiliar with
          technology. Helping others bring their ideas online revealed something
          unexpected: I genuinely loved solving problems through code. These
          days, I work with React and Node.js to build full-stack applications.
          My somewhat unusual path has given me a perspective that values both
          technical skills and human connection. I'm continuously learning and
          growing as a developer, bringing my mix of technical knowledge and
          real-world experience to each new project.
        </p>
      </div> */}
      <BioCard />

      {/* <div className="border-2 border-gray-400 p-2 flex flex-col justify-center items-center">
        <div>
          <h2 className="happy">My projects</h2>
        </div>
        <div className="flex w-full justify-around">
          <div>
            <h2>Project1</h2>
            <img src="" alt="SCREENSHOT" />
            <a href="">DEMO</a>
            <a href="">GITHUB</a>
            <div>Stack i used</div>
          </div>
          <div>
            <h2>Project2</h2>
            <img src="" alt="SCREENSHOT" />
            <a href="">DEMO</a>
            <a href="">GITHUB</a>
            <div>Stack i used</div>
          </div>
          <div>
            <h2>Project3</h2>
            <img src="" alt="SCREENSHOT" />
            <a href="">DEMO</a>
            <a href="">GITHUB</a>
            <div>Stack i used</div>
          </div>
        </div>
      </div> */}
      <ProjectsShowcase />

      <div className="border-2 border-gray-400 p-2">
        <h2 className="happy">My skills</h2>
        <p className="point text-2xl">pics of my skills</p>
      </div>
      <div className="border-2 border-gray-400 p-2 flex flex-col justify-center items-center">
        <div className="happy">Contact me</div>
        <div className="flex w-full justify-around">
          <div>Github</div>
          <div>Email</div>
          <div>linkedin</div>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
