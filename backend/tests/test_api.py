import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_gym_info():
    response = client.get("/api/v1/gym-info")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "THE GYM"
    assert data["phone"] == "+91 99929 63807"
    assert data["rating"] == 5.0
    assert data["review_count"] == 9
    assert "Sector 69, Gurugram" in data["address"]


def test_public_membership_plans():
    response = client.get("/api/v1/membership-plans")
    assert response.status_code == 200
    plans = response.json()
    assert len(plans) >= 4
    plan_names = [p["name"] for p in plans]
    assert "Quarterly Pro" in plan_names
    # Verify no zero or negative prices
    for p in plans:
        assert p["price"] > 0
        assert len(p["features"]) > 0


def test_workout_categories_and_plans():
    response = client.get("/api/v1/workouts/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) >= 5
    slugs = [c["slug"] for c in cats]
    assert "fat-loss" in slugs
    assert "muscle-gain" in slugs
    assert "beginner-workout" in slugs

    plans_resp = client.get("/api/v1/workouts/plans?category_slug=muscle-gain")
    assert plans_resp.status_code == 200
    plans = plans_resp.json()
    assert len(plans) > 0
    assert len(plans[0]["exercises"]) > 0


def test_admin_and_customer_auth_flow():
    # 1. Admin Login
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@thegym.com", "password": "AdminPassword@123"},
    )
    assert admin_login.status_code == 200
    admin_data = admin_login.json()
    assert "access_token" in admin_data
    assert admin_data["user"]["role"] == "admin"
    admin_token = admin_data["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Admin Dashboard KPIs
    summary_resp = client.get("/api/v1/admin/dashboard/summary", headers=admin_headers)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["kpis"]["total_customers"] >= 3
    assert summary["kpis"]["active_members"] >= 1

    # 3. Customer Login (Rahul)
    rahul_login = client.post(
        "/api/v1/auth/login",
        json={"username": "rahul@gmail.com", "password": "MemberPassword@123"},
    )
    assert rahul_login.status_code == 200
    rahul_token = rahul_login.json()["access_token"]
    rahul_headers = {"Authorization": f"Bearer {rahul_token}"}

    # 4. Rahul fetches QR attendance token
    qr_resp = client.get("/api/v1/attendance/qr", headers=rahul_headers)
    assert qr_resp.status_code == 200
    qr_data = qr_resp.json()
    assert "token_payload" in qr_data

    # 5. Customer cannot scan their own QR code (requires admin/staff)
    cust_scan_attempt = client.post(
        "/api/v1/attendance/scan",
        json={"qr_payload": qr_data["token_payload"]},
        headers=rahul_headers,
    )
    assert cust_scan_attempt.status_code == 403

    # 6. Admin scans Rahul's QR code
    admin_scan = client.post(
        "/api/v1/attendance/scan",
        json={"qr_payload": qr_data["token_payload"]},
        headers=admin_headers,
    )
    # Could be 200 (if not checked in today) or 409 (if duplicate check-in already recorded by seed)
    assert admin_scan.status_code in [200, 409]

    # If scanned again today, must reject with 409 Conflict
    second_scan = client.post(
        "/api/v1/attendance/scan",
        json={"qr_payload": qr_data["token_payload"]},
        headers=admin_headers,
    )
    assert second_scan.status_code == 409
    assert "Duplicate scan" in second_scan.json()["detail"] or "already marked present" in second_scan.json()["detail"]

    # 7. Customer views profile, fees, and attendance
    profile_resp = client.get("/api/v1/users/me", headers=rahul_headers)
    assert profile_resp.status_code == 200
    assert profile_resp.json()["full_name"] == "Rahul Sharma"

    att_resp = client.get("/api/v1/users/me/attendance", headers=rahul_headers)
    assert att_resp.status_code == 200
    assert att_resp.json()["present_days_count"] > 0

    fee_resp = client.get("/api/v1/users/me/payments", headers=rahul_headers)
    assert fee_resp.status_code == 200
    assert fee_resp.json()["total_fee"] > 0
    assert len(fee_resp.json()["history"]) > 0


def test_customer_registration_and_isolation():
    import random
    unique_phone = f"9911{random.randint(100000, 999999)}"
    unique_email = f"testmember{random.randint(1000, 9999)}@gmail.com"

    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Athlete",
            "email": unique_email,
            "phone": unique_phone,
            "password": "SecurePassword@123",
            "gender": "Male",
            "date_of_birth": "1998-04-12",
        },
    )
    assert reg_resp.status_code == 201
    auth_data = reg_resp.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify no membership assigned initially
    m_resp = client.get("/api/v1/users/me/membership", headers=headers)
    assert m_resp.status_code == 200
    assert m_resp.json()["has_membership"] is False

    # Verify no payments yet
    p_resp = client.get("/api/v1/users/me/payments", headers=headers)
    assert p_resp.status_code == 200
    assert p_resp.json()["payment_status"] == "NO_MEMBERSHIP"
