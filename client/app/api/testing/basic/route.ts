import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export async function POST(req: NextRequest)
{
    try
    {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-pro",
            maxOutputTokens: 2048,
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
              },
            ],
          });
          const res = await model.invoke([
            [
              "human",
              "What is mern stack developer ?Answer in English",
            ],
          ]);
          
          console.log(res);
          return NextResponse.json({ success:true ,res}, { status: 200 },);
        
    }
    catch(error)
    {
        console.log(error)
    }

}