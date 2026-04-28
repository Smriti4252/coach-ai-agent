import os
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)


def generate_welcome_message(client_data: dict) -> str:

    prompt = PromptTemplate(
        input_variables=["name", "goal", "package", "first_session"],
        template="""
        You are an onboarding assistant for an online coaching business.

        Write a warm welcome message for a new paying client.

        Client details:
        - Name: {name}
        - Goal: {goal}
        - Package they chose: {package}
        - First session date: {first_session}

        The message should:
        - Welcome them genuinely
        - Remind them of their goal and why they made the right decision
        - Tell them what to expect next
        - Mention their first session date
        - End with an encouraging note

        Keep it under 150 words. Warm and human, not corporate.
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": client_data.get("name"),
        "goal": client_data.get("goal"),
        "package": client_data.get("package"),
        "first_session": client_data.get("first_session")
    })

    return response.content.strip()


def generate_onboarding_checklist(client_data: dict) -> dict:

    prompt = PromptTemplate(
        input_variables=["name", "goal", "format"],
        template="""
        Create a simple onboarding checklist for a new coaching client.

        Client details:
        - Name: {name}
        - Goal: {goal}
        - Coaching format: {format}

        Generate 5-7 onboarding steps they need to complete before their first session.
        These can include things like:
        - Filling a goal-setting form
        - Signing a coaching agreement
        - Joining a WhatsApp group
        - Completing an intake questionnaire
        - Setting up their first session link

        Tailor the steps to their goal and format.

        Format:
        STEP 1: <action>
        STEP 2: <action>
        ...
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": client_data.get("name"),
        "goal": client_data.get("goal"),
        "format": client_data.get("format")
    })

    raw = response.content.strip()
    steps = parse_checklist(raw)

    return {
        "welcome_checklist": steps,
        "raw": raw
    }


def generate_followup_message(client_data: dict, session_number: int) -> str:

    prompt = PromptTemplate(
        input_variables=["name", "goal", "session_number"],
        template="""
        Write a short follow-up message for a coaching client after session {session_number}.

        Client details:
        - Name: {name}
        - Goal: {goal}

        The message should:
        - Acknowledge the session they just completed
        - Encourage them to keep going
        - Remind them of their next step or homework
        - Be under 80 words, casual and warm
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": client_data.get("name"),
        "goal": client_data.get("goal"),
        "session_number": str(session_number)
    })

    return response.content.strip()


def parse_checklist(text: str) -> list:
    steps = []
    lines = text.split("\n")

    for line in lines:
        line = line.strip()
        if line.startswith("STEP"):
            # remove "STEP 1:" prefix and keep the action
            parts = line.split(":", 1)
            if len(parts) == 2:
                steps.append(parts[1].strip())

    return steps