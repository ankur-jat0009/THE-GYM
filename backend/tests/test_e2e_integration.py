import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_complete_gym_operations_lifecycle():
    # 1. Verify Verified Business Info
    gym_info_res = client.get("/api/v1/gym-info")
    assert gym_info_res.status_code == 200
    gym = gym_info_res.json()
    assert gym["name"] == "THE GYM"
    assert gym["phone"] == "+91 99929 63807"
    assert gym["rating"] == 5.0
    assert gym["review_count"] == 9
    assert "Sector 69, Gurugram" in gym["address"]

    # 2. Verify Membership Plans on Public Site are Dynamic
    public_plans_res = client.get("/api/v1/membership-plans")
    assert public_plans_res.status_code == 200
    plans = public_plans_res.json()
    assert len(plans) >= 4
    first_plan = plans[0]

    # 3. Admin Logs In
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@thegym.com", "password": "AdminPassword@123"},
    )
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 4. Admin Edits a Plan Price and Verifies Dynamic Update on Public Website
    new_price = float(first_plan["price"]) + 150.0
    update_res = client.patch(
        f"/api/v1/admin/membership-plans/{first_plan['id']}",
        json={"price": new_price, "description": "Updated dynamically by admin test"},
        headers={**admin_headers, "Content-Type": "application/json"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["price"] == new_price

    # Immediately check public website endpoint
    public_check = client.get("/api/v1/membership-plans")
    updated_plan_in_public = next(p for p in public_check.json() if p["id"] == first_plan["id"])
    assert updated_plan_in_public["price"] == new_price
    assert updated_plan_in_public["description"] == "Updated dynamically by admin test"

    # Revert back for cleanliness
    client.patch(
        f"/api/v1/admin/membership-plans/{first_plan['id']}",
        json={"price": float(first_plan["price"])},
        headers={**admin_headers, "Content-Type": "application/json"},
    )

    # 5. Customer Registration Flow
    import time
    t_stamp = int(time.time())
    new_cust_email = f"athlete_{t_stamp}@gmail.com"
    new_cust_phone = f"9811{t_stamp % 1000000:06d}"

    cust_reg = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Vikram Singh",
            "email": new_cust_email,
            "phone": new_cust_phone,
            "password": "AthletePassword@123",
            "gender": "Male",
            "date_of_birth": "1995-10-15",
        },
    )
    assert cust_reg.status_code == 201
    cust_data = cust_reg.json()
    cust_id = cust_data["user"]["id"]
    cust_token = cust_data["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    # 6. Admin assigns Quarterly Pro membership to Vikram
    quarterly_plan = next(p for p in plans if "Quarterly" in p["name"])
    assign_res = client.post(
        "/api/v1/admin/memberships/assign",
        json={
            "user_id": cust_id,
            "plan_id": quarterly_plan["id"],
            "discount_amount": 300.0,
            "notes": "E2E automated integration test assignment",
        },
        headers=admin_headers,
    )
    assert assign_res.status_code == 200
    membership_info = assign_res.json()
    membership_id = membership_info["id"]
    assert membership_info["discount_amount"] == 300.0
    assert membership_info["final_amount"] == float(quarterly_plan["price"]) - 300.0

    # 7. Customer checks their fee overview
    cust_fees = client.get("/api/v1/users/me/payments", headers=cust_headers)
    assert cust_fees.status_code == 200
    fee_overview = cust_fees.json()
    assert fee_overview["total_fee"] == float(quarterly_plan["price"]) - 300.0
    assert fee_overview["amount_paid"] == 0.0
    assert fee_overview["payment_status"] == "UNPAID"

    # 8. Admin records partial payment of ₹2,000 via UPI
    pay_res = client.post(
        "/api/v1/admin/payments",
        json={
            "membership_id": membership_id,
            "amount": 2000.0,
            "payment_method": "UPI",
            "transaction_reference": "UPI/VIKRAM/2026/TEST",
            "remarks": "Partial advance fee paid via PhonePe",
        },
        headers=admin_headers,
    )
    assert pay_res.status_code == 201
    payment_record = pay_res.json()
    receipt_no = payment_record["receipt_number"]
    assert "TG-" in receipt_no

    # Customer re-checks fee overview: status is now PARTIAL
    cust_fees_after = client.get("/api/v1/users/me/payments", headers=cust_headers)
    assert cust_fees_after.status_code == 200
    assert cust_fees_after.json()["amount_paid"] == 2000.0
    assert cust_fees_after.json()["payment_status"] == "PARTIAL"

    # 9. Verify Official Receipt Data
    receipt_res = client.get(f"/api/v1/payments/{payment_record['id']}/receipt", headers=cust_headers)
    assert receipt_res.status_code == 200
    receipt = receipt_res.json()
    assert receipt["gym_name"] == "THE GYM"
    assert receipt["customer_name"] == "Vikram Singh"
    assert receipt["amount_paid"] == 2000.0
    assert receipt["receipt_number"] == receipt_no
    assert receipt["remaining_balance"] == fee_overview["total_fee"] - 2000.0

    # 10. Customer gets QR attendance token & Staff scans it
    qr_res = client.get("/api/v1/attendance/qr", headers=cust_headers)
    assert qr_res.status_code == 200
    qr_payload = qr_res.json()["token_payload"]

    # Staff scans customer's QR pass
    first_scan = client.post(
        "/api/v1/attendance/scan",
        json={"qr_payload": qr_payload, "method": "QR_SCAN"},
        headers=admin_headers,
    )
    assert first_scan.status_code == 200
    assert "Attendance recorded successfully" in first_scan.json()["message"]

    # Immediate second scan must reject as duplicate (409 Conflict)
    dup_scan = client.post(
        "/api/v1/attendance/scan",
        json={"qr_payload": qr_payload, "method": "QR_SCAN"},
        headers=admin_headers,
    )
    assert dup_scan.status_code == 409
    assert "Duplicate scan" in dup_scan.json()["detail"]

    # Customer verifies calendar matrix
    cust_att = client.get("/api/v1/users/me/attendance", headers=cust_headers)
    assert cust_att.status_code == 200
    assert cust_att.json()["present_days_count"] >= 1

    # 11. Admin Assigns Workout Routine to Customer
    wp_res = client.get("/api/v1/workouts/plans")
    plans_list = wp_res.json()
    assert len(plans_list) > 0
    test_workout = plans_list[0]

    w_assign_res = client.post(
        "/api/v1/admin/workouts/assign",
        json={
            "user_id": cust_id,
            "plan_id": test_workout["id"],
            "notes": "Focus on progressive overload",
        },
        headers=admin_headers,
    )
    assert w_assign_res.status_code == 200

    # Customer immediately sees assigned workout
    cust_w = client.get("/api/v1/users/me/workouts", headers=cust_headers)
    assert cust_w.status_code == 200
    assert cust_w.json()["has_assignment"] is True
    assert cust_w.json()["plan"]["title"] == test_workout["title"]

    # 12. Verify In-App Notifications
    notif_res = client.get("/api/v1/notifications", headers=cust_headers)
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert len(notifs["items"]) > 0
    # Customer marks the top notification as read
    first_notif = notifs["items"][0]
    read_res = client.patch(f"/api/v1/notifications/{first_notif['id']}/read", headers=cust_headers)
    assert read_res.status_code == 200
