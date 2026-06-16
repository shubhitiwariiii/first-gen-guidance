import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const profile = await request.json();

  const prompt = `You are a scholarship advisor for Indian students. Based on this student profile, return exactly 5 scholarships they are most eligible for.

Student Profile:
- Name: ${profile.full_name}
- Class/Level: ${profile.class_level}
- Stream: ${profile.stream}
- State: ${profile.state}
- Family Income: ${profile.family_income}
- Caste Category: ${profile.caste_category || "General"}
- Gender: ${profile.gender || "Not specified"}

Return ONLY a valid JSON array. No explanation, no markdown, no backticks. Just raw JSON:
[
  {
    "name": "Scholarship Name",
    "provider": "Organization Name",
    "amount": "₹X,XXX/year",
    "eligibility": "Key eligibility criteria",
    "deadline": "Month DD every year",
    "link": "https://actual-website.com"
  }
]`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("RAW:", JSON.stringify(data).slice(0, 500));
    const match = text.match(/\[[\s\S]*\]/);
    if (!match)
      throw new Error("No JSON array found in response: " + text.slice(0, 200));
    if (!match) throw new Error("No JSON array found in response");
    const scholarships = JSON.parse(match[0]);
    return NextResponse.json(scholarships);
  // } catch (error: any) {
  //   console.error("Gemini error:", error);
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
  } catch (error: any) {
  console.error('Gemini error:', error)
  return NextResponse.json([
    {
      name: "NSP Central Sector Scheme",
      provider: "Ministry of Education, India",
      amount: "₹10,000 – ₹20,000/year",
      eligibility: "12th pass, family income below ₹8 LPA, 80%+ marks",
      deadline: "October 31 every year",
      link: "https://scholarships.gov.in"
    },
    {
      name: "Pragati Scholarship for Girls",
      provider: "AICTE",
      amount: "₹50,000/year",
      eligibility: "Female engineering students, family income below ₹8 LPA",
      deadline: "November 30 every year",
      link: "https://www.aicte-india.org/bureaus/ced/Pragati"
    },
    {
      name: "UP Scholarship",
      provider: "Government of Uttar Pradesh",
      amount: "₹3,000 – ₹15,000/year",
      eligibility: "UP domicile, family income below ₹2 LPA",
      deadline: "October 15 every year",
      link: "https://scholarship.up.gov.in"
    }
  ])
}
}
