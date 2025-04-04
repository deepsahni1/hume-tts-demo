import dotenv from 'dotenv';

// Explicitly load the environment variables
dotenv.config();

// Print the loaded environment variables
console.log('HUME_API_KEY:', process.env.HUME_API_KEY);
console.log('All env variables:', process.env); 