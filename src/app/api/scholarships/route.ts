import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  const profile = await request.json()

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a scholarship advisor for Indian students. Based on this student profile, return exactly 5 scholarships they are most eligible for.

Student Profile:
- Name: ${profile.full_name}
- Class/Level: ${profile.class_level}
- Stream: ${profile.stream}
- State: ${profile.state}
- Family Income: ${profile.family_income}
- Caste Category: ${profile.caste_category || 'General'}
- Gender: ${profile.gender || 'Not specified'}

Return ONLY a valid JSON array. No explanation, no markdown, no backticks. Just the raw JSON array like this:
[
  {
    "name": "Scholarship Name",
    "provider": "Organization Name",
    "amount": "₹X,XXX/year",
    "eligibility": "Key eligibility criteria",
    "deadline": "Month DD every year",
    "link": "https://actual-website.com"
  }
]

Focus on real Indian government and private scholarships. Match based on state, stream, income, gender, and caste category.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const cleaned = text.replace(/```json|```/g, '').trim()
    const scholarships = JSON.parse(cleaned)

    return NextResponse.json(scholarships)

  // } catch (error: any) {
  //   console.error('Gemini error:', error)

  //   // Fallback to static if Gemini fails
  //   const fallback = [
  //     {
  //       name: "NSP Central Sector Scheme",
  //       provider: "Ministry of Education, India",
  //       amount: "₹10,000 – ₹20,000/year",
  //       eligibility: "12th pass, family income below ₹8 LPA, 80%+ marks",
  //       deadline: "October 31 every year",
  //       link: "https://scholarships.gov.in"
  //     },
  //     {
  //       name: "Pragati Scholarship for Girls",
  //       provider: "AICTE",
  //       amount: "₹50,000/year",
  //       eligibility: "Female engineering students, family income below ₹8 LPA",
  //       deadline: "November 30 every year",
  //       link: "https://www.aicte-india.org/bureaus/ced/Pragati"
  //     },
  //     {
  //       name: "UP Scholarship",
  //       provider: "Government of Uttar Pradesh",
  //       amount: "₹3,000 – ₹15,000/year",
  //       eligibility: "UP domicile, family income below ₹2 LPA",
  //       deadline: "October 15 every year",
  //       link: "https://scholarship.up.gov.in"
  //     },
  //     {
  //       name: "Vidyasaarathi Scholarship",
  //       provider: "NSDL e-Governance",
  //       amount: "₹10,000 – ₹75,000/year",
  //       eligibility: "Merit-based, various streams, income below ₹6 LPA",
  //       deadline: "Rolling basis",
  //       link: "https://www.vidyasaarathi.co.in"
  //     },
  //     {
  //       name: "Aicte Swanath Scholarship",
  //       provider: "AICTE",
  //       amount: "₹50,000/year",
  //       eligibility: "Orphans, wards of armed forces/paramilitary",
  //       deadline: "November 30 every year",
  //       link: "https://www.aicte-india.org"
  //     }
  //   ]

  //   return NextResponse.json(fallback)
  // }
  } catch (error: any) {
  console.error('Gemini error:', error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}
}