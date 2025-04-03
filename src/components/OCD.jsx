import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router";
import YouTubeIcon from '@mui/icons-material/YouTube';

const OCD = () => {
    const [q1, setQ1] = useState(null);
    const [q2, setQ2] = useState(null);
    const [q3, setQ3] = useState(null);
    const [q4, setQ4] = useState(null);
    const [q5, setQ5] = useState(null);
    const [q6, setQ6] = useState(null);
    const [q7, setQ7] = useState(null);
    const [q8, setQ8] = useState(null);
    const [q9, setQ9] = useState(null);
    const [q10, setQ10] = useState(null);
    const [q11, setQ11] = useState(null);
    const [q12, setQ12] = useState(null);
    const [q13, setQ13] = useState(null);
    const [q14, setQ14] = useState(null);
    const [q15, setQ15] = useState(null);
    const [q16, setQ16] = useState(null);
    const [q17, setQ17] = useState(null);
    const [q18, setQ18] = useState(null);
    const [q19, setQ19] = useState(null);
    const [q20, setQ20] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    
    // Using the Gemini API key from environment variables
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    function parseStringToJson(inputString) {
        // Log the raw input for debugging
        console.log("Raw response:", inputString);
        
        try {
            // First, try to find a JSON object in the string
            const jsonRegex = /{[\s\S]*?}/g;
            const matches = inputString.match(jsonRegex);
            
            if (matches && matches.length > 0) {
                // Use the first match that can be parsed as valid JSON
                for (const match of matches) {
                    try {
                        return JSON.parse(match);
                    } catch (e) {
                        console.log("Failed to parse match:", match);
                        // Continue to the next match
                    }
                }
            }
            
            // If no valid JSON object found, try to clean up markdown and parse
            let cleanedString = inputString;
            
            // Remove markdown code blocks
            cleanedString = cleanedString.replace(/```json\n?|\n?```/g, "");
            
            // Remove any non-JSON lines that might be before or after the JSON object
            const jsonStartIndex = cleanedString.indexOf('{');
            const jsonEndIndex = cleanedString.lastIndexOf('}') + 1;
            
            if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                cleanedString = cleanedString.substring(jsonStartIndex, jsonEndIndex);
            }
            
            // Try to parse the cleaned string
            return JSON.parse(cleanedString);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            
            // If all else fails, create a structured object from the text
            try {
                // Create a default structure
                const fallbackJson = {
                    diagnosis: "Could not parse diagnosis from response",
                    specialist: "Could not parse specialist from response",
                    treatment_options: ["Could not parse treatment options from response"]
                };
                
                // Try to extract fields from the text
                const diagnosisMatch = inputString.match(/diagnosis[:\s]+(.*?)(?=specialist|treatment|$)/i);
                const specialistMatch = inputString.match(/specialist[:\s]+(.*?)(?=diagnosis|treatment|$)/i);
                const treatmentMatch = inputString.match(/treatment[:\s]+(.*?)(?=diagnosis|specialist|$)/i);
                
                if (diagnosisMatch && diagnosisMatch[1]) {
                    fallbackJson.diagnosis = diagnosisMatch[1].trim();
                }
                
                if (specialistMatch && specialistMatch[1]) {
                    fallbackJson.specialist = specialistMatch[1].trim();
                }
                
                if (treatmentMatch && treatmentMatch[1]) {
                    fallbackJson.treatment_options = treatmentMatch[1]
                        .split(/[,;]/)
                        .map(item => item.trim())
                        .filter(item => item.length > 0);
                }
                
                return fallbackJson;
            } catch (e) {
                console.error("Failed to create fallback JSON:", e);
                return {
                    diagnosis: "Error parsing response",
                    specialist: "Unknown",
                    treatment_options: ["Please try again with more specific information"]
                };
            }
        }
    }

    const fetchData = async () => {
        setError(null);
        try {
            // Get the generative model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Create a more specific prompt to ensure JSON format
            const prompt = `
Based on the following responses to OCD screening questions, provide an assessment for Obsessive-Compulsive Disorder (OCD):

1. Do you have unwanted thoughts, images, or urges that repeatedly enter your mind? (${q1})
2. Do you feel driven to perform certain behaviors or mental acts in response to these thoughts? (${q2})
3. Do these thoughts or behaviors cause you significant distress or anxiety? (${q3})
4. Do these thoughts or behaviors take up more than an hour of your day? (${q4})
5. Do these thoughts or behaviors interfere with your work, social life, or relationships? (${q5})
6. Do you try to resist these thoughts or behaviors? (${q6})
7. Do you feel that these thoughts or behaviors are excessive or unreasonable? (${q7})
8. Do you have difficulty controlling these thoughts or behaviors? (${q8})
9. Do you experience significant anxiety or distress if you try to resist these thoughts or behaviors? (${q9})
10. Do you feel that these thoughts or behaviors are a part of who you are? (${q10})
11. Do you feel that these thoughts or behaviors are caused by something outside of your control? (${q11})
12. Do you feel that these thoughts or behaviors are a sign of weakness or failure? (${q12})
13. Do you feel that these thoughts or behaviors are a sign of mental illness? (${q13})
14. Do you feel that these thoughts or behaviors are a sign of being "crazy"? (${q14})
15. Do you feel that these thoughts or behaviors are a sign of being "bad"? (${q15})
16. Do you feel that these thoughts or behaviors are a sign of being "different"? (${q16})
17. Do you feel that these thoughts or behaviors are a sign of being "weird"? (${q17})
18. Do you feel that these thoughts or behaviors are a sign of being "abnormal"? (${q18})
19. Do you feel that these thoughts or behaviors are a sign of being "sick"? (${q19})
20. Do you feel that these thoughts or behaviors are a sign of being "broken"? (${q20})

Based on these responses, provide a preliminary assessment for Obsessive-Compulsive Disorder, recommend a specialist, and suggest treatment options.

IMPORTANT: Format your response as a valid JSON object with exactly these fields:
{
  "diagnosis": "Your assessment here (including likelihood of OCD)",
  "specialist": "Recommended specialist here",
  "treatment_options": ["Option 1", "Option 2", "Option 3"]
}

Do not include any explanations or additional text outside of this JSON structure.
`;

            // Generate content using the updated SDK
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse JSON response
            const res = parseStringToJson(text);
            console.log("Parsed data:", res);
            
            if (!res || typeof res !== 'object') {
                throw new Error("Invalid response format");
            }
            
            setApiData(res);
        } catch (error) {
            console.error("Error fetching data from Gemini:", error);
            setError("There was an error processing your request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting OCD assessment data");
        fetchData();
    };

    const handleYouTubeIconClick = (element) => {
        // Navigate with query parameters
        navigate(`/yt/${encodeURIComponent(element)}`);
    };

    return (
        <div className="flex flex-col items-center container mx-auto">
            <div className="flex justify-center flex-col items-center bg-gray-300 px-10 rounded my-10 min-h-[60vh] min-w-[40vw]">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {apiData ? (
                    <>
                        {apiData.diagnosis && apiData.specialist && apiData.treatment_options ? (
                            <>
                                <h1 className="font-poppins text-3xl text-start">OCD Assessment</h1>
                                <h1 className="font-poppins text-xl text-gray-500 text-start">{apiData.diagnosis}</h1>
                                <h1 className="font-poppins text-3xl text-start">Specialist Doctor</h1>
                                <h1 className="font-poppins text-xl text-gray-500 text-start">{apiData.specialist}</h1>
                                <h1 className="font-poppins text-3xl text-start">Treatment Options</h1>
                                {apiData.treatment_options.map((element, index) => (
                                    <div className="flex items-center" key={index}>
                                        <h1 className="font-poppins text-xl text-gray-600 mr-4">{element}</h1>
                                        <YouTubeIcon className="text-red-700 cursor-pointer" onClick={() => handleYouTubeIconClick(element)} />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <h1 className="font-poppins">No Assessment Available</h1>
                        )}
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold font-poppins mb-4">Obsessive-Compulsive Disorder Assessment</h1>
                        <div className="flex justify-center mt-5 mb-5">
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-center w-full items-center flex-col mb-6">
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q1" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            1. Do you have unwanted thoughts, images, or urges that repeatedly enter your mind?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q1"
                                            value={q1 || ""}
                                            onChange={(e) => setQ1(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q2" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            2. Do you feel driven to perform certain behaviors or mental acts in response to these thoughts?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q2"
                                            value={q2 || ""}
                                            onChange={(e) => setQ2(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q3" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            3. Do these thoughts or behaviors cause you significant distress or anxiety?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q3"
                                            value={q3 || ""}
                                            onChange={(e) => setQ3(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q4" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            4. Do these thoughts or behaviors take up more than an hour of your day?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q4"
                                            value={q4 || ""}
                                            onChange={(e) => setQ4(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q5" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            5. Do these thoughts or behaviors interfere with your work, social life, or relationships?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q5"
                                            value={q5 || ""}
                                            onChange={(e) => setQ5(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q6" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            6. Do you try to resist these thoughts or behaviors?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q6"
                                            value={q6 || ""}
                                            onChange={(e) => setQ6(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q7" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            7. Do you feel that these thoughts or behaviors are excessive or unreasonable?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q7"
                                            value={q7 || ""}
                                            onChange={(e) => setQ7(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q8" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            8. Do you have difficulty controlling these thoughts or behaviors?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q8"
                                            value={q8 || ""}
                                            onChange={(e) => setQ8(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q9" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            9. Do you experience significant anxiety or distress if you try to resist these thoughts or behaviors?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q9"
                                            value={q9 || ""}
                                            onChange={(e) => setQ9(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q10" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            10. Do you feel that these thoughts or behaviors are a part of who you are?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q10"
                                            value={q10 || ""}
                                            onChange={(e) => setQ10(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q11" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            11. Do you feel that these thoughts or behaviors are caused by something outside of your control?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q11"
                                            value={q11 || ""}
                                            onChange={(e) => setQ11(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q12" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            12. Do you feel that these thoughts or behaviors are a sign of weakness or failure?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q12"
                                            value={q12 || ""}
                                            onChange={(e) => setQ12(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q13" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            13. Do you feel that these thoughts or behaviors are a sign of mental illness?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q13"
                                            value={q13 || ""}
                                            onChange={(e) => setQ13(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q14" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            14. Do you feel that these thoughts or behaviors are a sign of being "crazy"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q14"
                                            value={q14 || ""}
                                            onChange={(e) => setQ14(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q15" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            15. Do you feel that these thoughts or behaviors are a sign of being "bad"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q15"
                                            value={q15 || ""}
                                            onChange={(e) => setQ15(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q16" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            16. Do you feel that these thoughts or behaviors are a sign of being "different"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q16"
                                            value={q16 || ""}
                                            onChange={(e) => setQ16(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q17" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            17. Do you feel that these thoughts or behaviors are a sign of being "weird"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q17"
                                            value={q17 || ""}
                                            onChange={(e) => setQ17(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q18" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            18. Do you feel that these thoughts or behaviors are a sign of being "abnormal"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q18"
                                            value={q18 || ""}
                                            onChange={(e) => setQ18(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q19" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            19. Do you feel that these thoughts or behaviors are a sign of being "sick"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q19"
                                            value={q19 || ""}
                                            onChange={(e) => setQ19(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="q20" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            20. Do you feel that these thoughts or behaviors are a sign of being "broken"?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="q20"
                                            value={q20 || ""}
                                            onChange={(e) => setQ20(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Never">Never</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Often">Often</option>
                                            <option value="Very Often">Very Often</option>
                                        </select>
                                    </div>

                                    <div className="w-full px-3 flex justify-center">
                                        {loading ? (
                                            <div role="status">
                                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        ) : (
                                            <button type="submit" className="text-white w-fit cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OCD;