

export function Courses({ courses }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Course key={course.id} {...course} />
      ))}
    </div>
  )
}

