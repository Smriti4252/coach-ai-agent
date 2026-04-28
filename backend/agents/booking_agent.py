import os
from datetime import datetime, timedelta
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)


def generate_time_slots() -> list:
    slots = []
    base = datetime.now()

    # generate 3 slots over the next 3 days
    for i in range(1, 4):
        day = base + timedelta(days=i)

        # skip weekends
        if day.weekday() >= 5:
            continue

        slot = day.replace(hour=10, minute=0, second=0, microsecond=0)
        slots.append(slot.strftime("%A, %B %d at %I:%M %p"))

    # fallback if all 3 days were weekends
    if not slots:
        fallback = base + timedelta(days=3)
        slots.append(fallback.strftime("%A, %B %d at %I:%M %p"))

    return slots


def suggest_slots(lead_data: dict) -> dict:

    slots = generate_time_slots()
    slots_text = "\n".join(f"- {s}" for s in slots)

    prompt = PromptTemplate(
        input_variables=["name", "goal", "slots"],
        template="""
        You are a booking assistant for an online coaching business.

        Write a short, friendly message to {name} suggesting discovery call slots.
        Their goal is: {goal}

        Available slots:
        {slots}

        Keep the message under 5 sentences.
        End with asking them to reply with their preferred slot number.
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": lead_data.get("name"),
        "goal": lead_data.get("goal"),
        "slots": slots_text
    })

    return {
        "slots": slots,
        "message": response.content.strip()
    }


def confirm_booking(lead_data: dict, chosen_slot: str) -> str:

    prompt = PromptTemplate(
        input_variables=["name", "slot", "goal"],
        template="""
        Write a short confirmation message for {name}.
        They just booked a discovery call on {slot}.
        Their coaching goal is: {goal}

        Keep it warm, professional, and under 4 sentences.
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": lead_data.get("name"),
        "slot": chosen_slot,
        "goal": lead_data.get("goal")
    })

    return response.content.strip()