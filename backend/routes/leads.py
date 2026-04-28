from fastapi import APIRouter, HTTPException
from database import get_db
from models import LeadForm
from agents.qualification_agent import qualify_lead
from agents.booking_agent import suggest_slots, confirm_booking
from agents.proposal_agent import generate_proposal
from agents.onboarding_agent import (
    generate_welcome_message,
    generate_onboarding_checklist,
    generate_followup_message
)

router = APIRouter()


@router.post("/submit")
async def submit_lead(lead: LeadForm):
    db = get_db()

    # convert form data to dict
    lead_data = lead.model_dump()

    # run qualification agent
    result = qualify_lead(lead_data)
    lead_data["score"] = result["score"]
    lead_data["score_reason"] = result["reason"]
    lead_data["status"] = "new"

    # save to mongodb
    inserted = await db.leads.insert_one(lead_data)
    lead_data["_id"] = str(inserted.inserted_id)

    # if HOT lead, suggest booking slots right away
    if result["score"] == "HOT":
        slots_result = suggest_slots(lead_data)
        return {
            "message": "Lead submitted and qualified",
            "score": result["score"],
            "reason": result["reason"],
            "next_step": "booking",
            "slots": slots_result["slots"],
            "booking_message": slots_result["message"],
            "lead_id": lead_data["_id"]
        }

    return {
        "message": "Lead submitted and qualified",
        "score": result["score"],
        "reason": result["reason"],
        "next_step": "nurture",
        "lead_id": lead_data["_id"]
    }


@router.post("/book/{lead_id}")
async def book_slot(lead_id: str, chosen_slot: str):
    db = get_db()
    from bson import ObjectId

    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # confirm the booking
    confirmation = confirm_booking(lead, chosen_slot)

    # update lead status in db
    await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": {"booked_slot": chosen_slot, "status": "booked"}}
    )

    return {
        "message": "Slot booked successfully",
        "slot": chosen_slot,
        "confirmation_message": confirmation
    }


@router.post("/proposal/{lead_id}")
async def get_proposal(lead_id: str):
    db = get_db()
    from bson import ObjectId

    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    result = generate_proposal(lead)

    # save proposal to lead record
    await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": {"package": result["raw"], "status": "proposal_sent"}}
    )

    return {
        "message": "Proposal generated",
        "packages": result["packages"],
        "raw": result["raw"]
    }


@router.post("/onboard/{lead_id}")
async def onboard_client(lead_id: str, first_session: str, package: str):
    db = get_db()
    from bson import ObjectId

    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    client_data = {
        "name": lead.get("name"),
        "goal": lead.get("goal"),
        "format": lead.get("format"),
        "package": package,
        "first_session": first_session
    }

    welcome = generate_welcome_message(client_data)
    checklist = generate_onboarding_checklist(client_data)

    # update status to onboarded
    await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": {"status": "onboarded", "package": package}}
    )

    return {
        "message": "Client onboarded successfully",
        "welcome_message": welcome,
        "checklist": checklist["welcome_checklist"]
    }


@router.post("/followup/{lead_id}")
async def send_followup(lead_id: str, session_number: int):
    db = get_db()
    from bson import ObjectId

    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    message = generate_followup_message(lead, session_number)

    return {
        "message": "Follow-up generated",
        "followup_message": message
    }


@router.get("/all")
async def get_all_leads():
    db = get_db()
    leads = []

    async for lead in db.leads.find():
        lead["_id"] = str(lead["_id"])
        leads.append(lead)

    return {"leads": leads}