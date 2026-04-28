import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)


def generate_proposal(lead_data: dict) -> dict:

    prompt = PromptTemplate(
        input_variables=["name", "goal", "timeline", "budget", "format"],
        template="""
        You are a coaching business proposal writer.

        Based on this lead's information, generate 3 coaching package options.

        Lead details:
        - Name: {name}
        - Goal: {goal}
        - Timeline: {timeline}
        - Budget: {budget}
        - Preferred format: {format}

        For each package provide:
        - Package name
        - Duration
        - Format (1:1 calls, group, WhatsApp support etc)
        - Key deliverables (3-4 bullet points)
        - Price

        Make packages realistic, affordable, and tailored to their goal.
        Go from basic to premium.

        Format your response like this:

        PACKAGE 1:
        Name: <name>
        Duration: <duration>
        Format: <format>
        Deliverables:
        - <point 1>
        - <point 2>
        - <point 3>
        Price: <price>

        PACKAGE 2:
        ...

        PACKAGE 3:
        ...
        """
    )

    chain = prompt | llm
    response = chain.invoke({
        "name": lead_data.get("name"),
        "goal": lead_data.get("goal"),
        "timeline": lead_data.get("timeline"),
        "budget": lead_data.get("budget"),
        "format": lead_data.get("format")
    })

    raw = response.content.strip()
    packages = parse_packages(raw)

    return {
        "raw": raw,
        "packages": packages
    }


def parse_packages(text: str) -> list:
    packages = []
    # split by PACKAGE keyword
    blocks = text.split("PACKAGE")

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        package = {}
        lines = block.split("\n")

        for line in lines:
            line = line.strip()
            if line.startswith("Name:"):
                package["name"] = line.replace("Name:", "").strip()
            elif line.startswith("Duration:"):
                package["duration"] = line.replace("Duration:", "").strip()
            elif line.startswith("Format:"):
                package["format"] = line.replace("Format:", "").strip()
            elif line.startswith("Price:"):
                package["price"] = line.replace("Price:", "").strip()
            elif line.startswith("- "):
                if "deliverables" not in package:
                    package["deliverables"] = []
                package["deliverables"].append(line.replace("- ", "").strip())

        if package.get("name"):
            packages.append(package)

    return packages