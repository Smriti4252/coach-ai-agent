import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)


def qualify_lead(lead_data: dict) -> dict:

    prompt = PromptTemplate(
        input_variables=["name", "goal", "timeline", "budget", "urgency", "format"],
        template="""
        You are a sales qualification assistant for an online coaching business.

        Analyze this lead and score them as HOT, WARM, or COLD.

        Lead details:
        - Name: {name}
        - Goal: {goal}
        - Timeline: {timeline}
        - Budget: {budget}
        - Urgency: {urgency}
        - Preferred format: {format}

        Scoring rules:
        - HOT: clear goal, budget above $200, wants to start within 2 weeks
        - WARM: has a goal, budget is moderate, timeline is 1-2 months
        - COLD: vague goal, low budget, no urgency

        Respond in this exact format:
        SCORE: <HOT or WARM or COLD>
        REASON: <one sentence explaining why>
        """
    )

    chain = prompt | llm
    response = chain.invoke(lead_data)
    output = response.content.strip()

    # parse the response
    lines = output.split("\n")
    score = "WARM"
    reason = "Could not determine score"

    for line in lines:
        if line.startswith("SCORE:"):
            score = line.replace("SCORE:", "").strip()
        if line.startswith("REASON:"):
            reason = line.replace("REASON:", "").strip()

    return {
        "score": score,
        "reason": reason
    }