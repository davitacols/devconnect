export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-4">Welcome to DevConnect</h1>
          <p className="text-xl mb-8">A platform for developers to connect and collaborate</p>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Find Developers</h2>
              <p>Connect with talented developers from around the world.</p>
            </div>
  
            <div className="border p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Showcase Projects</h2>
              <p>Share your work and get feedback from the community.</p>
            </div>
  
            <div className="border p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Collaborate</h2>
              <p>Find partners for your next big idea or open source project.</p>
            </div>
  
            <div className="border p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Learn & Grow</h2>
              <p>Expand your skills through mentorship and knowledge sharing.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  