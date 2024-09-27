import { useState, useEffect, useRef } from 'react'
import mammoth from 'mammoth';
import { motion } from 'framer-motion'
import axios from 'axios'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Printer, Briefcase, ChevronDown, Award, TrendingUp, RefreshCw, Italic, List, Underline, Edit, Bold, Upload, Menu, Check, X, AlertCircleIcon, CheckCircleIcon } from "lucide-react"
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

    console.log(editorRef)
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
            {!cvAnalysis ? (
                <Card className="bg-white mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Why Use Our CV Maker?</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                        <span>Tailored for job seekers in tech industry</span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                        <span>Improve your CV with AI-powered analysis</span>
                      </li>
                      <li className="flex items-start">
                        <Award className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                        <span>Stand out from other applicants</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">CV Score</h3>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-muted-foreground">Your CV is better than {animatedScore}% of applicants</p>
                          <p className="text-2xl font-bold">
                            {animatedScore}<span className="text-sm font-normal text-muted-foreground">/100</span>
                          </p>
                        </div>
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
                    </CardContent>
                  </Card>
                  <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">CV Guidelines Check</h3>
                      <ul className="space-y-2">
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
                      <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                      <div className="flex items-center">
                        <Progress value={cvAnalysis.overallScore} className="flex-grow mr-4" />
                        <span className="text-lg font-bold">{cvAnalysis.overallScore}%</span>
                      </div>
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
                <span className="text-gray-400">My CV&apos;s</span>{" "}
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
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">CV Maker is your go-to platform for creating professional CVs and finding your dream job in the tech industry.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-gray-300">Home</a></li>
                <li><a href="#" className="text-sm hover:text-gray-300">Job Finder</a></li>
                <li><a href="#" className="text-sm hover:text-gray-300">CV Templates</a></li>
                <li><a href="#" className="text-sm hover:text-gray-300">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm">Email: support@cvmaker.com</p>
              <p className="text-sm">Phone: +1 (123) 456-7890</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-white hover:text-gray-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">&copy; 2023 CV Maker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}