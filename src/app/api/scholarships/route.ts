import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const profile = await request.json()

  // Static scholarships relevant to most Indian students
  const scholarships = [
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
      name: "Ishan Uday Scholarship",
      provider: "UGC",
      amount: "₹5,400 – ₹7,800/month",
      eligibility: "Students from North-East region pursuing UG",
      deadline: "December 31 every year",
      link: "https://scholarships.gov.in"
    },
    {
      name: "UP Scholarship (State Government)",
      provider: "Government of Uttar Pradesh",
      amount: "₹3,000 – ₹15,000/year",
      eligibility: "UP domicile, family income below ₹2 LPA",
      deadline: "October 15 every year",
      link: "https://scholarship.up.gov.in"
    },
    {
      name: "Vidyasaarathi Scholarship",
      provider: "NSDL e-Governance",
      amount: "₹10,000 – ₹75,000/year",
      eligibility: "Merit-based, various streams, income below ₹6 LPA",
      deadline: "Rolling basis",
      link: "https://www.vidyasaarathi.co.in"
    }
  ]

  return NextResponse.json(scholarships)
}