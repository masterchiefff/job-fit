import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import axios from "axios";

export default function CVChecker() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0); 
  const [finalScore, setFinalScore] = useState(0); 

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

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setAnalysisResult(null);
    setError(null);
    setFinalScore(0); 
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const analyzeCV = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await axios.post('https://jobfit-server.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Set analysis results
      setAnalysisResult(response.data.message + '\n' + JSON.stringify(response.data.results, null, 2));
      setFinalScore(parseFloat(response.data.score)); 
      setTotalKeywords(response.data.results.totalKeywords);
      setOverallScore(response.data.results.overallScore);
      setKeywordMatched(response.data.results.matchedKeywords);
      setIsATSApproved(response.data.results.isATSApproved); // Set ATS approval status

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || "Failed to analyze CV. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">CV Checker</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileIcon className="w-6 h-6" />
                  <span>{file.name}</span>
                </div>
              ) : (
                <p>Drag & drop your CV here, or click to select a file</p>
              )}
            </div>
            {file && (
              <Button onClick={analyzeCV} className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze CV"}
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : error ? (
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircleIcon className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Analysis Complete</span>
                </div>

                {/* Displaying the animated score */}
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

                {/* Displaying detailed analysis result */}
                <ul className="space-y-2">
                  {/* Display keyword matches and overall score */}
                  <li className={`flex items-center ${keywordMatched > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {keywordMatched > 0 ? (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircleIcon className="w-5 h-5 mr-2" />
                    )}
                    Keywords Matched: {keywordMatched} of {totalKeywords}
                  </li>

                  {/* Display overall score */}
                  <li className={`flex items-center ${overallScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallScore >= 70 ? (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircleIcon className="w-5 h-5 mr-2" />
                    )}
                    Overall Score: {overallScore}
                  </li>

                  {/* Display ATS approval status */}
                  <li className={`flex items-center ${isATSApproved ? 'text-green-600' : 'text-red-600'}`}>
                    {isATSApproved ? (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircleIcon className="w-5 h-5 mr-2" />
                    )}
                    ATS Approved: {isATSApproved ? 'Yes' : 'No'}
                  </li>
                </ul>

                {/* Detailed analysis result */}
                {/* <pre>{analysisResult}</pre>  */}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Upload and analyze your CV to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}