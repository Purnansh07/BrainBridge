# BrainBridge - https://brain-bridge-tau.vercel.app/

A web application for neurological disorder assessment and support.

## Features

- Authentication with Clerk
- Autism assessment using Gemini AI
- OCD assessment using Gemini AI
- Dyslexia assessment using Gemini AI
- Interactive chatbot for support and guidance
- YouTube video recommendations for therapy

## Deployment to Vercel

### Prerequisites

- A Vercel account
- A GitHub repository with your code
- API keys for:
  - Clerk (for authentication)
  - Google Gemini (for AI assessments)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neuroassist.git
   cd neuroassist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. Set up Clerk Authentication
   - Sign up for a Clerk account at [clerk.com](https://clerk.com)
   - Create a new application
   - Get your publishable key from the Clerk dashboard
   - Replace the placeholder in `src/App.jsx` with your actual publishable key:
   ```jsx
   const clerkPubKey = "pk_test_YOUR_CLERK_PUBLISHABLE_KEY";
   ```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- React
- Vite
- Tailwind CSS
- Clerk Authentication
- Google Gemini AI
- Material UI

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<img src="https://ik.imagekit.io/g5vnu7nfy/public/logo.webp?updatedAt=1708871578766" width="100" alt="App Screenshot">

 is an innovative project aimed at diagnosing neural diseases in children using a combination of large language models and specialized machine learning algorithms. The project focuses on providing an initial diagnosis through language processing, allowing users to input symptoms and receive preliminary assessments. It further validates these results using dedicated machine learning models tailored to specific neural disorders, providing binary responses for confirmation.

#Tech Stack 

- Frontend -> Reactjs
- Backend ->Flask
- ML libraries-> Sklearn,Intel's Optimization for XGBoost,Intel's Extension for Scikit-learn,Intel's Distribution of Modin
- Deployment -> IDC(Intel Developer Cloud)

## Features

- **Initial Diagnosis:**
  - Utilizes large language models for preliminary assessments.
  - Users can input symptoms to initiate the diagnostic process.

- **Specialized Machine Learning Models:**
  - Tailored models for specific neural disorders.
  - Provides binary responses for accurate validation.

- **User-Friendly Interface:**
  - Intuitive design for a seamless user experience.
  - Simplifies the neural disease diagnosis process.

- **Multimedia Resources:**
  - Recommends YouTube videos for detailed treatment plan explanations.
  - Visual and auditory aids enhance user understanding.

- **Comprehensive Content:**
  - Blogs and articles covering various neural diseases.
  - In-depth insights into treatment options and advancements.

- **Accessible Education:**
  - Informative content designed for non-experts.
  - Enhances user understanding of neural disorders.

- **Streamlined Decision-Making:**
  - Supports informed healthcare choices.
  - Integrates technology to improve efficiency.

- **Continuous Learning:**
  - Adapts to new medical knowledge and advancements.
  - Incorporates the latest information for up-to-date results.

- **Transparent Results:**
  - Clear outcomes from both language models and machine learning models.
  - Provides understandable recommendations.

- **Responsive Support:**
  - User assistance throughout the diagnostic process.
  - Addresses user queries and concerns.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Krishnan9074/neuroassist.git
   ```

2. **Install dependencies:**

   ```bash
   cd neuro-assist
   npm install
   ```

3. **Run the application:**

   ```bash
   npm run dev
   ```
4. **Switch to backend:**
    ```bash
   cd backend
   ```
5. **Install dependencies:**

   ```bash
   pip install requirements.txt
   ```
5. **Run Server:**

   ```bash
   python3 ./app.py
   ```
   
**Backend**

go into api directory using command

```bash
cd api/
```
run server on port 5000 by running command

```bash
 python3 app.py
```

Model was trained on virtual machine by ssh using commands

```bash
 ssh -L 8888:localhost:8888 -J guest@146.152.232.8 ubuntu@100.82.14.144
```

```bash
Running jupyter notebook on localhost:8000
```


## Screenshots

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20191316.png?updatedAt=1708871586198)


![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20195624.png?updatedAt=1708871585644)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20191454.png?updatedAt=1708871589319)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20191657.png?updatedAt=1708871582241)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20195206.png?updatedAt=1708871582491)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20195328.png?updatedAt=1708871589172)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20191532.png?updatedAt=1708871585833)


![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/Screenshot%202024-02-25%20195845.png?updatedAt=1708871586240)

![App Screenshot](https://ik.imagekit.io/g5vnu7nfy/public/logo.webp?updatedAt=1708871578766)







