import React from 'react'
import TeamCard from './TeamCard'

const CourseCard = ({ course, onVote }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-semibold">{course.title}</h2>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Teams:</h3>
        <div className="space-y-2">
          {course.teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onVote={() => onVote(course.id, team.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseCard