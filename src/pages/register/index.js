import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const steps = ['Basic Information', 'Additional Details', 'Profile Picture']

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: '',
        zipCode: '',
        password: '',
        profileImage: null
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, profileImage: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
    
        try {
            if (currentStep === 0) {
                // Step 1 - Basic Information
                await axios.post('http://localhost:5000/api/auth/register/step1', {
                    username: formData.username,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                });
                setCurrentStep(1);
            } else if (currentStep === 1) {
                // Step 2 - Additional Details
                const response = await axios.post('http://localhost:5000/api/auth/register/step2', {
                    phoneNumber: formData.phoneNumber,
                    country: formData.country,
                    zipCode: formData.zipCode,
                    password: formData.password
                });
                setUserId(response.data.userId);
                setCurrentStep(2);
            } else if (currentStep === 2 && userId) {
                // Step 3 - Upload Profile Image
                if (formData.profileImage) {
                    const formDataFile = new FormData();
                    formDataFile.append('profileImage', formData.profileImage);
                    await axios.post(`http://localhost:5000/api/auth/register/upload-profile-image/${userId}`, formDataFile, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
                setSuccess('Registration completed successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'An error occurred during registration.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="mb-8">
                <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                    <div className={`flex flex-col items-center ${index <= currentStep ? 'text-green-500' : 'text-gray-300'}`}>
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${index <= currentStep ? 'border-green-500' : 'border-gray-300'}`}>
                        {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                        </div>
                        <div className="text-xs mt-1">{step}</div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                    </React.Fragment>
                ))}
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="default" className="mb-4 bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {currentStep === 0 && (
                <div className="space-y-4">
                    <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                    </div>
                </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <Select
                                onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                                value={formData.country}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                    <SelectItem value="CA">Canada</SelectItem>
                                    {/* Add more countries as needed */}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                            <Input
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                <div className="space-y-4">
                    <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label
                            htmlFor="profileImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                            <span>Upload a file</span>
                            <input id="profileImage" name="profileImage" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                <CardFooter className="flex justify-between mt-6">
                {currentStep > 0 && (
                    <Button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    variant="outline"
                    >
                    Previous
                    </Button>
                )}
                <Button type="submit" className="ml-auto">
                    {currentStep === steps.length - 1 ? 'Complete Registration' : 'Next'}
                </Button>
                </CardFooter>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}