import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router";
import YouTubeIcon from '@mui/icons-material/YouTube';

const Autism = () => {
    const [a1, setA1] = useState(null);
    const [a2, setA2] = useState(null);
    const [a3, setA3] = useState(null);
    const [a4, setA4] = useState(null);
    const [a5, setA5] = useState(null);
    const [a6, setA6] = useState(null);
    const [a7, setA7] = useState(null);
    const [a8, setA8] = useState(null);
    const [a9, setA9] = useState(null);
    const [a10, setA10] = useState(null);
    const [age, setAge] = useState(null);
    const [scoreByQChat, setScoreByQChat] = useState(null);
    const [sex, setSex] = useState(null);
    const [ethnicity, setEthinicity] = useState(null);
    const [bornWithJaundice, setBornWithJaundice] = useState(null);
    const [familyWithASD, setFamilyWithASD] = useState(null);
    const [applicant, setApplicant] = useState(null);
    const [whyAreYouTake, setWhyAreYouTake] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    
    // Using the Gemini API key
    const genAI = new GoogleGenerativeAI("AIzaSyBKBPYMggCSiY9JLtwk7PEEO7XCZwBC9Ss");

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
Based on the following information about a person, provide an assessment for Autism Spectrum Disorder (ASD):

Age: ${age}
Sex: ${sex}
Ethnicity: ${ethnicity}
Born with Jaundice: ${bornWithJaundice}
Family History of ASD: ${familyWithASD}
Applicant: ${applicant}
Reason for Assessment: ${whyAreYouTake}

Q-CHAT-10 Score: ${scoreByQChat}

Q-CHAT-10 Responses:
1. Does your child look at you when you call their name? (${a1})
2. How easy is it for you to get eye contact with your child? (${a2})
3. Does your child point to indicate that they want something? (${a3})
4. Does your child point to share interest with you? (${a4})
5. Does your child pretend? (${a5})
6. Does your child follow where you're looking? (${a6})
7. If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them? (${a7})
8. Would you describe your child's first words as: (${a8})
9. Does your child use simple gestures? (${a9})
10. Does your child stare at nothing with no apparent purpose? (${a10})

Based on this information, provide a preliminary assessment for Autism Spectrum Disorder, recommend a specialist, and suggest treatment options.

IMPORTANT: Format your response as a valid JSON object with exactly these fields:
{
  "diagnosis": "Your assessment here (including likelihood of ASD)",
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
        console.log("Submitting Autism assessment data");
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
                                <h1 className="font-poppins text-3xl text-start">Autism Assessment</h1>
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
                        <h1 className="text-3xl font-bold font-poppins mb-4">Autism Spectrum Disorder Assessment</h1>
                        <div className="flex justify-center mt-5 mb-5">
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-center w-full items-center flex-col mb-6">
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="age" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="age"
                                            value={age || ""}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="sex" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Sex
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="sex"
                                            value={sex || ""}
                                            onChange={(e) => setSex(e.target.value)}
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="ethnicity" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Ethnicity
                                        </label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="ethnicity"
                                            value={ethnicity || ""}
                                            onChange={(e) => setEthinicity(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="bornWithJaundice" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Born with Jaundice
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="bornWithJaundice"
                                            value={bornWithJaundice || ""}
                                            onChange={(e) => setBornWithJaundice(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="familyWithASD" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Family History of ASD
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="familyWithASD"
                                            value={familyWithASD || ""}
                                            onChange={(e) => setFamilyWithASD(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="applicant" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Applicant
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="applicant"
                                            value={applicant || ""}
                                            onChange={(e) => setApplicant(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Self">Self</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Healthcare Provider">Healthcare Provider</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="whyAreYouTake" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Reason for Assessment
                                        </label>
                                        <textarea
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="whyAreYouTake"
                                            value={whyAreYouTake || ""}
                                            onChange={(e) => setWhyAreYouTake(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="scoreByQChat" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Q-CHAT-10 Score
                                        </label>
                                        <input
                                            type="number"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="scoreByQChat"
                                            value={scoreByQChat || ""}
                                            onChange={(e) => setScoreByQChat(e.target.value)}
                                        />
                                    </div>
                                    
                                    <h2 className="text-xl font-bold font-poppins mb-4 mt-4">Q-CHAT-10 Questions</h2>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a1" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            1. Does your child look at you when you call their name?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a1"
                                            value={a1 || ""}
                                            onChange={(e) => setA1(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a2" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            2. How easy is it for you to get eye contact with your child?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a2"
                                            value={a2 || ""}
                                            onChange={(e) => setA2(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Very Easy">Very Easy</option>
                                            <option value="Quite Easy">Quite Easy</option>
                                            <option value="Quite Difficult">Quite Difficult</option>
                                            <option value="Very Difficult">Very Difficult</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a3" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            3. Does your child point to indicate that they want something?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a3"
                                            value={a3 || ""}
                                            onChange={(e) => setA3(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a4" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            4. Does your child point to share interest with you?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a4"
                                            value={a4 || ""}
                                            onChange={(e) => setA4(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a5" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            5. Does your child pretend?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a5"
                                            value={a5 || ""}
                                            onChange={(e) => setA5(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a6" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            6. Does your child follow where you're looking?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a6"
                                            value={a6 || ""}
                                            onChange={(e) => setA6(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a7" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            7. If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a7"
                                            value={a7 || ""}
                                            onChange={(e) => setA7(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a8" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            8. Would you describe your child's first words as:
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a8"
                                            value={a8 || ""}
                                            onChange={(e) => setA8(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Very Typical">Very Typical</option>
                                            <option value="Quite Typical">Quite Typical</option>
                                            <option value="Slightly Unusual">Slightly Unusual</option>
                                            <option value="Very Unusual">Very Unusual</option>
                                            <option value="Child Does Not Speak">Child Does Not Speak</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a9" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            9. Does your child use simple gestures?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a9"
                                            value={a9 || ""}
                                            onChange={(e) => setA9(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
                                        </select>
                                    </div>
                                    
                                    <div className="w-full px-3 mb-6">
                                        <label htmlFor="a10" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            10. Does your child stare at nothing with no apparent purpose?
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="a10"
                                            value={a10 || ""}
                                            onChange={(e) => setA10(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Always">Always</option>
                                            <option value="Usually">Usually</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Never">Never</option>
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

export default Autism;