import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const profile = await request.json()

    const prompt = `
You are a scholarship advisor for Indian students.
Based on this student profile, suggest 5 relevant Indian scholarships.

Student Profile:
- Name: ${profile.full_name}
- Class: ${profile.class_level}
- Stream: ${profile.stream}
- State: ${profile.state}
- Annual Family Income: ${profile.family_income}
- First Generation Student: ${profile.is_first_gen ? 'Yes' : 'No'}

Return ONLY a JSON array with this exact format, no explanation:
[
  {
    "name": "Scholarship name",
    "provider": "Who provides it",
    "amount": "Amount in rupees",
    "eligibility": "Key eligibility in one line",
    "deadline": "Typical deadline",
    "link": "Official website URL"
  }
]
`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const scholarships = JSON.parse(clean)

    return NextResponse.json(scholarships)
  } catch (error: any) {
    console.error('Gemini error:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}