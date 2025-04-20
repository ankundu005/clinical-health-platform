import pytest
from httpx import AsyncClient
from datetime import date

from .test_main import test_client, override_get_db, test_db


@pytest.mark.asyncio
async def test_create_patient(test_client):
    response = await test_client.post(
        "/api/patients/",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "date_of_birth": "1990-01-01",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "ecn_dysfunction_confirmed": True,
            "inflammatory_markers_level": 2.5
        },
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["email"] == "john.doe@example.com"
    assert data["ecn_dysfunction_confirmed"] == True
    assert data["inflammatory_markers_level"] == 2.5
    assert "id" in data


@pytest.mark.asyncio
async def test_read_patients(test_client):
    # Create a test patient first
    await test_client.post(
        "/api/patients/",
        json={
            "first_name": "Jane",
            "last_name": "Smith",
            "date_of_birth": "1985-05-15",
            "email": "jane.smith@example.com",
            "phone": "987-654-3210",
            "ecn_dysfunction_confirmed": False,
            "inflammatory_markers_level": 1.2
        },
    )
    
    # Get all patients
    response = await test_client.get("/api/patients/")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1  # We should have at least the patient we just created


@pytest.mark.asyncio
async def test_read_patient(test_client):
    # Create a test patient first
    create_response = await test_client.post(
        "/api/patients/",
        json={
            "first_name": "Robert",
            "last_name": "Johnson",
            "date_of_birth": "1975-08-20",
            "email": "robert.johnson@example.com",
            "phone": "555-123-4567",
            "ecn_dysfunction_confirmed": True,
            "inflammatory_markers_level": 3.7
        },
    )
    
    patient_id = create_response.json()["id"]
    
    # Get the patient by ID
    response = await test_client.get(f"/api/patients/{patient_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Robert"
    assert data["last_name"] == "Johnson"
    assert data["email"] == "robert.johnson@example.com"


@pytest.mark.asyncio
async def test_update_patient(test_client):
    # Create a test patient first
    create_response = await test_client.post(
        "/api/patients/",
        json={
            "first_name": "Sarah",
            "last_name": "Williams",
            "date_of_birth": "1980-03-10",
            "email": "sarah.williams@example.com",
            "phone": "444-555-6666",
            "ecn_dysfunction_confirmed": False,
            "inflammatory_markers_level": 1.5
        },
    )
    
    patient_id = create_response.json()["id"]
    
    # Update the patient
    response = await test_client.patch(
        f"/api/patients/{patient_id}",
        json={
            "ecn_dysfunction_confirmed": True,
            "inflammatory_markers_level": 2.8
        },
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Sarah"  # Unchanged
    assert data["ecn_dysfunction_confirmed"] == True  # Changed
    assert data["inflammatory_markers_level"] == 2.8  # Changed


@pytest.mark.asyncio
async def test_delete_patient(test_client):
    # Create a test patient first
    create_response = await test_client.post(
        "/api/patients/",
        json={
            "first_name": "Michael",
            "last_name": "Brown",
            "date_of_birth": "1995-11-25",
            "email": "michael.brown@example.com",
            "phone": "777-888-9999",
            "ecn_dysfunction_confirmed": True,
            "inflammatory_markers_level": 4.2
        },
    )
    
    patient_id = create_response.json()["id"]
    
    # Delete the patient
    response = await test_client.delete(f"/api/patients/{patient_id}")
    
    assert response.status_code == 200
    
    # Try to get the deleted patient
    get_response = await test_client.get(f"/api/patients/{patient_id}")
    assert get_response.status_code == 404
