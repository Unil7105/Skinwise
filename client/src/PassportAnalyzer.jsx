import React, { useState } from 'react';
import axios from 'axios';

const PassportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset results and errors
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a passport image to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/api/analyze-passport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data.result);
    } catch (err) {
      console.error('Error analyzing passport:', err);
      setError(err.response?.data?.error || 'Failed to analyze the passport. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Passport Analyzer</h1>
      <p className="text-gray-600 mb-8">
        Upload a passport image to automatically extract and analyze the information.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="inline-block px-5 py-3 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
            {preview ? 'Change Image' : 'Select Passport Image'}
            <input 
              type="file" 
              accept="image/jpeg,image/png" 
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        
        {preview && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview</h3>
            <img 
              src={preview} 
              alt="Passport preview" 
              className="max-w-full max-h-64 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className={`px-6 py-3 rounded text-white font-medium ${
            !file || loading 
              ? 'bg-green-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 transition-colors'
          }`}
          disabled={!file || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Passport'}
        </button>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="flex flex-col items-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Analyzing passport document...</p>
        </div>
      )}
      
      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-4">Analysis Results</h2>
          <div className="bg-white p-4 rounded-md border border-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default PassportAnalyzer;

// import { useState } from "react"
// import axios from "axios"
// import { Upload, FileText, FileImage, Check, AlertCircle, Loader } from "lucide-react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { cn } from "@/lib/utils"

// export default function PassportAnalyzer() {
//   const [file, setFile] = useState(null)
//   const [preview, setPreview] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState(null)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("upload")

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0]

//     if (selectedFile) {
//       setFile(selectedFile)

//       // Create a preview
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setPreview(reader.result)
//       }
//       reader.readAsDataURL(selectedFile)

//       // Reset results and errors
//       setResult(null)
//       setError(null)

//       // Switch to preview tab
//       setActiveTab("preview")
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!file) {
//       setError("Please select a passport image to analyze")
//       return
//     }

//     setLoading(true)
//     setError(null)

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       const response = await axios.post("http://localhost:8000/api/analyze-passport", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       setResult(response.data.result)
//       // Switch to results tab
//       setActiveTab("results")
//     } catch (err) {
//       console.error("Error analyzing passport:", err)
//       setError(err.response?.data?.error || "Failed to analyze the passport. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Passport Document Analyzer</h1>
//           <p className="text-slate-600 max-w-2xl mx-auto">
//             Upload a passport image to automatically extract and analyze the information with advanced document
//             recognition.
//           </p>
//         </div>

//         <Card className="border-slate-200 shadow-lg">
//           <CardHeader className="border-b border-slate-100 bg-slate-50 rounded-t-lg">
//             <CardTitle className="flex items-center gap-2 text-slate-800">
//               <FileText className="h-5 w-5" />
//               Document Analysis
//             </CardTitle>
//             <CardDescription>The system will analyze your passport and extract relevant information</CardDescription>
//           </CardHeader>

//           <CardContent className="p-0">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="upload">Upload</TabsTrigger>
//                 <TabsTrigger value="preview" disabled={!preview}>
//                   Preview
//                 </TabsTrigger>
//                 <TabsTrigger value="results" disabled={!result}>
//                   Results
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="upload" className="p-6">
//                 <div className="flex flex-col items-center gap-6">
//                   <div
//                     className="w-full border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-slate-50"
//                     onClick={() => document.getElementById("passport-file")?.click()}
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <Upload className="h-10 w-10 text-slate-400" />
//                       <h3 className="font-medium text-slate-700">Upload Passport Image</h3>
//                       <p className="text-sm text-slate-500 max-w-xs">
//                         Click or drag and drop your passport image here. We support JPEG and PNG formats.
//                       </p>
//                       <input
//                         id="passport-file"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         onChange={handleFileChange}
//                         className="hidden"
//                       />
//                       {file && (
//                         <div className="mt-2 flex items-center gap-2 text-sm text-primary font-medium">
//                           <FileImage className="h-4 w-4" />
//                           {file.name}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <Button onClick={handleSubmit} disabled={!file || loading} className="px-6" size="lg">
//                     {loading ? (
//                       <>
//                         <Loader className="h-4 w-4 mr-2 animate-spin" />
//                         Analyzing...
//                       </>
//                     ) : (
//                       "Analyze Passport"
//                     )}
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="preview" className="p-6">
//                 {preview && (
//                   <div className="flex flex-col gap-6">
//                     <div className="bg-slate-800 p-1 rounded-lg shadow-inner overflow-hidden">
//                       <img
//                         src={preview || "/placeholder.svg"}
//                         alt="Passport preview"
//                         className="max-w-full max-h-[400px] mx-auto object-contain rounded"
//                       />
//                     </div>
//                     <div className="flex justify-between">
//                       <Button variant="outline" onClick={() => setActiveTab("upload")}>
//                         Change Image
//                       </Button>
//                       <Button onClick={handleSubmit} disabled={!file || loading}>
//                         {loading ? (
//                           <>
//                             <Loader className="h-4 w-4 mr-2 animate-spin" />
//                             Analyzing...
//                           </>
//                         ) : (
//                           "Analyze Passport"
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>

//               <TabsContent value="results" className="p-6">
//                 {result && (
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-md">
//                       <Check className="h-5 w-5" />
//                       <span className="font-medium">Analysis completed successfully</span>
//                     </div>
//                     <div className="mt-4">
//                       <h3 className="text-lg font-medium text-slate-800 mb-2">Extracted Information</h3>
//                       <div className="bg-slate-950 text-slate-50 p-5 rounded-md shadow-sm font-mono text-sm leading-relaxed overflow-auto max-h-[400px]">
//                         <pre>{result}</pre>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         setFile(null)
//                         setPreview(null)
//                         setResult(null)
//                         setActiveTab("upload")
//                       }}
//                       className="mt-4"
//                     >
//                       Analyze Another Document
//                     </Button>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </CardContent>

//           <CardFooter
//             className={cn("border-t border-slate-100 bg-slate-50 rounded-b-lg", !error && !loading && "hidden")}
//           >
//             {error && (
//               <Alert variant="destructive" className="w-full">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {loading && !error && (
//               <div className="w-full flex items-center justify-center gap-3 py-3">
//                 <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
//                 <p className="text-slate-600 text-sm font-medium">Processing document with AI analysis...</p>
//               </div>
//             )}
//           </CardFooter>
//         </Card>

//         <div className="mt-8 text-center text-sm text-slate-500">
//           <p>Your documents are processed securely with end-to-end encryption.</p>
//         </div>
//       </div>
//     </div>
//   )
// }