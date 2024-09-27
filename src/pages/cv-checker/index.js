import { useState, useEffect, useRef } from 'react'
import mammoth from 'mammoth';
import { motion } from 'framer-motion'
import axios from 'axios'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Printer, ChevronDown, RefreshCw, Italic, List, Underline, Edit, Bold, Upload, Menu, Check, X, AlertCircleIcon, CheckCircleIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function JobRecommendations() {
  const [file, setFile] = useState(null)
  const [cvAnalysis, setCvAnalysis] = useState(null)
  const [content, setContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0); 
  const [finalScore, setFinalScore] = useState(0); 
  const [editableCvContent, setEditableCvContent] = useState('')
  const fileInputRef = useRef(null)
  const editorRef = useRef(null)

  const [highlightedContent, setHighlightedContent] = useState('');

  const [totalKeywords, setTotalKeywords] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [keywordMatched, setKeywordMatched] = useState(0);
  const [isATSApproved, setIsATSApproved] = useState(false);

  useEffect(() => {
    const duration = 1000; 
    const steps = 60; 
    const increment = finalScore / steps;
    let currentScore = 0;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= finalScore) {
        clearInterval(timer);
        setAnimatedScore(finalScore);
      } else {
        setAnimatedScore(Math.floor(currentScore));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [finalScore]);

  const handleFormatting = (command) => {
    document.execCommand(command, false, null)
    editorRef.current.focus()
  }  

  const handleSaveEdit = () => {
    const editedContent = editorRef.current.innerHTML
    setEditableCvContent(editedContent)
    const newAnalysis = performAnalysis(editedContent)
    setCvAnalysis(newAnalysis)
  }
  
  const handleFileChange = async (event) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile) 

      await readFile(selectedFile);
    }
  }

  const handleReupload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const readFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      try {
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setContent(value);
        analyzeCV(file);
      } catch (error) {
        console.error('Error reading .docx file:', error);
      }

    };
    reader.readAsArrayBuffer(file);
  };

  const analyzeCV = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCvAnalysis(response.data);
      setFinalScore(response.data.score);
      setHighlightedContent(response.data.issuesHighlighted);
    } catch (err) {
      setError("Failed to analyze CV. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const jobs = [
    {
      id: 1,
      title: "Software Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      postedAgo: "2 days ago",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zkSWSW31AW7lABLK93TY7OV7wxD1ee.png",
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "WebSolutions",
      location: "New York, NY",
      postedAgo: "3 days ago",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zkSWSW31AW7lABLK93TY7OV7wxD1ee.png",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "InnovateTech",
      location: "Austin, TX",
      postedAgo: "1 day ago",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zkSWSW31AW7lABLK93TY7OV7wxD1ee.png",
    },
    {
      id: 4,
      title: "React Developer",
      company: "AppWorks",
      location: "Seattle, WA",
      postedAgo: "4 days ago",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zkSWSW31AW7lABLK93TY7OV7wxD1ee.png",
    },
    {
      id: 5,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "Boston, MA",
      postedAgo: "2 days ago",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zkSWSW31AW7lABLK93TY7OV7wxD1ee.png",
    },
  ]

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Job Finder", href: "#", current: true },
    { name: "Applications", href: "#" },
    { name: "Statistics", href: "#" },
    { name: "Mini Sites", href: "#" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">cv maker</h1>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium ${
                  item.current ? 'text-red-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <a
                    href={item.href}
                    className={item.current ? 'text-red-600' : ''}
                  >
                    {item.name}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="destructive" size="sm" className="hidden sm:inline-flex">
            Upgrade
          </Button>
          <Bell className="w-5 h-5" />
          <Printer className="w-5 h-5" />
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Matthew</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white mb-6">
                <CardContent className="p-6">
                  {!cvAnalysis ? (
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 5MB)</p>
                        </div>
                        <Input id="cv-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                      </label>
                    </div>
                  ) : (
                    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-2">CV Content</h3>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-normal">CV name here</h3>
                        <Button onClick={handleReupload} variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Upload New CV
                        </Button>
                      </div>
                      <Tabs defaultValue="view" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="view">View</TabsTrigger>
                          <TabsTrigger value="edit">Edit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="view" className="h-[calc(100vh-24rem)] overflow-y-auto">
                          <pre 
                            className="whitespace-pre-wrap text-sm"
                            dangerouslySetInnerHTML={{ __html: highlightedContent }}
                          />
                        </TabsContent>
                        <TabsContent value="edit" className="h-[calc(100vh-24rem)]">
                          <div className="mb-4 flex space-x-2">
                            <Button onClick={() => handleFormatting('bold')} variant="outline" size="sm">
                              <Bold className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleFormatting('italic')} variant="outline" size="sm">
                              <Italic className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleFormatting('underline')} variant="outline" size="sm">
                              <Underline className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleFormatting('insertUnorderedList')} variant="outline" size="sm">
                              <List className="w-4 h-4" />
                            </Button>
                          </div>
                          <div
                            ref={editorRef}
                            className="h-[calc(100vh-32rem)] overflow-y-auto border p-4 rounded-md"
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: editableCvContent }}
                          />
                          <Button onClick={handleSaveEdit} className="mt-4">
                            Save Changes
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              {cvAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold mb-2">CV Score</h3>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-muted-foreground">Your CV is better than {animatedScore}% of applicants</p>
                          <p className="text-2xl font-bold">
                            {animatedScore}<span className="text-sm font-normal text-muted-foreground">/100</span>
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-4 bg-gray-200 rounded-full relative overflow-hidden">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000 ease-out"
                            style={{ width: `${animatedScore}%` }}
                            aria-hidden="true"
                          />
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-black transition-all duration-1000 ease-out"
                            style={{ left: `${animatedScore}%` }}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Feedback Message */}
                        <p className="text-sm font-medium mt-2">
                          {animatedScore >= 80 ? "Looks great! Good luck with job interviews!" :
                          animatedScore >= 60 ? "Good start! Consider some improvements." :
                          "Needs work. Let's enhance your CV!"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">CV Guidelines Check</h3>
                      <ul className="space-y-2">
                        <li className={`flex items-center ${isATSApproved ? 'text-green-600' : 'text-red-600'}`}>
                          {isATSApproved ? (
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                          ) : (
                            <AlertCircleIcon className="w-5 h-5 mr-2" />
                          )}
                          ATS Approved: {isATSApproved ? 'Yes' : 'No'}
                        </li>
                        
                        {/* {Object.entries(cvAnalysis.guidelinesCheck).map(([guideline, passed]) => (
                          <li key={guideline} className="flex items-center">
                            {passed ? (
                              <Check className="w-5 h-5 text-green-500 mr-2" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mr-2" />
                            )}
                            <span>{guideline}</span>
                          </li>
                        ))} */}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Suggested Improvements</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {/* {cvAnalysis.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))} */}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                <span className="text-gray-400">My CV's</span>{" "}
                <span className="text-black">For You</span>{" "}
                <span className="text-gray-400">Saved</span>
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Showing 5 recommended jobs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={job.logo} />
                          <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} · {job.location} · {job.postedAgo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                        <Checkbox />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <Card className="mt-6 bg-black text-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upgrade to see all job recommendations and apply</h3>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                    Upgrade to Pro
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#FFD700" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}