import multitaskingImage from "../../assets/multitasking.png";

const Hero = () => {
  return (
    <div className="relative flex flex-row justify-center items-center">
      <div className="relative max-w-4xl mt-8 p-8 flex flex-row">
        {/* Text */}
        <div className="w-3/5">
          <div className="grow-0 shrink h-auto flex flex-row justify-start items-center">
            <h1 className="relative text-6xl font-black bg-gradient-to-br from-cyan-400 via-purple-300 to-fuchsia-700 text-transparent bg-clip-text">
              <span className="text-blue-300">S</span>ER
              <span className="text-pink-300">M</span>ENTE
            </h1>
            <span className="font-light ml-3 text-pink-500">
              / Coming soon?
            </span>
          </div>

          <div className="mt-4 font-extralight text-2xl flex flex-col justify-between">
            <div>¿Cansado de que todo esté desordenado?</div>
            <div>
              Pronto tendrás una{" "}
              <span className="bg-gradient-to-t from-transparent to-[#2395b2] px-1">
                forma de organizarlo
              </span>{" "}
              todo, para que todo esté{" "}
              <span className="bg-gradient-to-t from-transparent to-[#b5a52d] px-1">
                donde tiene que estar
              </span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="absolute bottom-0 right-0 w-1/2 h-[120%] -mb-[8%] flex flex-row justify-end">
          <img
            src={multitaskingImage}
            className="h-auto w-auto"
            alt="Multitasking"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
