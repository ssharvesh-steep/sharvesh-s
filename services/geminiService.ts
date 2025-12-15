import { GoogleGenAI } from "@google/genai";

const systemInstruction = `
You are "EcoBot Engineer", an expert robotics assistant. 
You are analyzing a DIY autonomous water cleaning robot simulation. 
The robot is made of:
- A Styrofoam cooler box (buoyancy body).
- Two paddle wheels made of popsicle sticks and DC motors (differential drive propulsion).
- A front-mounted net ramp (passive trash collection).
- HC-SR04 Ultrasonic sensors (obstacle avoidance).
- Solar panels (power augmentation).

Your job is to answer user questions about:
1. How to improve this specific design (e.g., better materials, gear ratios, sensor placement).
2. The physics of buoyancy and propulsion involved here.
3. Code logic for autonomous navigation (Arduino/C++ snippets if asked).
4. Environmental impact.

Keep answers concise, technical but accessible, and encouraging for DIY enthusiasts.
`;

export const sendMessageToGemini = async (history: { role: string; content: string }[], newMessage: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    
    // Format history for the API
    // The SDK manages history via the chat object, but since we are stateless between calls in this simple service wrapper,
    // we will reconstruct the chat or just use generateContent if the history is short. 
    // However, to maintain context properly with the SDK's Chat feature:
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the engineering database. Please check your API key.";
  }
};