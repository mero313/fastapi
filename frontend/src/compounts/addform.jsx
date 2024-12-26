import React from 'react';

const Index = ({ competitions, team }) => {
  return (
    <>
      {/* about our system */}
      <div className="first-section flex flex-row items-center relative">
        <div className="description w-5/12 mx-40">
          <h1 className="text-4xl font-bold text-white py-8">Best Way To Vote!</h1>
          <p className="text-white font-medium">
            Goodbye to the old voting methods and Google Form,
            Now you can vote for the team you choose in any competition through our
            official website. Having an audience account will give the team you choose a
            point, while the judges will give them 10 points!
          </p>
        </div>

        <div className="w-5/12 voting-photo">
          <img src="/static/images/voiting.svg" alt="voiting" />
        </div>
        <span className="svg-wave absolute bottom-0 left-0">
          <img src="/static/images/wave.svg" />
        </span>
      </div>

      {/* competition section */}
      <div className="competition-section my-16">
        <div className="flex justify-center items-center flex-col">
          <p className="text-3xl font-bold text-black">Our Competitions</p>
          <span className="line"></span>
        </div>

        {/* Cards container */}
        <div className="flex flex-row flex-wrap justify-center align-items my-1">
          {/* Loop through the competitions from the backend */}
          {competitions.map((competition) => (
            <a href="#" key={competition.id}>
              <div className="bg-white h-64 w-80 rounded-xl border-2 border-slate-200 drop-shadow-xl mx-4 my-4">
                <img src={competition.image} alt="img" className="p-2.5 rounded-t-3xl" /> {/* Fetch img from backend */}
                <p className="text-center py-3 text-2xl font-bold">{competition.name}</p> {/* Fetch name from backend */}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* our team */}
      <div className="my-16"> 
        <div className="flex justify-center items-center flex-col">
          <p className="text-3xl font-bold text-black">Our Team</p>
          <span className="line"></span>
        </div>

        <div className="text-center my-10">
          <div className="flex justify-center items-center flex-row">
            {team.map((team_member) => (
              <div className="team-detail px-16" key={team_member.id}>
                <img src={team_member.image} className="mx-auto w-60 h-60 rounded-full" />
                <h4>{team_member.name}</h4>
                <p>{team_member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
