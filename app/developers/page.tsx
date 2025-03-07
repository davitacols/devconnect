import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for developers
const developers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Frontend Developer",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    bio: "Passionate frontend developer with 5 years of experience building responsive web applications.",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Full Stack Developer",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["Node.js", "React", "MongoDB", "AWS"],
    bio: "Full stack developer specializing in MERN stack applications and cloud infrastructure.",
  },
  {
    id: "3",
    name: "Jessica Williams",
    role: "UI/UX Designer & Developer",
    location: "Austin, TX",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["Figma", "React", "CSS", "User Research"],
    bio: "Designer and developer focused on creating beautiful, user-friendly interfaces.",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Backend Developer",
    location: "Seattle, WA",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    bio: "Backend specialist with expertise in building scalable APIs and microservices.",
  },
  {
    id: "5",
    name: "Emily Rodriguez",
    role: "Mobile Developer",
    location: "Chicago, IL",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    bio: "Mobile app developer creating cross-platform solutions for iOS and Android.",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "DevOps Engineer",
    location: "Portland, OR",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["Kubernetes", "CI/CD", "Terraform", "AWS"],
    bio: "DevOps engineer focused on automating deployment pipelines and infrastructure.",
  },
]

export default function DevelopersPage() {
  return (
    <main className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
          <p className="text-muted-foreground">Connect with talented developers from around the world</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/developers/search">Advanced Search</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((developer) => (
          <Card key={developer.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={developer.avatar} alt={developer.name} />
                  <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{developer.name}</CardTitle>
                  <CardDescription>{developer.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground mb-4">{developer.bio}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {developer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{developer.location}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/developers/${developer.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}

