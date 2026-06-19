import { NextResponse } from "next/server";

function getProviderFallback(provider: string): string {
  const p = provider.toLowerCase();
  if (p.includes("hdfc"))
    return "https://www.hdfcbank.com/personal/online-banking/aro/parivartan-scholarship";
  if (p.includes("aicte")) return "https://www.aicte-india.org";
  if (p.includes("ugc")) return "https://www.ugc.gov.in";
  if (p.includes("up") || p.includes("uttar pradesh"))
    return "https://scholarship.up.gov.in";
  if (p.includes("sitaram jindal"))
    return "https://www.sitaramjindalfoundation.org";
  if (p.includes("colgate")) return "https://www.keepindiasmiling.com";
  if (p.includes("aditya birla"))
    return "https://www.adityabirlacapital.com/scholarship";
  if (p.includes("tata")) return "https://www.tatatrusts.org";
  if (p.includes("reliance")) return "https://www.reliancefoundation.org";
  if (p.includes("swami dayanand"))
    return "https://www.sdef.org.in";
  if (p.includes("nsdl") || p.includes("vidyasaarathi"))
    return "https://www.vidyasaarathi.co.in";
  if (p.includes("indian oil") || p.includes("indianoil"))
    return "https://iocl.com";
  return "https://scholarships.gov.in"; // default for govt/unknown
}

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

    // Verify links are live, replace broken ones with a relevant provider fallback
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
          return { ...s, link: getProviderFallback(s.provider) };
        } catch {
          return { ...s, link: getProviderFallback(s.provider) };
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