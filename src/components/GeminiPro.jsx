import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useNavigate } from "react-router";

function GeminiPro() {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [functionalLimitations, setFunctionalLimitations] = useState("");
  const [error, setError] = useState(null);
  
  // Using environment variable for API key
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
          preliminary_diagnosis: "Could not parse diagnosis from response",
          specialist_doctor: "Could not parse specialist from response",
          treatment_options: ["Could not parse treatment options from response"]
        };
        
        // Try to extract fields from the text
        const diagnosisMatch = inputString.match(/diagnosis[:\s]+(.*?)(?=specialist|treatment|$)/i);
        const specialistMatch = inputString.match(/specialist[:\s]+(.*?)(?=diagnosis|treatment|$)/i);
        const treatmentMatch = inputString.match(/treatment[:\s]+(.*?)(?=diagnosis|specialist|$)/i);
        
        if (diagnosisMatch && diagnosisMatch[1]) {
          fallbackJson.preliminary_diagnosis = diagnosisMatch[1].trim();
        }
        
        if (specialistMatch && specialistMatch[1]) {
          fallbackJson.specialist_doctor = specialistMatch[1].trim();
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
          preliminary_diagnosis: "Error parsing response",
          specialist_doctor: "Unknown",
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
The age of the person is ${age}
The gender of the person is ${gender}
Medical history: ${medicalHistory}
Symptoms: ${symptoms}
Functional limitations: ${functionalLimitations}

Based on this information, provide a preliminary research-purpose diagnosis of a possible neurological disorder, recommend a specialist doctor, and suggest treatment options.

IMPORTANT: Format your response as a valid JSON object with exactly these fields:
{
  "preliminary_diagnosis": "Your diagnosis here",
  "specialist_doctor": "Recommended specialist here",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(name, gender, age, medicalHistory, symptoms, functionalLimitations);
    fetchData();
  };

  const navigate = useNavigate();

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
            {apiData.preliminary_diagnosis && apiData.specialist_doctor && apiData.treatment_options ? (
              <>
                <h1 className="font-poppins text-3xl text-start">Preliminary Diagnosis</h1>
                <h1 className="font-poppins text-xl text-gray-500 text-start">{apiData.preliminary_diagnosis}</h1>
                <h1 className="font-poppins text-3xl text-start">Specialist Doctor</h1>
                <h1 className="font-poppins text-xl text-gray-500 text-start">{apiData.specialist_doctor}</h1>
                <h1 className="font-poppins text-3xl text-start">Treatment Options</h1>
                {apiData.treatment_options.map((element, index) => (
                  <div className="flex items-center" key={index}>
                    <h1 className="font-poppins text-xl text-gray-600 mr-4">{element}</h1>
                    <YouTubeIcon className="text-red-700 cursor-pointer" onClick={() => handleYouTubeIconClick(element)} />
                  </div>
                ))}
              </>
            ) : (
              <h1 className="font-poppins">No Disorder Found</h1>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold font-poppins mb-4">Diagnosis of Neurological Disorders</h1>
            <div className="flex justify-center mt-5 mb-5">
              <form>
                <div className="flex justify-center w-full items-center flex-col mb-6">
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="name" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="gender" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Gender
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="age" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="medicalHistory" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Medical History: Past diagnoses, current medications, family history of neurological disorders, etc.
                    </label>
                    <textarea
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="medicalHistory"
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="symptoms" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Symptoms: Specific symptoms experienced, onset and duration, severity, impact on daily life, etc.
                    </label>
                    <textarea
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label htmlFor="functionalLimitations" className="font-poppins block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Functional Limitations: Difficulties with mobility, speech, cognitive function, etc.
                    </label>
                    <textarea
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="functionalLimitations"
                      value={functionalLimitations}
                      onChange={(e) => setFunctionalLimitations(e.target.value)}
                    />
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
                      <div onClick={handleSubmit} className="text-white w-fit cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</div>
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
}

export default GeminiPro;