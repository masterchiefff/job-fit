import { Bell, Search, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

const jobListings = [
    {
      id: 1,
      logo: "Jo",
      color: "bg-green-500",
      title: "Product Designer",
      company: "Upworthy hiring",
      location: "Marina East, Singapore",
      time: "Posted 15 mins ago",
      description: [
        "Within this role, you will be creating content for a wide range of local and international clients",
        "This role is suited to Bali based creatives looking to work in-house."
      ]
    },
    {
      id: 2,
      logo: "O",
      color: "bg-orange-500",
      title: "Copywriting Specialist",
      company: "Odama Studio",
      type: "Freelance",
      salary: "$600-$1200 USD",
      location: "Paris, France",
      time: "Posted 3 days ago",
      description: [
        "Collaborate with the marketing team to optimize conversion",
        "Develop inspiring, persuasive, and convincing copy for a wide array of writing needs"
      ]
    },
    {
      id: 3,
      logo: "T",
      color: "bg-blue-500",
      title: "Full Stack Developer",
      company: "Twitter",
      salary: "$1500-$2000 USD",
      location: "Málaga, Spain",
      time: "Posted 3 days ago",
      description: [
        "Responsible for designing, planning, and testing of any projects/products",
        "Building effective and reusable modules that will enhance user experience in each projects/products"
      ]
    }
  ]

export default function Jobs() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 text-white p-2 rounded">Jo</div>
            <span className="font-semibold text-xl">Jobella</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-green-500 font-medium">Find Jobs</a>
            <a href="#" className="text-gray-600">Find Talent</a>
            <a href="#" className="text-gray-600">Upload Job</a>
            <a href="#" className="text-gray-600">About Us</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" />
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Find your dream job</h1>
            <p className="text-gray-600 mb-8">Looking for job? Browse our latest job openings to view & apply to the best jobs today!</p>
            <div className="flex space-x-4 mb-8">
              <div className="flex-grow">
                <Input placeholder="Search job title or keyword" className="w-full" />
              </div>
              <div className="w-1/3">
                <Input placeholder="Country or timezone" className="w-full" />
              </div>
              <Button className="bg-green-500 text-white">Find jobs</Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 transform rotate-45"></div>
              <div className="absolute top-8 right-8 w-24 h-24 bg-black transform rotate-45"></div>
              <div className="absolute top-16 right-16 w-16 h-16 bg-yellow-500 transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row text-gray-600">
          <div className="w-full md:w-1/4">
            <h2 className="font-semibold mb-4 text-gray-600">Filter</h2>
            <Button variant="outline" className="w-full justify-start mb-4">Clear all</Button>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Date Post</h3>
                <Select>
                  <option>Anytime</option>
                </Select>
              </div>
              <div>
                <h3 className="font-medium mb-2">Job type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Full-time
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Internship
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Range Salary</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$500</span>
                  <span>$2000</span>
                </div>
                <input type="range" className="w-full" />
              </div>
              <div>
                <h3 className="font-medium mb-2">On-site/remote</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    On-site
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Remote
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">250 Jobs results</h2>
              <Select>
                <option>Most relevant</option>
              </Select>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
              {jobListings.map((job) => (
                <Link href={`/job/${job.id}`} key={job.id}>
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start">
                      <div className={`${job.color} text-white p-3 rounded-lg mr-4`}>
                        {job.logo}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company} {job.type && <span className="text-orange-500">• {job.type}</span>}</p>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                            <p className="text-gray-600">{job.location}</p>
                            <p className="text-sm text-gray-500">{job.time}</p>
                          </div>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {job.description.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {job.salary && <p className="mt-4 text-gray-600">{job.salary}</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}