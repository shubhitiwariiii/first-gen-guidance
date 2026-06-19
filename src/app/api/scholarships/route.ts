import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const profile = await request.json();

  const prompt = `You are a scholarship advisor for Indian students. Based on this student profile, return exactly 5 scholarships they are most eligible for, ranked by best match first.

Student Profile:
- Name: ${profile.full_name}
- Class/Level: ${profile.class_level}
- Stream: ${profile.stream}
- State: ${profile.state}
- Family Income: ${profile.family_income}
- Caste Category: ${profile.caste_category || "General"}
- Gender: ${profile.gender || "Not specified"}

IMPORTANT: For the "link" field, ONLY use the official organization's main homepage URL (e.g. https://scholarships.gov.in, https://www.aicte-india.org, https://www.hdfcbank.com) — NOT a specific scheme sub-page, since those change frequently and break. Use only well-known, stable government or organization domains you are confident exist.

For each scholarship, calculate a match_score (0-100) based on how well the student's profile fits the eligibility criteria — consider income bracket fit, stream relevance, state/domicile match, and class level fit. Also give a one-line match_reason explaining the score.

Return ONLY a valid JSON array, sorted by match_score descending. No explanation, no markdown, no backticks. Just raw JSON:
[
  {
    "name": "Scholarship Name",
    "provider": "Organization Name",
    "amount": "₹X,XXX/year",
    "eligibility": "Key eligibility criteria",
    "deadline": "Month DD every year",
    "link": "https://actual-website.com",
    "match_score": 92,
    "match_reason": "Perfect income and stream match for UP domicile"
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
    const scholarships = JSON.parse(match[0]);

    // Verify links are live, replace broken ones with a safe fallback
    const verifiedScholarships = await Promise.all(
      scholarships.map(async (s: any) => {
        try {
          const checkRes = await fetch(s.link, {
            method: "HEAD",
            signal: AbortSignal.timeout(3000),
          });
          if (checkRes.ok || checkRes.status < 400) {
            return s;
          }
          return { ...s, link: "https://scholarships.gov.in" };
        } catch {
          return { ...s, link: "https://scholarships.gov.in" };
        }
      }),
    );

    return NextResponse.json(verifiedScholarships);
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json([
      {
        name: "NSP Central Sector Scheme",
        provider: "Ministry of Education, India",
        amount: "₹10,000 – ₹20,000/year",
        eligibility: "12th pass, family income below ₹8 LPA, 80%+ marks",
        deadline: "October 31 every year",
        link: "https://scholarships.gov.in",
      },
      {
        name: "Pragati Scholarship for Girls",
        provider: "AICTE",
        amount: "₹50,000/year",
        eligibility: "Female engineering students, family income below ₹8 LPA",
        deadline: "November 30 every year",
        link: "https://www.aicte-india.org/bureaus/ced/Pragati",
      },
      {
        name: "UP Scholarship",
        provider: "Government of Uttar Pradesh",
        amount: "₹3,000 – ₹15,000/year",
        eligibility: "UP domicile, family income below ₹2 LPA",
        deadline: "October 15 every year",
        link: "https://scholarship.up.gov.in",
      },
    ]);
  }
}